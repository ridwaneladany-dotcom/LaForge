import { Component, type ErrorInfo, type ReactNode } from 'react';

import { KeyButton } from '../components/KeyButton';
import { createErrorReport, type ErrorReport } from './errorReport';

type Props = { children: ReactNode };
type State = { hasError: boolean; report: ErrorReport | null };

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, report: null };

  static getDerivedStateFromError(): State {
    return { hasError: true, report: null };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const report = createErrorReport(error);

    console.error('LaForge rendering error', {
      ...report,
      componentStack: info.componentStack,
    });
    this.setState({ report });
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="error-screen" role="alert">
          <div className="state-card">
            <p className="eyebrow">Le mécanisme s’est grippé</p>
            <h1>La page n’a pas pu s’afficher.</h1>
            <p>Votre texte local n’est pas inclus dans le diagnostic.</p>
            {this.state.report && (
              <p className="error-code">
                Code à transmettre : <strong>{this.state.report.code}</strong>
              </p>
            )}
            <KeyButton onClick={() => window.location.reload()}>Recharger</KeyButton>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
