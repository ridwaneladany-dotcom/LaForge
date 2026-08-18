import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ForwardEditor } from './ForwardEditor';

describe('ForwardEditor', () => {
  it('keeps fast keyboard input at the end and blocks destructive keys', async () => {
    const user = userEvent.setup();
    render(
      <ForwardEditor initialContent="" onContentChange={vi.fn()} onWordCountChange={vi.fn()} />,
    );
    const editor = screen.getByRole('textbox', { name: 'Zone d’écriture du sprint' });

    await user.type(editor, 'Chaque caractère reste.');
    await user.keyboard('{Home} FIN{Backspace}');

    expect(editor).toHaveValue('Chaque caractère reste. FIN');
  });

  it('appends pasted text and the review marker', async () => {
    const user = userEvent.setup();
    render(
      <ForwardEditor
        initialContent="Début"
        onContentChange={vi.fn()}
        onWordCountChange={vi.fn()}
      />,
    );
    const editor = screen.getByRole('textbox', { name: 'Zone d’écriture du sprint' });

    await user.click(editor);
    await user.paste(' collé');
    await user.click(screen.getByRole('button', { name: /Marquer/ }));

    expect(editor).toHaveValue('Début collé [À REVOIR] ');
  });

  it('keeps composed characters from input methods', () => {
    render(
      <ForwardEditor initialContent="" onContentChange={vi.fn()} onWordCountChange={vi.fn()} />,
    );
    const editor = screen.getByRole('textbox', { name: 'Zone d’écriture du sprint' });

    fireEvent.compositionStart(editor);
    fireEvent.input(editor, { target: { value: 'Écrire 日本語' } });
    fireEvent.compositionEnd(editor);

    expect(editor).toHaveValue('Écrire 日本語');
  });
});
