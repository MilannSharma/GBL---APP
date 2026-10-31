import type { ZodError } from 'zod';

/** Field paths + Zod codes only, never values (visit and worklog data must not reach logs). */
export function failingPaths(error: ZodError): string[] {
  return error.issues.map((issue) => `${issue.path.join('.') || '(root)'}:${issue.code}`);
}
