import type { AppState, WritingDraft, WritingSprint } from '../../domain/models';
import { countWords } from './wordCount';

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
    kind: 'sprint',
    sourceDraftId: null,
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
    initialWordCount: countWords(task.seed),
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
  const sprint = state.sprints.find((candidate) => candidate.id === sprintId);
  if (!sprint || sprint.status !== 'running') return state;

  return {
    ...state,
    sprints: state.sprints.map((sprint) =>
      sprint.id === sprintId ? { ...sprint, status, endedAt: timestamp } : sprint,
    ),
  };
}

export function completeSprint(state: AppState, sprintId: string, timestamp: string): AppState {
  const sprint = state.sprints.find((candidate) => candidate.id === sprintId);
  const draft = state.drafts.find((candidate) => candidate.id === sprint?.draftId);
  if (!sprint || !draft || sprint.status !== 'running') return state;

  const completedState = closeSprint(state, sprintId, 'completed', timestamp);
  const date = timestamp.slice(0, 10);
  const minutesWritten = Math.max(
    1,
    Math.ceil((new Date(timestamp).getTime() - new Date(sprint.startedAt).getTime()) / 60_000),
  );
  const wordsWritten = Math.max(0, countWords(draft.content) - (sprint.initialWordCount ?? 0));
  const existingDay = completedState.practice.find((day) => day.date === date);
  const practice = existingDay
    ? completedState.practice.map((day) =>
        day.date === date
          ? {
              ...day,
              completedSprints: day.completedSprints + 1,
              minutesWritten: day.minutesWritten + minutesWritten,
              wordsWritten: day.wordsWritten + wordsWritten,
            }
          : day,
      )
    : [...completedState.practice, { date, completedSprints: 1, minutesWritten, wordsWritten }];

  return { ...completedState, practice };
}

export function exitSprint(state: AppState, sprintId: string, timestamp: string): AppState {
  return closeSprint(state, sprintId, 'exited', timestamp);
}
