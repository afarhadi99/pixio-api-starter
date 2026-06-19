// App-level shim binding the service-role client to the @pixio/credits helpers,
// preserving the original `@/lib/credits` API (and the request-cached reader).
import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import {
  getCreditsByTier,
  resetSubscriptionCredits as _resetSubscriptionCredits,
  addPurchasedCredits as _addPurchasedCredits,
  useCredits as _useCredits,
  initializeUserCredits as _initializeUserCredits,
} from '@pixio/credits';

export { getCreditsByTier };

export const resetSubscriptionCredits = (userId: string, tier: 'free' | 'pro' | 'business') =>
  _resetSubscriptionCredits(supabaseAdmin, userId, tier);

export const addPurchasedCredits = (userId: string, amount: number) =>
  _addPurchasedCredits(supabaseAdmin, userId, amount);

export const useCredits = (userId: string, amount: number, description = '') =>
  _useCredits(supabaseAdmin, userId, amount, description);

export const initializeUserCredits = (userId: string) =>
  _initializeUserCredits(supabaseAdmin, userId);

// Request-cached reader for the currently authenticated user (RLS client).
export const getUserCredits = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { subscriptionCredits: 0, purchasedCredits: 0, total: 0 };
  }

  const { data: userData, error: userDataError } = await supabase
    .from('users')
    .select('subscription_credits, purchased_credits')
    .eq('id', user.id)
    .single();

  if (userDataError || !userData) {
    return { subscriptionCredits: 0, purchasedCredits: 0, total: 0 };
  }

  const subscriptionCredits = userData.subscription_credits || 0;
  const purchasedCredits = userData.purchased_credits || 0;
  return {
    subscriptionCredits,
    purchasedCredits,
    total: subscriptionCredits + purchasedCredits,
  };
});
