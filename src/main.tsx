import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app/App';
import { AppErrorBoundary } from './app/AppErrorBoundary';
import './styles/global.css';

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
