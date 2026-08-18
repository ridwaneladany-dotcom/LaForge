import type { ReactNode } from 'react';

import forgeMark from '../../assets/laforge-mark.svg';
import { KeyButton } from '../components/KeyButton';
import { InstallAppButton } from '../features/install/InstallAppButton';

export type AppView = 'today' | 'projects';

type AppShellProps = {
  activeView: AppView;
  children: ReactNode;
  onViewChange: (view: AppView) => void;
};

export function AppShell({ activeView, children, onViewChange }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <a className="brand" href="/" aria-label="LaForge, accueil">
          <img src={forgeMark} alt="" />
          <span>LaForge</span>
        </a>

        <nav className="main-nav" aria-label="Navigation principale">
          <KeyButton active={activeView === 'today'} onClick={() => onViewChange('today')}>
            Aujourd’hui
          </KeyButton>
          <KeyButton active={activeView === 'projects'} onClick={() => onViewChange('projects')}>
            Projets
          </KeyButton>
        </nav>

        <div className="header-actions">
          <InstallAppButton />
        </div>
      </header>
      <main className="app-content">{children}</main>
    </div>
  );
}
