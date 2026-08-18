import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { App } from './App';

describe('App', () => {
  it('introduces the daily preparation', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /Qu’allez-vous.*forger aujourd’hui/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ajouter une tâche' })).toBeInTheDocument();
  });

  it('switches to the projects view', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Projets' }));

    expect(screen.getByRole('heading', { name: 'Vos projets.' })).toBeInTheDocument();
  });
});
