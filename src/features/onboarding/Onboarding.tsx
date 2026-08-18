import { useState } from 'react';

import forgeMark from '../../../assets/laforge-mark.svg';
import { KeyButton } from '../../components/KeyButton';
import { InstallAppButton } from '../install/InstallAppButton';

type OnboardingProps = {
  onComplete: () => void;
};

const STEPS = [
  {
    index: '01',
    eyebrow: 'Le principe',
    title: 'Un brouillon qui refuse de reculer.',
    body: 'Choisissez une durée, puis écrivez sans Retour arrière ni Suppr. La contrainte porte uniquement sur le brouillon : elle protège votre élan, pas votre perfection.',
    note: 'Vous pouvez sortir à tout moment. Votre texte reste sauvegardé.',
  },
  {
    index: '02',
    eyebrow: 'La préparation',
    title: 'Trois pièces. Jamais plus.',
    body: 'Listez jusqu’à trois résultats concrets — une scène, une introduction, une synthèse — puis choisissez celui que vous allez réellement produire.',
    note: 'Une pièce choisie. Une durée. Puis vous commencez.',
  },
  {
    index: '03',
    eyebrow: 'Le parcours',
    title: 'Écrivez d’abord. Façonnez ensuite.',
    body: 'À la sonnerie, le brouillon se déverrouille. Vous pouvez le réviser, prolonger le sprint ou marquer la tâche comme terminée.',
    note: 'Sans compte : vos tâches et vos textes restent dans ce navigateur.',
  },
] as const;

export function Onboarding({ onComplete }: OnboardingProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;

  return (
    <main className="onboarding-shell">
      <header className="onboarding-header">
        <div className="brand" aria-label="LaForge">
          <img src={forgeMark} alt="" />
          <span>LaForge</span>
        </div>
        <div className="onboarding-header-actions">
          <InstallAppButton />
          <button className="text-button" type="button" onClick={onComplete}>
            Passer l’introduction
          </button>
        </div>
      </header>

      <section className="onboarding-stage" aria-labelledby="onboarding-title">
        <div className="onboarding-copy">
          <p className="eyebrow">{step.eyebrow}</p>
          <h1 id="onboarding-title">{step.title}</h1>
          <p className="onboarding-body">{step.body}</p>
        </div>

        <div className="onboarding-paper paper-panel" aria-live="polite">
          <span className="onboarding-index">{step.index}</span>
          <div className="type-sample" aria-hidden="true">
            {stepIndex === 0 && (
              <>
                <span>Chaque mot compte.</span>
                <span>Le suivant aussi.</span>
                <span className="type-caret" />
              </>
            )}
            {stepIndex === 1 && (
              <>
                <i>01</i>
                <i>02</i>
                <i>03</i>
              </>
            )}
            {stepIndex === 2 && (
              <ol className="onboarding-route">
                <li>
                  <i>01</i>
                  <span>
                    <strong>Préparer</strong>
                    un résultat et une durée
                  </span>
                </li>
                <li>
                  <i>02</i>
                  <span>
                    <strong>Forger</strong>
                    avancer sans effacer
                  </span>
                </li>
                <li>
                  <i>03</i>
                  <span>
                    <strong>Façonner</strong>
                    réviser le texte librement
                  </span>
                </li>
              </ol>
            )}
          </div>
          <p>{step.note}</p>
        </div>
      </section>

      <footer className="onboarding-footer">
        <div className="step-dots" aria-label={`Étape ${stepIndex + 1} sur ${STEPS.length}`}>
          {STEPS.map((item, index) => (
            <span key={item.index} data-active={index === stepIndex || undefined} />
          ))}
        </div>
        <div className="onboarding-actions">
          {stepIndex > 0 && (
            <KeyButton onClick={() => setStepIndex((current) => current - 1)}>Retour</KeyButton>
          )}
          <KeyButton
            variant="primary"
            onClick={() => (isLastStep ? onComplete() : setStepIndex((current) => current + 1))}
          >
            {isLastStep ? 'Préparer mon premier jet' : 'Continuer'}
          </KeyButton>
        </div>
      </footer>
    </main>
  );
}
