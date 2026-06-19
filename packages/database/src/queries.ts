import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Subscription, GeneratedMedia } from './types';

export type DbClient = SupabaseClient<Database>;

/** Active (or trialing) subscription for a user, with price + product expanded. */
export async function getActiveSubscription(
  client: DbClient,
  userId: string,
): Promise<Subscription | null> {
  const { data, error } = await client
    .from('subscriptions')
    .select(`*, prices (*, products (*))`)
    .eq('user_id', userId)
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  if (error) {
    console.error('Error fetching user subscription:', error.message);
    return null;
  }
  return data as Subscription | null;
}

/** Derive the tier from an active subscription's product name. */
export function deriveTierFromSubscription(
  subscription: Subscription | null,
): 'free' | 'pro' | 'business' {
  const productName = subscription?.prices?.products?.name?.toLowerCase() ?? '';
  if (productName.includes('business')) return 'business';
  if (productName.includes('pro')) return 'pro';
  return 'free';
}

/** Raw credit balances for a user. */
export async function getUserCreditBalances(
  client: DbClient,
  userId: string,
): Promise<{ subscriptionCredits: number; purchasedCredits: number; total: number }> {
  const { data, error } = await client
    .from('users')
    .select('subscription_credits, purchased_credits')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return { subscriptionCredits: 0, purchasedCredits: 0, total: 0 };
  }
  const subscriptionCredits = data.subscription_credits ?? 0;
  const purchasedCredits = data.purchased_credits ?? 0;
  return { subscriptionCredits, purchasedCredits, total: subscriptionCredits + purchasedCredits };
}

/** A user's generated media, most recent first. */
export async function getUserMedia(
  client: DbClient,
  userId: string,
  limit = 50,
): Promise<GeneratedMedia[]> {
  const { data, error } = await client
    .from('generated_media')
    .select('*')
    .eq('user_id', userId)
    .in('status', ['pending', 'processing', 'completed', 'failed'])
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to fetch media: ${error.message}`);
  return data ?? [];
}
