import type { PracticeDay } from '../../domain/models';
import { getPracticeOverview } from './engagementState';

type ProgressPanelProps = {
  practice: PracticeDay[];
};

function formatNumber(value: number) {
  return new Intl.NumberFormat('fr-FR').format(value);
}

export function ProgressPanel({ practice }: ProgressPanelProps) {
  const currentDate = new Date().toISOString().slice(0, 10);
  const overview = getPracticeOverview(practice, currentDate);

  return (
    <section className="progress-panel paper-panel" aria-labelledby="progress-title">
      <div className="progress-heading">
        <div>
          <p className="eyebrow">Votre rythme</p>
          <h2 id="progress-title">La matière s’accumule.</h2>
        </div>
        <div className="mastery-stamp">
          <span>Maîtrise</span>
          <strong>{overview.mastery.label}</strong>
        </div>
      </div>

      <div className="rhythm-week">
        <ol aria-label={`${overview.activeDaysLast7} jours actifs sur les sept derniers jours`}>
          {overview.days.map((day) => (
            <li
              key={day.date}
              aria-label={`${day.label} ${day.date.slice(-2)}, ${day.active ? 'jet terminé' : 'aucun jet'}`}
              data-active={day.active || undefined}
              data-today={day.isToday || undefined}
            >
              <span>{day.label}</span>
              <i aria-hidden="true" />
              <small>{day.date.slice(-2)}</small>
            </li>
          ))}
        </ol>
        <p>{overview.rhythmMessage}</p>
      </div>

      <dl className="progress-totals">
        <div>
          <dt>Jets forgés</dt>
          <dd>{formatNumber(overview.completedSprints)}</dd>
        </div>
        <div>
          <dt>Minutes investies</dt>
          <dd>{formatNumber(overview.minutesWritten)}</dd>
        </div>
        <div>
          <dt>Mots produits</dt>
          <dd>{formatNumber(overview.wordsWritten)}</dd>
        </div>
      </dl>

      <div className="mastery-progress">
        <div>
          <span>Progression de forge</span>
          <strong>
            {overview.mastery.nextAt
              ? `${Math.max(0, overview.mastery.nextAt - overview.minutesWritten)} min avant le prochain palier`
              : 'Palier actuel consolidé'}
          </strong>
        </div>
        <div
          className="mastery-track"
          role="progressbar"
          aria-label="Progression vers le prochain palier de maîtrise"
          aria-valuetext={
            overview.mastery.nextAt
              ? `${overview.mastery.progress} %, ${overview.mastery.nextAt - overview.minutesWritten} minutes restantes`
              : 'Palier maximal atteint'
          }
          aria-valuenow={overview.mastery.progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span style={{ width: `${overview.mastery.progress}%` }} />
        </div>
      </div>
    </section>
  );
}
