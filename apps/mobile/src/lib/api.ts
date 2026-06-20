import { supabase } from './supabase';
import { ENV } from './env';

/**
 * Authenticated fetch against the @pixio/web `/api/mobile/*` endpoints.
 * Attaches the current Supabase access token as a Bearer header so the
 * server can resolve the user via `getRequestUser`.
 */
async function authedFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const res = await fetch(`${ENV.apiUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  const json = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) {
    throw new Error((json as { error?: string })?.error || `Request failed (${res.status})`);
  }
  return json as T;
}

import type { GenerateParams } from '@pixio/generation';

export interface NativePaymentParams {
  paymentIntentClientSecret: string;
  ephemeralKey: string;
  customerId: string;
  publishableKey: string;
  subscriptionId?: string;
}

export const api = {
  getConfig: () =>
    fetch(`${ENV.apiUrl}/api/mobile/config`).then(
      (r) =>
        r.json() as Promise<{
          tiers: import('@pixio/config').PricingTier[];
          creditPacks: import('@pixio/config').CreditPack[];
          publishableKey: string;
        }>,
    ),

  generate: (params: GenerateParams) =>
    authedFetch<{ success: boolean; mediaId?: string; error?: string }>('/api/mobile/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  createCreditPackPayment: (priceId: string) =>
    authedFetch<NativePaymentParams>('/api/mobile/payment-intent', {
      method: 'POST',
      body: JSON.stringify({ priceId }),
    }),

  createSubscription: (priceId: string) =>
    authedFetch<NativePaymentParams>('/api/mobile/subscription', {
      method: 'POST',
      body: JSON.stringify({ priceId }),
    }),

  openPortal: () =>
    authedFetch<{ url: string }>('/api/mobile/portal', { method: 'POST', body: '{}' }),

  /** Idempotently grant starter credits to a freshly-created account. */
  ensureCredits: () =>
    authedFetch<{ granted: boolean; subscriptionCredits: number; purchasedCredits: number; total: number }>(
      '/api/mobile/ensure-credits',
      { method: 'POST', body: '{}' },
    ),

  deleteMedia: (mediaId: string) =>
    authedFetch<{ success: boolean; error?: string }>(`/api/mobile/media/${mediaId}`, {
      method: 'DELETE',
    }),

  cancelGeneration: (mediaId: string) =>
    authedFetch<{ success: boolean; error?: string }>('/api/mobile/generate', {
      method: 'DELETE',
      body: JSON.stringify({ mediaId }),
    }),
};
