import type { AppState, Project } from '../../domain/models';

export const MAX_PROJECT_NAME_LENGTH = 60;

export type ProjectSummary = {
  draftCount: number;
  openTaskCount: number;
  project: Project;
  updatedAt: string;
};

export function normalizeProjectName(name: string) {
  return name.trim().replace(/\s+/gu, ' ');
}

export function validateProjectName(name: string) {
  const normalizedName = normalizeProjectName(name);
  if (!normalizedName) return 'Donnez un nom à ce projet.';
  if (normalizedName.length > MAX_PROJECT_NAME_LENGTH) {
    return `Utilisez ${MAX_PROJECT_NAME_LENGTH} caractères maximum.`;
  }
  return null;
}

export function createProject(
  state: AppState,
  name: string,
  id: string,
  timestamp: string,
): AppState {
  if (validateProjectName(name)) return state;

  const project: Project = {
    id: `project-${id}`,
    name: normalizeProjectName(name),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  return {
    ...state,
    preferences: { ...state.preferences, activeProjectId: project.id },
    projects: [...state.projects, project],
  };
}

export function renameProject(
  state: AppState,
  projectId: string,
  name: string,
  timestamp: string,
): AppState {
  if (validateProjectName(name)) return state;

  return {
    ...state,
    projects: state.projects.map((project) =>
      project.id === projectId
        ? { ...project, name: normalizeProjectName(name), updatedAt: timestamp }
        : project,
    ),
  };
}

export function selectProject(state: AppState, projectId: string): AppState {
  if (!state.projects.some((project) => project.id === projectId)) return state;

  return {
    ...state,
    preferences: { ...state.preferences, activeProjectId: projectId },
  };
}

export function getActiveProject(state: AppState) {
  return (
    state.projects.find((project) => project.id === state.preferences.activeProjectId) ??
    state.projects[0] ??
    null
  );
}

export function getProjectSummaries(state: AppState): ProjectSummary[] {
  return state.projects
    .map((project) => {
      const tasks = state.tasks.filter((task) => task.projectId === project.id);
      const taskIds = new Set(tasks.map((task) => task.id));
      const drafts = state.drafts.filter((draft) => taskIds.has(draft.taskId));
      const updatedAt = [
        project.updatedAt,
        ...tasks.map((task) => task.updatedAt),
        ...drafts.map((draft) => draft.updatedAt),
      ].sort((left, right) => right.localeCompare(left))[0];

      return {
        draftCount: drafts.length,
        openTaskCount: tasks.filter((task) => task.status === 'active' || task.status === 'ready')
          .length,
        project,
        updatedAt,
      };
    })
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}
