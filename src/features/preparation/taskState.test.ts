import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../domain/models';
import { createTask, moveTask, removeTask, selectTask } from './taskState';

const now = '2026-08-18T10:00:00.000Z';

describe('task preparation state', () => {
  it('creates at most three ordered tasks and selects the first', () => {
    let state = createInitialState();
    for (const [id, title] of ['Écrire le plan', 'Rédiger la scène', 'Relire le jet'].entries()) {
      state = createTask(state, title, String(id), now);
    }
    state = createTask(state, 'Une tâche de trop', 'four', now);

    expect(state.tasks).toHaveLength(3);
    expect(state.tasks.map((task) => task.status)).toEqual(['active', 'ready', 'ready']);
  });

  it('selects, reorders and removes tasks without losing an active task', () => {
    let state = createTask(createInitialState(), 'Première', 'one', now);
    state = createTask(state, 'Deuxième', 'two', now);
    const secondId = state.tasks[1].id;

    state = selectTask(state, secondId);
    state = moveTask(state, secondId, -1);
    state = removeTask(state, secondId);

    expect(state.tasks).toHaveLength(1);
    expect(state.tasks[0]).toMatchObject({ order: 0, status: 'active' });
  });
});
