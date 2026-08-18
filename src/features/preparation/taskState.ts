import type { AppState, Project, WritingTask } from '../../domain/models';
import { MAX_ACTIVE_TASKS, normalizeTaskTitle } from '../../domain/taskRules';

type TaskPatch = Pick<WritingTask, 'durationMinutes' | 'seed' | 'title' | 'wordGoal'>;

function activeTasks(state: AppState, projectId: string | null): WritingTask[] {
  return state.tasks
    .filter(
      (task) =>
        task.projectId === projectId && (task.status === 'active' || task.status === 'ready'),
    )
    .sort((left, right) => left.order - right.order);
}

function normalizeOrder(tasks: WritingTask[]): WritingTask[] {
  const relevantIds = tasks
    .filter((task) => task.status === 'active' || task.status === 'ready')
    .sort((left, right) => left.order - right.order)
    .map((task) => task.id);

  return tasks.map((task) => {
    const order = relevantIds.indexOf(task.id);
    return order === -1 ? task : { ...task, order };
  });
}

export function createTask(
  state: AppState,
  title: string,
  id: string,
  timestamp: string,
): AppState {
  const project: Project = state.projects.find(
    (candidate) => candidate.id === state.preferences.activeProjectId,
  ) ??
    state.projects[0] ?? {
      id: `project-${id}`,
      name: 'Mon atelier',
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  const currentTasks = activeTasks(state, project.id);
  if (currentTasks.length >= MAX_ACTIVE_TASKS) return state;
  const task: WritingTask = {
    id: `task-${id}`,
    projectId: project.id,
    title: normalizeTaskTitle(title),
    seed: '',
    durationMinutes: state.preferences.defaultDuration,
    wordGoal: null,
    order: currentTasks.length,
    status: currentTasks.length === 0 ? 'active' : 'ready',
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  return {
    ...state,
    preferences: { ...state.preferences, activeProjectId: project.id },
    projects: state.projects.length === 0 ? [project] : state.projects,
    tasks: [...state.tasks, task],
  };
}

export function updateTask(
  state: AppState,
  taskId: string,
  patch: Partial<TaskPatch>,
  timestamp: string,
): AppState {
  return {
    ...state,
    tasks: state.tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            ...patch,
            updatedAt: timestamp,
          }
        : task,
    ),
  };
}

export function selectTask(state: AppState, taskId: string): AppState {
  const selectedTask = state.tasks.find((task) => task.id === taskId);
  if (!selectedTask) return state;

  return {
    ...state,
    tasks: state.tasks.map((task) => {
      if (
        task.projectId !== selectedTask.projectId ||
        (task.status !== 'active' && task.status !== 'ready')
      ) {
        return task;
      }
      return { ...task, status: task.id === taskId ? 'active' : 'ready' };
    }),
  };
}

export function removeTask(state: AppState, taskId: string): AppState {
  const removedTask = state.tasks.find((task) => task.id === taskId);
  let tasks = state.tasks.filter((task) => task.id !== taskId);

  if (removedTask?.status === 'active') {
    const firstRemaining = activeTasks({ ...state, tasks }, removedTask.projectId)[0];
    tasks = tasks.map((task) =>
      task.id === firstRemaining?.id ? { ...task, status: 'active' } : task,
    );
  }

  return { ...state, tasks: normalizeOrder(tasks) };
}

export function moveTask(state: AppState, taskId: string, direction: -1 | 1): AppState {
  const projectId = state.tasks.find((task) => task.id === taskId)?.projectId ?? null;
  const ordered = activeTasks(state, projectId);
  const from = ordered.findIndex((task) => task.id === taskId);
  const to = from + direction;
  if (from < 0 || to < 0 || to >= ordered.length) return state;

  const reordered = [...ordered];
  [reordered[from], reordered[to]] = [reordered[to], reordered[from]];
  const orderById = new Map(reordered.map((task, index) => [task.id, index]));

  return {
    ...state,
    tasks: state.tasks.map((task) => ({ ...task, order: orderById.get(task.id) ?? task.order })),
  };
}

export function getPreparedTasks(state: AppState): WritingTask[] {
  return activeTasks(state, state.preferences.activeProjectId ?? state.projects[0]?.id ?? null);
}
