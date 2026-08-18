import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { App } from './App';

describe('App', () => {
  beforeEach(() => window.localStorage.clear());

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

  it('switches to the projects view', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Projets' }));

    expect(screen.getByRole('heading', { name: 'Vos projets.' })).toBeInTheDocument();
  });
});
