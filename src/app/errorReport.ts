export type ErrorReport = {
  code: string;
  errorType: string;
  occurredAt: string;
};

export function createErrorReport(error: Error, now = new Date()): ErrorReport {
  return {
    code: `LF-${now.getTime().toString(36).toUpperCase()}`,
    errorType: error.name || 'Error',
    occurredAt: now.toISOString(),
  };
}
