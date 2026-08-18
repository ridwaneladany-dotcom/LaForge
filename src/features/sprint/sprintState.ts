import type { AppState, WritingDraft, WritingSprint } from '../../domain/models';

export function startSprint(
  state: AppState,
  taskId: string,
  id: string,
  startedAt: string,
): AppState {
  if (state.sprints.some((sprint) => sprint.status === 'running')) return state;

  const task = state.tasks.find((candidate) => candidate.id === taskId);
  if (!task) return state;

  const draft: WritingDraft = {
    id: `draft-${id}`,
    taskId,
    content: task.seed,
    createdAt: startedAt,
    updatedAt: startedAt,
  };
  const plannedEndAt = new Date(
    new Date(startedAt).getTime() + task.durationMinutes * 60_000,
  ).toISOString();
  const sprint: WritingSprint = {
    id: `sprint-${id}`,
    taskId,
    draftId: draft.id,
    durationMinutes: task.durationMinutes,
    wordGoal: task.wordGoal,
    startedAt,
    plannedEndAt,
    endedAt: null,
    status: 'running',
  };

  return { ...state, drafts: [...state.drafts, draft], sprints: [...state.sprints, sprint] };
}

export function updateDraftContent(
  state: AppState,
  draftId: string,
  content: string,
  timestamp: string,
): AppState {
  return {
    ...state,
    drafts: state.drafts.map((draft) =>
      draft.id === draftId ? { ...draft, content, updatedAt: timestamp } : draft,
    ),
  };
}

function closeSprint(
  state: AppState,
  sprintId: string,
  status: 'completed' | 'exited',
  timestamp: string,
): AppState {
  return {
    ...state,
    sprints: state.sprints.map((sprint) =>
      sprint.id === sprintId ? { ...sprint, status, endedAt: timestamp } : sprint,
    ),
  };
}

export function completeSprint(state: AppState, sprintId: string, timestamp: string): AppState {
  return closeSprint(state, sprintId, 'completed', timestamp);
}

export function exitSprint(state: AppState, sprintId: string, timestamp: string): AppState {
  return closeSprint(state, sprintId, 'exited', timestamp);
}
