import { describe, expect, it } from 'vitest';

import type { PracticeDay } from '../../domain/models';
import { getMasteryLevel, getPracticeOverview } from './engagementState';

const practice: PracticeDay[] = [
  { date: '2026-08-12', completedSprints: 1, minutesWritten: 20, wordsWritten: 250 },
  { date: '2026-08-14', completedSprints: 2, minutesWritten: 35, wordsWritten: 460 },
  { date: '2026-08-17', completedSprints: 1, minutesWritten: 15, wordsWritten: 180 },
];

describe('ethical engagement state', () => {
  it('keeps past effort visible when today has no sprint', () => {
    const overview = getPracticeOverview(practice, '2026-08-18');

    expect(overview.activeDaysLast7).toBe(3);
    expect(overview.completedSprints).toBe(4);
    expect(overview.minutesWritten).toBe(70);
    expect(overview.wordsWritten).toBe(890);
    expect(overview.rhythmMessage).toContain('Un seul jet suffit');
  });

  it('uses transparent mastery thresholds without a virtual economy', () => {
    expect(getMasteryLevel(0)).toMatchObject({ label: 'Étincelle', nextAt: 30, progress: 0 });
    expect(getMasteryLevel(70)).toMatchObject({ label: 'Braise stable', nextAt: 120 });
    expect(getMasteryLevel(700)).toEqual({ label: 'Feu maîtrisé', nextAt: null, progress: 100 });
  });
});
