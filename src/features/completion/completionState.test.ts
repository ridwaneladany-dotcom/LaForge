import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../domain/models';
import { createTask } from '../preparation/taskState';
import { completeSprint, startSprint, updateDraftContent } from '../sprint/sprintState';
import {
  completeTask,
  continueSprint,
  createRevisionDraft,
  getCurrentStreak,
} from './completionState';

const start = '2026-08-18T10:00:00.000Z';
const end = '2026-08-18T10:05:00.000Z';

function completedState() {
  let state = createTask(createInitialState(), 'Écrire le chapitre', 'one', start);
  state = startSprint(state, state.tasks[0].id, 'one', start);
  state = updateDraftContent(state, state.drafts[0].id, 'Un deux trois quatre', end);
  return completeSprint(state, state.sprints[0].id, end);
}

describe('sprint completion', () => {
  it('records daily progress once and computes a streak', () => {
    const state = completedState();

    expect(state.practice[0]).toEqual({
      date: '2026-08-18',
      completedSprints: 1,
      minutesWritten: 5,
      wordsWritten: 4,
    });
    expect(getCurrentStreak(state.practice, '2026-08-18')).toBe(1);
  });

  it('continues from a preserved draft version', () => {
    const state = completedState();
    const continued = continueSprint(state, state.sprints[0].id, 'two', end);

    expect(continued.drafts).toHaveLength(2);
    expect(continued.drafts[1]).toMatchObject({
      content: 'Un deux trois quatre',
      sourceDraftId: continued.drafts[0].id,
    });
    expect(continued.sprints[1]).toMatchObject({ initialWordCount: 4, status: 'running' });
  });

  it('creates a revision copy and advances to the next task', () => {
    let state = completedState();
    state = createTask(state, 'Écrire la conclusion', 'two', end);
    state = createRevisionDraft(state, state.drafts[0].id, 'revision', end);
    state = completeTask(state, state.tasks[0].id, end);

    expect(state.drafts[1]).toMatchObject({ kind: 'revision', sourceDraftId: state.drafts[0].id });
    expect(state.tasks.map((task) => task.status)).toEqual(['completed', 'active']);
  });
});
