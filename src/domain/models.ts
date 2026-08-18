export const STORAGE_VERSION = 4 as const;
export const SPRINT_DURATIONS = [5, 15, 25, 45] as const;

export type SprintDuration = number;
export type TaskStatus = 'ready' | 'active' | 'completed' | 'archived';
export type SprintStatus = 'running' | 'completed' | 'exited';

export interface Preferences {
  activeProjectId: string | null;
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
  durationMinutes: SprintDuration;
  wordGoal: number | null;
  order: number;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface WritingDraft {
  id: string;
  taskId: string;
  kind: 'sprint' | 'revision' | 'import';
  sourceDraftId: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface WritingSprint {
  id: string;
  taskId: string;
  draftId: string;
  durationMinutes: SprintDuration;
  initialWordCount: number;
  wordGoal: number | null;
  startedAt: string;
  plannedEndAt: string;
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
      activeProjectId: null,
      defaultDuration: 15,
      hasCompletedOnboarding: false,
      soundEnabled: true,
    },
    projects: [],
    tasks: [],
    drafts: [],
    sprints: [],
    practice: [],
  };
}
