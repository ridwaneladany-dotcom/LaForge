import type { AppState, PracticeDay, WritingDraft, WritingSprint } from '../../domain/models';
import { countWords } from '../sprint/wordCount';

export interface SprintMetrics {
  minutes: number;
  words: number;
  reachedGoal: boolean | null;
}

export function getSprintMetrics(sprint: WritingSprint, draft: WritingDraft): SprintMetrics {
  const endedAt = sprint.endedAt ?? sprint.plannedEndAt;
  const minutes = Math.max(
    1,
    Math.ceil((new Date(endedAt).getTime() - new Date(sprint.startedAt).getTime()) / 60_000),
  );
  const words = Math.max(0, countWords(draft.content) - (sprint.initialWordCount ?? 0));

  return {
    minutes,
    words,
    reachedGoal: sprint.wordGoal === null ? null : words >= sprint.wordGoal,
  };
}

export function getCurrentStreak(practice: PracticeDay[], currentDate: string): number {
  const activeDates = new Set(
    practice.filter((day) => day.completedSprints > 0).map((day) => day.date),
  );
  const cursor = new Date(`${currentDate}T12:00:00.000Z`);
  let streak = 0;

  while (activeDates.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return streak;
}

export function continueSprint(
  state: AppState,
  previousSprintId: string,
  id: string,
  startedAt: string,
  durationMinutes = 5,
): AppState {
  if (state.sprints.some((sprint) => sprint.status === 'running')) return state;

  const previousSprint = state.sprints.find((sprint) => sprint.id === previousSprintId);
  const previousDraft = state.drafts.find((draft) => draft.id === previousSprint?.draftId);
  if (!previousSprint || !previousDraft) return state;

  const draft: WritingDraft = {
    id: `draft-${id}`,
    taskId: previousSprint.taskId,
    kind: 'sprint',
    sourceDraftId: previousDraft.id,
    content: previousDraft.content,
    createdAt: startedAt,
    updatedAt: startedAt,
  };
  const sprint: WritingSprint = {
    id: `sprint-${id}`,
    taskId: previousSprint.taskId,
    draftId: draft.id,
    durationMinutes,
    initialWordCount: countWords(draft.content),
    wordGoal: null,
    startedAt,
    plannedEndAt: new Date(new Date(startedAt).getTime() + durationMinutes * 60_000).toISOString(),
    endedAt: null,
    status: 'running',
  };

  return { ...state, drafts: [...state.drafts, draft], sprints: [...state.sprints, sprint] };
}

export function createRevisionDraft(
  state: AppState,
  sourceDraftId: string,
  id: string,
  timestamp: string,
): AppState {
  const source = state.drafts.find((draft) => draft.id === sourceDraftId);
  if (!source) return state;

  const revision: WritingDraft = {
    id: `draft-${id}`,
    taskId: source.taskId,
    kind: 'revision',
    sourceDraftId: source.id,
    content: source.content,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  return { ...state, drafts: [...state.drafts, revision] };
}

export function completeTask(state: AppState, taskId: string, timestamp: string): AppState {
  const remainingTasks = state.tasks
    .filter((task) => task.id !== taskId && task.status === 'ready')
    .sort((left, right) => left.order - right.order);
  const nextTaskId = remainingTasks[0]?.id;

  return {
    ...state,
    tasks: state.tasks.map((task) => {
      if (task.id === taskId) return { ...task, status: 'completed', updatedAt: timestamp };
      if (task.id === nextTaskId) return { ...task, status: 'active', updatedAt: timestamp };
      return task;
    }),
  };
}
