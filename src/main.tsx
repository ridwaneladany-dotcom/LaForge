import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app/App';
import { AppErrorBoundary } from './app/AppErrorBoundary';
import './styles/tokens.css';
import './styles/global.css';
import './styles/preparation.css';
import './styles/projects.css';
import './styles/onboarding.css';
import './styles/install.css';
import './styles/sprint.css';
import './styles/completion.css';

const root = document.querySelector<HTMLDivElement>('#root');

if (!root) {
  throw new Error('La racine de l’application est introuvable.');
}

createRoot(root).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>,
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js');
  });
}
