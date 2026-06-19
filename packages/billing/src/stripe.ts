import Stripe from 'stripe';

export const STRIPE_API_VERSION = '2025-03-31.basil' as const;

/** Create a Stripe server client. SERVER-ONLY. */
export function createStripeClient(secretKey: string): Stripe {
  return new Stripe(secretKey, {
    apiVersion: STRIPE_API_VERSION,
    typescript: true,
  });
}

export function createStripeClientFromEnv(env: NodeJS.ProcessEnv = process.env): Stripe {
  if (!env.STRIPE_SECRET_KEY) throw new Error('Missing STRIPE_SECRET_KEY');
  return createStripeClient(env.STRIPE_SECRET_KEY);
}

export { Stripe };
