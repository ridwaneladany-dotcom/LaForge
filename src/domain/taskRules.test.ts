import { describe, expect, it } from 'vitest';

import type { WritingTask } from './models';
import { canAddTask, MAX_ACTIVE_TASKS, normalizeTaskTitle, validateTaskTitle } from './taskRules';

function createTask(index: number): WritingTask {
  return {
    id: `task-${index}`,
    projectId: 'project-1',
    title: `Tâche ${index}`,
    seed: '',
    durationMinutes: 15,
    wordGoal: null,
    order: index,
    status: 'ready',
    createdAt: '2026-08-18T00:00:00.000Z',
    updatedAt: '2026-08-18T00:00:00.000Z',
  };
}

describe('task rules', () => {
  it('normalizes whitespace before storing a title', () => {
    expect(normalizeTaskTitle('  Rédiger   une introduction  ')).toBe('Rédiger une introduction');
  });

  it('limits a project to three active tasks', () => {
    const tasks = Array.from({ length: MAX_ACTIVE_TASKS }, (_, index) => createTask(index));

    expect(canAddTask(tasks, 'project-1')).toBe(false);
    expect(canAddTask(tasks, 'another-project')).toBe(true);
  });

  it('requires a concrete non-empty title', () => {
    expect(validateTaskTitle('   ')).toBe('Donne un résultat concret à produire.');
    expect(validateTaskTitle('Écrire la conclusion')).toBeNull();
  });
});
