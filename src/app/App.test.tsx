import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { saveAppState } from '../data/localStore';
import { createInitialState } from '../domain/models';
import { App } from './App';

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
    const state = createInitialState();
    state.preferences.hasCompletedOnboarding = true;
    saveAppState(window.localStorage, state);
  });

  it('explains the product before the first use', async () => {
    const user = userEvent.setup();
    window.localStorage.clear();
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Un brouillon qui refuse de reculer.' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Continuer' }));
    expect(screen.getByRole('heading', { name: 'Trois pièces. Jamais plus.' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Continuer' }));
    expect(
      screen.getByRole('heading', { name: 'Écrivez d’abord. Façonnez ensuite.' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Sans compte : vos tâches et vos textes restent dans ce navigateur.'),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Préparer mon premier jet' }));

    expect(screen.getByRole('heading', { name: 'Préparez vos pièces.' })).toBeInTheDocument();
  });

  it('introduces the daily preparation', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Préparez vos pièces.' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ajouter' })).toBeInTheDocument();
  });

  it('adds a concrete task to the preparation', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(
      screen.getByRole('textbox', { name: /Quelle pièce voulez-vous produire/ }),
      'Rédiger une scène',
    );
    await user.click(screen.getByRole('button', { name: 'Ajouter' }));

    expect(screen.getByDisplayValue('Rédiger une scène')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Rédiger une scène' })).toBeInTheDocument();
  });

  it('enters a forward-only sprint without dropping typed characters', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(
      screen.getByRole('textbox', { name: /Quelle pièce voulez-vous produire/ }),
      'Rédiger une scène',
    );
    await user.click(screen.getByRole('button', { name: 'Ajouter' }));
    await user.click(screen.getByRole('button', { name: 'Vérifier l’engagement' }));
    await user.click(screen.getByRole('button', { name: 'Entrer dans la forge' }));

    const editor = screen.getByRole('textbox', { name: 'Zone d’écriture du sprint' });
    await user.type(editor, 'Chaque lettre reste.');
    await user.keyboard('{Backspace}');

    expect(editor).toHaveValue('Chaque lettre reste.');

    await user.click(screen.getByRole('button', { name: 'Sortir' }));
    await user.click(screen.getByRole('button', { name: 'Terminer maintenant' }));

    expect(screen.getByRole('heading', { name: /Vous avez forgé.*3 mots/ })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Ouvrir la révision' }));
    const revisionEditor = screen.getByRole('textbox', { name: 'Zone de révision libre' });
    await user.click(revisionEditor);
    await user.keyboard('{End}{Backspace}');

    expect(revisionEditor).toHaveValue('Chaque lettre reste');
  });

  it('switches to the projects view', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Projets' }));

    expect(screen.getByRole('heading', { name: 'Vos projets.' })).toBeInTheDocument();
  });
});
