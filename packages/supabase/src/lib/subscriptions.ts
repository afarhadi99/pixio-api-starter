// src/lib/supabase/subscriptions.ts
import { createClient } from './server';
import { cache } from 'react';
import { Subscription } from '../types/db_types';

// Type guard to check for active subscription status
const isActiveSubscriptionStatus = (status: string | null | undefined): boolean => {
  return status === 'active' || status === 'trialing';
};

// Get user subscription with cache
export const getUserSubscription = cache(async (): Promise<Subscription | null> => {
  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return null;
  }

  // Fetch subscription details
  const { data: subscription, error: subError } = await supabase
    .from('subscriptions')
    .select(`
      *,
      prices (
        *,
        products (*)
      )
    `)
    .eq('user_id', user.id)
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  if (subError) {
    console.error('Error fetching user subscription:', subError.message);
    return null;
  }

  return subscription as Subscription;
});

// Check if user is subscribed with cache
export const isUserSubscribed = cache(async (): Promise<boolean> => {
  const subscription = await getUserSubscription();
  return !!subscription;
});

// Get subscription tier
export const getSubscriptionTier = cache(async (): Promise<'free' | 'pro' | 'business'> => {
  const subscription = await getUserSubscription();
  
  if (!subscription || !subscription.prices?.products) {
    return 'free';
  }
  
  // Check metadata or product name to determine tier
  const productName = subscription.prices.products.name?.toLowerCase() || '';
  
  if (productName.includes('business')) {
    return 'business';
  } else if (productName.includes('pro')) {
    return 'pro';
  }
  
  return 'free';
});
