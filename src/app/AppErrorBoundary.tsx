import { Component, type ErrorInfo, type ReactNode } from 'react';

import { KeyButton } from '../components/KeyButton';

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('LaForge rendering error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="error-screen">
          <div className="state-card">
            <p className="eyebrow">Le mécanisme s’est grippé</p>
            <h1>La page n’a pas pu s’afficher.</h1>
            <KeyButton onClick={() => window.location.reload()}>Recharger</KeyButton>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
