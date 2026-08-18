import type { AppState, Project, WritingDraft, WritingTask } from '../../domain/models';

export type TextExportFormat = 'markdown' | 'text';

const MIME_TYPES: Record<TextExportFormat, string> = {
  markdown: 'text/markdown;charset=utf-8',
  text: 'text/plain;charset=utf-8',
};

const EXTENSIONS: Record<TextExportFormat, string> = {
  markdown: 'md',
  text: 'txt',
};

export function sanitizeFileName(value: string) {
  return (
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/gu, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/gu, '-')
      .replace(/^-+|-+$/gu, '') || 'laforge'
  );
}

function formatDate(timestamp: string) {
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date(timestamp));
}

export function formatDraftExport(
  task: WritingTask,
  draft: WritingDraft,
  format: TextExportFormat,
) {
  const content = draft.content.trimEnd();
  if (format === 'text') return `${content}\n`;

  return `# ${task.title}\n\n_${formatDate(draft.updatedAt)} · LaForge_\n\n${content}\n`;
}

export function formatProjectExport(state: AppState, projectId: string, format: TextExportFormat) {
  const project = state.projects.find((candidate) => candidate.id === projectId);
  if (!project) return '';

  const tasks = state.tasks
    .filter((task) => task.projectId === project.id)
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt));
  const sections = tasks.flatMap((task) =>
    state.drafts
      .filter((draft) => draft.taskId === task.id)
      .sort((left, right) => left.createdAt.localeCompare(right.createdAt))
      .map((draft, index) => ({ draft, index, task })),
  );

  if (format === 'text') {
    const body = sections
      .map(
        ({ draft, index, task }) =>
          `${task.title}\nJet ${index + 1} · ${formatDate(draft.updatedAt)}\n\n${draft.content.trimEnd()}`,
      )
      .join('\n\n----------------------------------------\n\n');
    return `${project.name}\nExport LaForge\n\n${body || 'Aucun jet conservé.'}\n`;
  }

  const body = sections
    .map(
      ({ draft, index, task }) =>
        `## ${task.title}\n\n### Jet ${index + 1} · ${formatDate(draft.updatedAt)}\n\n${draft.content.trimEnd()}`,
    )
    .join('\n\n---\n\n');
  return `# ${project.name}\n\n_Export LaForge_\n\n${body || '_Aucun jet conservé._'}\n`;
}

export function importTextIntoProject(
  state: AppState,
  projectId: string,
  fileName: string,
  content: string,
  id: string,
  timestamp: string,
): AppState {
  const project = state.projects.find((candidate) => candidate.id === projectId);
  if (!project || !content.trim()) return state;

  const title =
    fileName
      .replace(/\.(md|markdown|txt)$/iu, '')
      .trim()
      .slice(0, 120) || 'Texte importé';
  const task: WritingTask = {
    id: `task-import-${id}`,
    projectId,
    title,
    seed: '',
    durationMinutes: state.preferences.defaultDuration,
    wordGoal: null,
    order: 0,
    status: 'completed',
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  const draft: WritingDraft = {
    id: `draft-import-${id}`,
    taskId: task.id,
    kind: 'import',
    sourceDraftId: null,
    content,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  return {
    ...state,
    projects: state.projects.map((candidate) =>
      candidate.id === projectId ? { ...candidate, updatedAt: timestamp } : candidate,
    ),
    tasks: [...state.tasks, task],
    drafts: [...state.drafts, draft],
  };
}

export function formatBackup(state: AppState) {
  return `${JSON.stringify(state, null, 2)}\n`;
}

function downloadFile(fileName: string, content: string, mimeType: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mimeType }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadDraft(task: WritingTask, draft: WritingDraft, format: TextExportFormat) {
  downloadFile(
    `${sanitizeFileName(task.title)}.${EXTENSIONS[format]}`,
    formatDraftExport(task, draft, format),
    MIME_TYPES[format],
  );
}

export function downloadProject(state: AppState, project: Project, format: TextExportFormat) {
  downloadFile(
    `${sanitizeFileName(project.name)}.${EXTENSIONS[format]}`,
    formatProjectExport(state, project.id, format),
    MIME_TYPES[format],
  );
}

export function downloadBackup(state: AppState) {
  downloadFile(
    `laforge-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`,
    formatBackup(state),
    'application/json;charset=utf-8',
  );
}
