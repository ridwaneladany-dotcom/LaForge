import { useState } from 'react';

import { KeyButton } from '../components/KeyButton';
import { AppShell, type AppView } from './AppShell';

export function App() {
  const [activeView, setActiveView] = useState<AppView>('today');

  return (
    <AppShell activeView={activeView} onViewChange={setActiveView}>
      {activeView === 'today' ? (
        <section className="empty-layout" aria-labelledby="page-title">
          <div className="empty-copy">
            <p className="eyebrow">Atelier du jour</p>
            <h1 id="page-title" className="hero-title">
              Qu’allez-vous
              <br />
              forger aujourd’hui&nbsp;?
            </h1>
            <p className="hero-copy">
              Préparez jusqu’à trois tâches. Ensuite, entrez dans une session où chaque mot vous
              fait avancer.
            </p>
          </div>

          <div className="paper-panel empty-card">
            <span className="paper-number" aria-hidden="true">
              01
            </span>
            <div>
              <p className="eyebrow">Première pièce</p>
              <h2>Votre établi est vide.</h2>
              <p>Posez une tâche concrète. Une bonne tâche commence par un verbe d’action.</p>
            </div>
            <KeyButton variant="primary">Ajouter une tâche</KeyButton>
          </div>
        </section>
      ) : (
        <section className="empty-layout" aria-labelledby="projects-title">
          <div className="empty-copy">
            <p className="eyebrow">Archives</p>
            <h1 id="projects-title" className="hero-title">
              Vos projets.
            </h1>
            <p className="hero-copy">Vos futurs projets et leurs sessions apparaîtront ici.</p>
          </div>
        </section>
      )}
    </AppShell>
  );
}
