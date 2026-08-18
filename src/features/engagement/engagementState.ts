import type { PracticeDay } from '../../domain/models';

export type RhythmDay = {
  active: boolean;
  date: string;
  isToday: boolean;
  label: string;
};

export type MasteryLevel = {
  label: string;
  nextAt: number | null;
  progress: number;
};

export type PracticeOverview = {
  activeDaysLast7: number;
  completedSprints: number;
  days: RhythmDay[];
  mastery: MasteryLevel;
  minutesWritten: number;
  rhythmMessage: string;
  wordsWritten: number;
};

const MASTERY_LEVELS = [
  { label: 'Étincelle', startsAt: 0, nextAt: 30 },
  { label: 'Braise stable', startsAt: 30, nextAt: 120 },
  { label: 'Métal rouge', startsAt: 120, nextAt: 300 },
  { label: 'Forge vive', startsAt: 300, nextAt: 600 },
  { label: 'Feu maîtrisé', startsAt: 600, nextAt: null },
] as const;

function dateAtOffset(currentDate: string, offset: number) {
  const date = new Date(`${currentDate}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
}

export function getMasteryLevel(totalMinutes: number): MasteryLevel {
  const level =
    [...MASTERY_LEVELS].reverse().find((candidate) => totalMinutes >= candidate.startsAt) ??
    MASTERY_LEVELS[0];
  const progress = level.nextAt
    ? Math.round(((totalMinutes - level.startsAt) / (level.nextAt - level.startsAt)) * 100)
    : 100;

  return {
    label: level.label,
    nextAt: level.nextAt,
    progress: Math.max(0, Math.min(100, progress)),
  };
}

export function getPracticeOverview(
  practice: PracticeDay[],
  currentDate: string,
): PracticeOverview {
  const activeDates = new Set(
    practice.filter((day) => day.completedSprints > 0).map((day) => day.date),
  );
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = dateAtOffset(currentDate, index - 6);
    return {
      active: activeDates.has(date),
      date,
      isToday: index === 6,
      label: new Intl.DateTimeFormat('fr-FR', { weekday: 'short' })
        .format(new Date(`${date}T12:00:00.000Z`))
        .replace('.', ''),
    };
  });
  const minutesWritten = practice.reduce((total, day) => total + day.minutesWritten, 0);
  const completedSprints = practice.reduce((total, day) => total + day.completedSprints, 0);
  const wordsWritten = practice.reduce((total, day) => total + day.wordsWritten, 0);
  const activeDaysLast7 = days.filter((day) => day.active).length;
  const todayIsActive = days[6].active;
  const recentActivity = days.slice(0, 6).some((day) => day.active);

  return {
    activeDaysLast7,
    completedSprints,
    days,
    mastery: getMasteryLevel(minutesWritten),
    minutesWritten,
    rhythmMessage: todayIsActive
      ? 'La braise est vive aujourd’hui.'
      : recentActivity
        ? 'La braise est en veille. Un seul jet suffit pour reprendre le rythme.'
        : 'Votre première étincelle commence avec un seul jet.',
    wordsWritten,
  };
}
