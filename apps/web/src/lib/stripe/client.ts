// Thin app-level shim: a single Stripe client bound from env.
import { createStripeClientFromEnv } from '@pixio/billing';

export const stripe = createStripeClientFromEnv();
