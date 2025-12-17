// src/lib/credits.ts
import { createClient } from '@repo/supabase/server';
import { getSubscriptionTier } from '@repo/supabase/subscriptions';
import { PRICING_TIERS } from '@/lib/config/pricing';
import { cache } from 'react';
import { supabaseAdmin } from '@repo/supabase/admin';

// Get credits based on subscription tier
export function getCreditsByTier(tier: 'free' | 'pro' | 'business'): number {
  const tierData = PRICING_TIERS.find(t => t.id === tier);
  return tierData?.credits || 0;
}

// Get user's total credits (cached)
export const getUserCredits = cache(async () => {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { subscriptionCredits: 0, purchasedCredits: 0, total: 0 };
  }
  
  // Fetch user credits
  const { data: userData, error: userDataError } = await supabase
    .from('users')
    .select('subscription_credits, purchased_credits')
    .eq('id', user.id)
    .single();
  
  if (userDataError || !userData) {
    console.error('Error fetching user credits:', userDataError?.message);
    return { subscriptionCredits: 0, purchasedCredits: 0, total: 0 };
  }
  
  const subscriptionCredits = userData.subscription_credits || 0;
  const purchasedCredits = userData.purchased_credits || 0;
  
  return {
    subscriptionCredits,
    purchasedCredits,
    total: subscriptionCredits + purchasedCredits
  };
});

// Reset subscription credits based on tier
export async function resetSubscriptionCredits(userId: string, tier: 'free' | 'pro' | 'business') {
  const creditAmount = getCreditsByTier(tier);
  
  console.log(`Resetting subscription credits for user ${userId} to ${creditAmount} (${tier} tier)`);
  
  const { error } = await supabaseAdmin
    .from('users')
    .update({
      subscription_credits: creditAmount,
      last_credits_reset_date: new Date().toISOString()
    })
    .eq('id', userId);
  
  if (error) {
    console.error('Error resetting subscription credits:', error.message);
    return false;
  }
  
  console.log(`Successfully reset credits to ${creditAmount} for user ${userId}`);
  return true;
}

// Add purchased credits to user account
export async function addPurchasedCredits(userId: string, amount: number) {
  // Get current purchased credits
  const { data: userData, error: fetchError } = await supabaseAdmin
    .from('users')
    .select('purchased_credits')
    .eq('id', userId)
    .single();
  
  if (fetchError) {
    console.error('Error fetching user data:', fetchError.message);
    return false;
  }
  
  const currentCredits = userData?.purchased_credits || 0;
  const newTotal = currentCredits + amount;
  
  console.log(`Updating user ${userId} from ${currentCredits} to ${newTotal} purchased credits`);
  
  // Update purchased credits
  const { error: updateError } = await supabaseAdmin
    .from('users')
    .update({ purchased_credits: newTotal })
    .eq('id', userId);
  
  if (updateError) {
    console.error('Error updating purchased credits:', updateError.message);
    return false;
  }
  
  console.log(`Successfully updated credits to ${newTotal}`);
  return true;
}

// Use credits (first use subscription credits, then purchased)
export async function useCredits(userId: string, amount: number, description: string = '') {
  const supabase = await createClient();
  
  // Get current credits
  const { data: userData, error: fetchError } = await supabase
    .from('users')
    .select('subscription_credits, purchased_credits')
    .eq('id', userId)
    .single();
  
  if (fetchError) {
    console.error('Error fetching user credits:', fetchError.message);
    return false;
  }
  
  const subscriptionCredits = userData?.subscription_credits || 0;
  const purchasedCredits = userData?.purchased_credits || 0;
  
  // Check if user has enough credits
  if (subscriptionCredits + purchasedCredits < amount) {
    return false; // Not enough credits
  }
  
  // Use subscription credits first
  let remainingAmount = amount;
  let newSubscriptionCredits = subscriptionCredits;
  let newPurchasedCredits = purchasedCredits;
  
  if (subscriptionCredits >= remainingAmount) {
    newSubscriptionCredits -= remainingAmount;
    remainingAmount = 0;
  } else {
    remainingAmount -= subscriptionCredits;
    newSubscriptionCredits = 0;
    
    // Use purchased credits for the remainder
    newPurchasedCredits -= remainingAmount;
  }
  
  // Update credits using admin client for more reliable updates
  const { error: updateError } = await supabaseAdmin
    .from('users')
    .update({
      subscription_credits: newSubscriptionCredits,
      purchased_credits: newPurchasedCredits
    })
    .eq('id', userId);
  
  if (updateError) {
    console.error('Error updating credits:', updateError.message);
    return false;
  }
  
  // Record usage
  const { error: usageError } = await supabaseAdmin
    .from('credit_usage')
    .insert({
      user_id: userId,
      amount,
      description
    });
  
  if (usageError) {
    console.error('Error recording credit usage:', usageError.message);
  }
  
  return true;
}

// Initialize credits for a new user (called when a user first signs up)
export async function initializeUserCredits(userId: string) {
  // Free tier credits by default
  const initialCredits = getCreditsByTier('free');
  
  console.log(`Initializing credits for new user ${userId} with ${initialCredits} credits`);
  
  const { error } = await supabaseAdmin
    .from('users')
    .update({
      subscription_credits: initialCredits,
      purchased_credits: 0,
      last_credits_reset_date: new Date().toISOString()
    })
    .eq('id', userId);
  
  if (error) {
    console.error('Error initializing user credits:', error.message);
    return false;
  }
  
  console.log(`Successfully initialized ${initialCredits} credits for user ${userId}`);
  return true;
}
