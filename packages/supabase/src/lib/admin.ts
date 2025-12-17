// src/lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { Database } from '@/types/db_types';
import { safeToISOString } from '@/lib/utils';
import { resetSubscriptionCredits } from '@/lib/credits';
import { getTierByPriceId } from '@/lib/config/pricing';

// Create a Supabase client with the service role key
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

// Define the Stripe Subscription interface explicitly with the fields we need
interface StripeSubscription {
  id: string;
  status: string;
  metadata: Record<string, any>;
  items: {
    data: Array<{
      price: { id: string };
      quantity: number;
    }>;
  };
  cancel_at_period_end: boolean;
  cancel_at: number | null;
  canceled_at: number | null;
  current_period_start: number;
  current_period_end: number;
  created: number;
  ended_at: number | null;
  trial_start: number | null;
  trial_end: number | null;
}

// Create or retrieve a customer from the customers table
export async function createOrRetrieveCustomer({
  uuid,
  email,
}: {
  uuid: string;
  email: string;
}) {
  const { data: existingCustomer, error: customerError } = await supabaseAdmin
    .from('customers')
    .select('stripe_customer_id')
    .eq('id', uuid)
    .single();

  if (existingCustomer?.stripe_customer_id) {
    return existingCustomer.stripe_customer_id;
  }

  // Create a new customer in Stripe
  const customer = await stripe.customers.create({
    email,
    metadata: {
      supabaseUUID: uuid,
    },
  });

  // Insert the customer into our database
  const { error } = await supabaseAdmin
    .from('customers')
    .insert([{ id: uuid, stripe_customer_id: customer.id }]);

  if (error) throw error;

  return customer.id;
}

// Upsert product record in the database
export async function upsertProductRecord(product: Stripe.Product) {
  const { error } = await supabaseAdmin
    .from('products')
    .upsert([
      {
        id: product.id,
        active: product.active,
        name: product.name,
        description: product.description ?? null,
        image: product.images?.[0] ?? null,
        metadata: product.metadata,
      },
    ]);
  
  if (error) throw error;
  console.log(`Product inserted/updated: ${product.id}`);
}

// Delete product record from the database
export async function deleteProductRecord(productId: string) {
  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', productId);
  
  if (error) throw error;
  console.log(`Product deleted: ${productId}`);
}

// Upsert price record in the database
export async function upsertPriceRecord(price: Stripe.Price) {
  // Extract interval details
  const interval = price.recurring?.interval as Database['public']['Enums']['pricing_plan_interval'] | null;
  const intervalCount = price.recurring?.interval_count ?? null;
  
  // Extract price type
  const type = price.type as Database['public']['Enums']['pricing_type'];
  
  const { error } = await supabaseAdmin
    .from('prices')
    .upsert([
      {
        id: price.id,
        product_id: typeof price.product === 'string' ? price.product : '',
        active: price.active,
        currency: price.currency,
        description: price.nickname ?? null,
        type,
        unit_amount: price.unit_amount ?? null,
        interval,
        interval_count: intervalCount,
        trial_period_days: price.recurring?.trial_period_days ?? null,
        metadata: price.metadata,
      },
    ]);
  
  if (error) throw error;
  console.log(`Price inserted/updated: ${price.id}`);
}

// Delete price record from the database
export async function deletePriceRecord(priceId: string) {
  const { error } = await supabaseAdmin
    .from('prices')
    .delete()
    .eq('id', priceId);
  
  if (error) throw error;
  console.log(`Price deleted: ${priceId}`);
}

