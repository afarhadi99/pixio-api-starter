// @pixio/credits - credit ledger operations. SERVER-ONLY (uses a service-role client).
// All functions take an injected admin client so they work in any app/runtime.
import type { AdminClient } from '@pixio/database/admin';
import { getCreditsByTier } from '@pixio/config/pricing';

export { getCreditsByTier };

export interface CreditBalances {
  subscriptionCredits: number;
  purchasedCredits: number;
  total: number;
}

/** Read a user's current credit balances. */
export async function getCreditBalances(
  admin: AdminClient,
  userId: string,
): Promise<CreditBalances> {
  const { data, error } = await admin
    .from('users')
    .select('subscription_credits, purchased_credits')
    .eq('id', userId)
    .single();

  if (error || !data) {
    console.error('Error fetching user credits:', error?.message);
    return { subscriptionCredits: 0, purchasedCredits: 0, total: 0 };
  }
  const subscriptionCredits = data.subscription_credits ?? 0;
  const purchasedCredits = data.purchased_credits ?? 0;
  return { subscriptionCredits, purchasedCredits, total: subscriptionCredits + purchasedCredits };
}

/** Reset subscription credits to the tier's monthly allowance (on renewal). */
export async function resetSubscriptionCredits(
  admin: AdminClient,
  userId: string,
  tier: 'free' | 'pro' | 'business',
): Promise<boolean> {
  const creditAmount = getCreditsByTier(tier);
  const { error } = await admin
    .from('users')
    .update({
      subscription_credits: creditAmount,
      last_credits_reset_date: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('Error resetting subscription credits:', error.message);
    return false;
  }
  return true;
}

/** Add purchased (non-expiring) credits to a user. */
export async function addPurchasedCredits(
  admin: AdminClient,
  userId: string,
  amount: number,
): Promise<boolean> {
  const { data, error: fetchError } = await admin
    .from('users')
    .select('purchased_credits')
    .eq('id', userId)
    .single();

  if (fetchError) {
    console.error('Error fetching user data:', fetchError.message);
    return false;
  }

  const newTotal = (data?.purchased_credits ?? 0) + amount;
  const { error: updateError } = await admin
    .from('users')
    .update({ purchased_credits: newTotal })
    .eq('id', userId);

  if (updateError) {
    console.error('Error updating purchased credits:', updateError.message);
    return false;
  }
  return true;
}

/**
 * Spend credits: subscription credits first, then purchased.
 * Returns false (no mutation) when the user lacks sufficient balance.
 */
export async function useCredits(
  admin: AdminClient,
  userId: string,
  amount: number,
  description = '',
): Promise<boolean> {
  const { data, error: fetchError } = await admin
    .from('users')
    .select('subscription_credits, purchased_credits')
    .eq('id', userId)
    .single();

  if (fetchError) {
    console.error('Error fetching user credits:', fetchError.message);
    return false;
  }

  const subscriptionCredits = data?.subscription_credits ?? 0;
  const purchasedCredits = data?.purchased_credits ?? 0;

  if (subscriptionCredits + purchasedCredits < amount) {
    return false;
  }

  let remaining = amount;
  let newSubscriptionCredits = subscriptionCredits;
  let newPurchasedCredits = purchasedCredits;

  if (subscriptionCredits >= remaining) {
    newSubscriptionCredits -= remaining;
    remaining = 0;
  } else {
    remaining -= subscriptionCredits;
    newSubscriptionCredits = 0;
    newPurchasedCredits -= remaining;
  }

  const { error: updateError } = await admin
    .from('users')
    .update({
      subscription_credits: newSubscriptionCredits,
      purchased_credits: newPurchasedCredits,
    })
    .eq('id', userId);

  if (updateError) {
    console.error('Error updating credits:', updateError.message);
    return false;
  }

  const { error: usageError } = await admin
    .from('credit_usage')
    .insert({ user_id: userId, amount, description });

  if (usageError) {
    console.error('Error recording credit usage:', usageError.message);
  }

  return true;
}

/** Grant free-tier credits to a brand-new user. */
export async function initializeUserCredits(admin: AdminClient, userId: string): Promise<boolean> {
  const initialCredits = getCreditsByTier('free');
  const { error } = await admin
    .from('users')
    .update({
      subscription_credits: initialCredits,
      purchased_credits: 0,
      last_credits_reset_date: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('Error initializing user credits:', error.message);
    return false;
  }
  return true;
}
