import { describe, expect, it } from 'vitest';

import { createErrorReport } from './errorReport';

describe('error reports', () => {
  it('keeps diagnostics useful without retaining error messages or written content', () => {
    const report = createErrorReport(
      new Error('Texte privé qui ne doit jamais être conservé'),
      new Date('2026-08-18T20:30:00.000Z'),
    );

    expect(report).toEqual({
      code: 'LF-MSZ49N40',
      errorType: 'Error',
      occurredAt: '2026-08-18T20:30:00.000Z',
    });
    expect(JSON.stringify(report)).not.toContain('Texte privé');
  });
});
