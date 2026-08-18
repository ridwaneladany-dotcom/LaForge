import type { AppState, Project, WritingTask } from '../../domain/models';
import { MAX_ACTIVE_TASKS, normalizeTaskTitle } from '../../domain/taskRules';

type TaskPatch = Pick<WritingTask, 'durationMinutes' | 'seed' | 'title' | 'wordGoal'>;

function activeTasks(state: AppState): WritingTask[] {
  return state.tasks
    .filter((task) => task.status === 'active' || task.status === 'ready')
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
  const currentTasks = activeTasks(state);
  if (currentTasks.length >= MAX_ACTIVE_TASKS) return state;

  const project: Project = state.projects[0] ?? {
    id: `project-${id}`,
    name: 'Mon atelier',
    createdAt: timestamp,
    updatedAt: timestamp,
  };
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
  return {
    ...state,
    tasks: state.tasks.map((task) => {
      if (task.status !== 'active' && task.status !== 'ready') return task;
      return { ...task, status: task.id === taskId ? 'active' : 'ready' };
    }),
  };
}

export function removeTask(state: AppState, taskId: string): AppState {
  const removedTask = state.tasks.find((task) => task.id === taskId);
  let tasks = state.tasks.filter((task) => task.id !== taskId);

  if (removedTask?.status === 'active') {
    const firstRemaining = activeTasks({ ...state, tasks })[0];
    tasks = tasks.map((task) =>
      task.id === firstRemaining?.id ? { ...task, status: 'active' } : task,
    );
  }

  return { ...state, tasks: normalizeOrder(tasks) };
}

export function moveTask(state: AppState, taskId: string, direction: -1 | 1): AppState {
  const ordered = activeTasks(state);
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
  return activeTasks(state);
}
