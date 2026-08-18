import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../domain/models';
import { createTask, getPreparedTasks } from '../preparation/taskState';
import { createProject, getProjectSummaries, renameProject, selectProject } from './projectState';

const now = '2026-08-18T10:00:00.000Z';

describe('project state', () => {
  it('creates, renames and selects local projects', () => {
    let state = createProject(createInitialState(), '  Mémoire   de master ', 'one', now);
    state = createProject(state, 'Newsletter', 'two', now);
    state = renameProject(state, 'project-one', 'Mémoire 2026', now);
    state = selectProject(state, 'project-one');

    expect(state.projects.map((project) => project.name)).toEqual(['Mémoire 2026', 'Newsletter']);
    expect(state.preferences.activeProjectId).toBe('project-one');
  });

  it('keeps a separate three-task queue for each project', () => {
    let state = createProject(createInitialState(), 'Projet A', 'a', now);
    state = createTask(state, 'Tâche A', 'task-a', now);
    state = createProject(state, 'Projet B', 'b', now);
    state = createTask(state, 'Tâche B', 'task-b', now);

    expect(getPreparedTasks(state).map((task) => task.title)).toEqual(['Tâche B']);
    expect(getProjectSummaries(state).map((summary) => summary.openTaskCount)).toEqual([1, 1]);
  });
});
