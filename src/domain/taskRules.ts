import type { WritingTask } from './models';

export const MAX_ACTIVE_TASKS = 3;
export const MAX_TASK_TITLE_LENGTH = 120;

export function normalizeTaskTitle(title: string): string {
  return title.trim().replace(/\s+/gu, ' ');
}

export function canAddTask(tasks: WritingTask[], projectId: string): boolean {
  const activeTasks = tasks.filter(
    (task) =>
      task.projectId === projectId && task.status !== 'archived' && task.status !== 'completed',
  );

  return activeTasks.length < MAX_ACTIVE_TASKS;
}

export function validateTaskTitle(title: string): string | null {
  const normalizedTitle = normalizeTaskTitle(title);

  if (!normalizedTitle) {
    return 'Donne un résultat concret à produire.';
  }

  if (normalizedTitle.length > MAX_TASK_TITLE_LENGTH) {
    return `Reste sous ${MAX_TASK_TITLE_LENGTH} caractères.`;
  }

  return null;
}

const VAGUE_OPENINGS = /^(avancer|continuer|faire|travailler|réfléchir|voir)\b/iu;

export function getTaskGuidance(title: string): string {
  const normalizedTitle = normalizeTaskTitle(title);

  if (!normalizedTitle) return 'Commence par un verbe : rédiger, résumer, expliquer, comparer…';
  if (VAGUE_OPENINGS.test(normalizedTitle)) {
    return 'Précise le résultat visible. Exemple : « Rédiger l’introduction en 300 mots ».';
  }

  return 'La pièce est assez précise pour entrer dans la forge.';
}
