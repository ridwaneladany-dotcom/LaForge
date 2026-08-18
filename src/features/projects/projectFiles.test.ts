import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../domain/models';
import { createTask } from '../preparation/taskState';
import { updateDraftContent, startSprint } from '../sprint/sprintState';
import { createProject } from './projectState';
import {
  formatBackup,
  formatDraftExport,
  formatProjectExport,
  importTextIntoProject,
  sanitizeFileName,
} from './projectFiles';

const now = '2026-08-18T10:00:00.000Z';

function stateWithDraft() {
  let state = createProject(createInitialState(), 'Mémoire de master', 'project', now);
  state = createTask(state, 'Rédiger l’introduction', 'task', now);
  state = startSprint(state, state.tasks[0].id, 'sprint', now);
  return updateDraftContent(state, state.drafts[0].id, 'Une matière importante.', now);
}

describe('project files', () => {
  it('formats a draft and a complete project without losing content', () => {
    const state = stateWithDraft();

    expect(formatDraftExport(state.tasks[0], state.drafts[0], 'text')).toBe(
      'Une matière importante.\n',
    );
    expect(formatProjectExport(state, state.projects[0].id, 'markdown')).toContain(
      '# Mémoire de master',
    );
    expect(formatProjectExport(state, state.projects[0].id, 'markdown')).toContain(
      'Une matière importante.',
    );
  });

  it('imports text as a preserved draft without adding it to the active queue', () => {
    const initialState = createProject(createInitialState(), 'Notes', 'notes', now);
    const state = importTextIntoProject(
      initialState,
      'project-notes',
      'chapitre.md',
      '# Un chapitre',
      'one',
      now,
    );

    expect(state.tasks[0]).toMatchObject({ title: 'chapitre', status: 'completed' });
    expect(state.drafts[0]).toMatchObject({ kind: 'import', content: '# Un chapitre' });
  });

  it('creates portable file names and a versioned full backup', () => {
    const state = stateWithDraft();

    expect(sanitizeFileName('Écrire : déjà !')).toBe('ecrire-deja');
    expect(JSON.parse(formatBackup(state))).toMatchObject({ version: 4 });
  });
});
