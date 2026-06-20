import type { CreditsBalanceSummary } from './settings.types';

export function formatCreditsValue(value: number): string {
  return Math.max(0, Math.round(value)).toLocaleString();
}

export function getCreditsResetText(balance?: CreditsBalanceSummary): string | undefined {
  return balance?.resetText;
}

export function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Something went wrong.';
}