// Manage subscription status change in the database
export async function manageSubscriptionStatusChange(
  subscriptionId: string,
  customerId: string,
  createAction = false
) {
  try {
    // Get customer's UUID from mapping table
    const { data: customerData, error: customerError } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (customerError || !customerData?.id) {
      console.error(`Customer not found: ${customerId}`);
      throw new Error(`Customer not found: ${customerId}`);
    }
    
    const { id: uuid } = customerData;
    
    // Retrieve subscription details from Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['default_payment_method', 'items.data.price', 'items.data.price.product'],
    });

    // Handle as plain object to avoid TypeScript issues
    const subscription = stripeSubscription as any;

    // Get the price and product details from the subscription
    const priceId = subscription.items.data[0].price.id;
    const price = subscription.items.data[0].price;
    const product = subscription.items.data[0].price.product;
    
    // Check if the price exists in our database
    const { data: existingPrice } = await supabaseAdmin
      .from('prices')
      .select('id')
      .eq('id', priceId)
      .maybeSingle();
      
    // If price doesn't exist, insert both the product and price first
    if (!existingPrice) {
      console.log(`Price ${priceId} not found in database. Adding to database first...`);
      
      // First check if the product exists
      const { data: existingProduct } = await supabaseAdmin
        .from('products')
        .select('id')
        .eq('id', product.id)
        .maybeSingle();
        
      // Insert product if it doesn't exist
      if (!existingProduct) {
        console.log(`Product ${product.id} not found. Adding product...`);
        await supabaseAdmin
          .from('products')
          .upsert([{
            id: product.id,
            active: product.active,
            name: product.name,
            description: product.description ?? null,
            image: product.images?.[0] ?? null,
            metadata: product.metadata,
          }]);
      }
      
      // Then insert the price
      console.log(`Adding price ${priceId}...`);
      await supabaseAdmin
        .from('prices')
        .upsert([{
          id: priceId,
          product_id: product.id,
          active: price.active,
          currency: price.currency,
          description: price.nickname ?? null,
          type: price.type,
          unit_amount: price.unit_amount ?? null,
          interval: price.recurring?.interval ?? null,
          interval_count: price.recurring?.interval_count ?? null,
          trial_period_days: price.recurring?.trial_period_days ?? null,
          metadata: price.metadata,
        }]);
    }
    
    // Define helper function inline
    const safeToISOString = (timestamp: number | null | undefined): string | null => {
      if (timestamp === null || timestamp === undefined) return null;
      try {
        return new Date(timestamp * 1000).toISOString();
      } catch (error) {
        console.error(`Invalid timestamp: ${timestamp}`, error);
        return null;
      }
    };
    
    // Current time as fallback
    const now = new Date().toISOString();
    
    // Upsert the subscription in the database
    const subscriptionData = {
      id: subscription.id,
      user_id: uuid,
      status: subscription.status,
      metadata: subscription.metadata,
      price_id: priceId,
      quantity: subscription.items.data[0].quantity,
      cancel_at_period_end: subscription.cancel_at_period_end,
      cancel_at: subscription.cancel_at ? safeToISOString(subscription.cancel_at) : null,
      canceled_at: subscription.canceled_at ? safeToISOString(subscription.canceled_at) : null,
      current_period_start: safeToISOString(subscription.current_period_start) || now,
      current_period_end: safeToISOString(subscription.current_period_end) || now,
      created: safeToISOString(subscription.created) || now,
      ended_at: subscription.ended_at ? safeToISOString(subscription.ended_at) : null,
      trial_start: subscription.trial_start ? safeToISOString(subscription.trial_start) : null,
      trial_end: subscription.trial_end ? safeToISOString(subscription.trial_end) : null,
    };

    console.log(`Upserting subscription ${subscription.id} for user ${uuid}`);
    
    const { error } = await supabaseAdmin
      .from('subscriptions')
      .upsert([subscriptionData]);

    if (error) {
      console.error(`Supabase subscription upsert error:`, error);
      throw error;
    }
    console.log(`Subscription ${subscription.id} successfully updated for user ${uuid}`);

    // After subscription is processed, reset subscription credits based on tier
    if (subscription.status === 'active' || subscription.status === 'trialing') {
      // Get the product details to determine the tier
      const { tier } = getTierByPriceId(priceId);
      
      if (tier) {
        console.log(`Resetting credits for user ${uuid} to tier ${tier.id} level`);
        await resetSubscriptionCredits(uuid, tier.id as 'free' | 'pro' | 'business');
      }
    }

    return subscription;
  } catch (error) {
    console.error('Error in manageSubscriptionStatusChange:', error);
    throw error;
  }
}
