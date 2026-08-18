import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { InstallAppButton } from './InstallAppButton';

describe('InstallAppButton', () => {
  it('offers the native installation when the browser makes it available', async () => {
    const user = userEvent.setup();
    const prompt = vi.fn().mockResolvedValue(undefined);
    const installEvent = Object.assign(new Event('beforeinstallprompt'), {
      prompt,
      userChoice: Promise.resolve({ outcome: 'accepted', platform: 'web' }),
    });

    render(<InstallAppButton />);
    window.dispatchEvent(installEvent);

    await user.click(await screen.findByRole('button', { name: 'Installer' }));

    expect(prompt).toHaveBeenCalledOnce();
  });
});
