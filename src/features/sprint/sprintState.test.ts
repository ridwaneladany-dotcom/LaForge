import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../domain/models';
import { createTask } from '../preparation/taskState';
import { completeSprint, startSprint, updateDraftContent } from './sprintState';

const startedAt = '2026-08-18T10:00:00.000Z';

describe('writing sprint state', () => {
  it('starts a persisted sprint and draft from the prepared task', () => {
    const preparedState = createTask(createInitialState(), 'Rédiger le chapitre', 'one', startedAt);
    const state = startSprint(preparedState, preparedState.tasks[0].id, 'one', startedAt);

    expect(state.drafts[0]).toMatchObject({ content: '', taskId: preparedState.tasks[0].id });
    expect(state.sprints[0]).toMatchObject({
      status: 'running',
      plannedEndAt: '2026-08-18T10:15:00.000Z',
    });
  });

  it('updates the draft and completes the sprint without losing text', () => {
    let state = createTask(createInitialState(), 'Écrire', 'one', startedAt);
    state = startSprint(state, state.tasks[0].id, 'one', startedAt);
    state = updateDraftContent(state, state.drafts[0].id, 'Du texte forgé.', startedAt);
    state = completeSprint(state, state.sprints[0].id, startedAt);

    expect(state.drafts[0].content).toBe('Du texte forgé.');
    expect(state.sprints[0].status).toBe('completed');
  });
});
