export const STORAGE_VERSION = 1 as const;
export const SPRINT_DURATIONS = [5, 15, 25, 45] as const;

export type SprintDuration = (typeof SPRINT_DURATIONS)[number];
export type TaskStatus = 'ready' | 'active' | 'completed' | 'archived';
export type SprintStatus = 'running' | 'completed' | 'exited';

export interface Preferences {
  defaultDuration: SprintDuration;
  hasCompletedOnboarding: boolean;
  soundEnabled: boolean;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface WritingTask {
  id: string;
  projectId: string;
  title: string;
  seed: string;
  order: number;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface WritingDraft {
  id: string;
  taskId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface WritingSprint {
  id: string;
  taskId: string;
  draftId: string;
  durationMinutes: SprintDuration;
  wordGoal: number | null;
  startedAt: string;
  endedAt: string | null;
  status: SprintStatus;
}

export interface PracticeDay {
  date: string;
  completedSprints: number;
  minutesWritten: number;
  wordsWritten: number;
}

export interface AppState {
  version: typeof STORAGE_VERSION;
  preferences: Preferences;
  projects: Project[];
  tasks: WritingTask[];
  drafts: WritingDraft[];
  sprints: WritingSprint[];
  practice: PracticeDay[];
}

export function createInitialState(): AppState {
  return {
    version: STORAGE_VERSION,
    preferences: {
      defaultDuration: 15,
      hasCompletedOnboarding: false,
      soundEnabled: false,
    },
    projects: [],
    tasks: [],
    drafts: [],
    sprints: [],
    practice: [],
  };
}
