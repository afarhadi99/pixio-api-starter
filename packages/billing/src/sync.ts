import type Stripe from 'stripe';
import type { AdminClient } from '@pixio/database/admin';
import type { Database } from '@pixio/database/types';
import { getTierByPriceId } from '@pixio/config/pricing';
import { resetSubscriptionCredits } from '@pixio/credits';

function safeToISOString(timestamp: number | null | undefined): string | null {
  if (timestamp === null || timestamp === undefined) return null;
  try {
    return new Date(timestamp * 1000).toISOString();
  } catch (error) {
    console.error(`Invalid timestamp: ${timestamp}`, error);
    return null;
  }
}

/** Map a Supabase auth user to a Stripe customer, creating it if needed. */
export async function createOrRetrieveCustomer(
  admin: AdminClient,
  stripe: Stripe,
  { uuid, email }: { uuid: string; email: string },
): Promise<string> {
  const { data: existingCustomer } = await admin
    .from('customers')
    .select('stripe_customer_id')
    .eq('id', uuid)
    .single();

  if (existingCustomer?.stripe_customer_id) {
    return existingCustomer.stripe_customer_id;
  }

  const customer = await stripe.customers.create({
    email,
    metadata: { supabaseUUID: uuid },
  });

  const { error } = await admin
    .from('customers')
    .insert([{ id: uuid, stripe_customer_id: customer.id }]);
  if (error) throw error;

  return customer.id;
}

export async function upsertProductRecord(admin: AdminClient, product: Stripe.Product) {
  const { error } = await admin.from('products').upsert([
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
}

export async function deleteProductRecord(admin: AdminClient, productId: string) {
  const { error } = await admin.from('products').delete().eq('id', productId);
  if (error) throw error;
}

export async function upsertPriceRecord(admin: AdminClient, price: Stripe.Price) {
  const interval =
    (price.recurring?.interval as Database['public']['Enums']['pricing_plan_interval']) ?? null;
  const { error } = await admin.from('prices').upsert([
    {
      id: price.id,
      product_id: typeof price.product === 'string' ? price.product : '',
      active: price.active,
      currency: price.currency,
      description: price.nickname ?? null,
      type: price.type as Database['public']['Enums']['pricing_type'],
      unit_amount: price.unit_amount ?? null,
      interval,
      interval_count: price.recurring?.interval_count ?? null,
      trial_period_days: price.recurring?.trial_period_days ?? null,
      metadata: price.metadata,
    },
  ]);
  if (error) throw error;
}

export async function deletePriceRecord(admin: AdminClient, priceId: string) {
  const { error } = await admin.from('prices').delete().eq('id', priceId);
  if (error) throw error;
}

/**
 * Sync a Stripe subscription into the DB and, when active/trialing,
 * reset the user's subscription credits to their tier allowance.
 */
export async function manageSubscriptionStatusChange(
  admin: AdminClient,
  stripe: Stripe,
  subscriptionId: string,
  customerId: string,
  _createAction = false,
) {
  const { data: customerData, error: customerError } = await admin
    .from('customers')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (customerError || !customerData?.id) {
    throw new Error(`Customer not found: ${customerId}`);
  }
  const uuid = customerData.id;

  const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method', 'items.data.price', 'items.data.price.product'],
  });
  const subscription = stripeSubscription as any;

  const priceId = subscription.items.data[0].price.id;
  const price = subscription.items.data[0].price;
  const product = subscription.items.data[0].price.product;

  const { data: existingPrice } = await admin
    .from('prices')
    .select('id')
    .eq('id', priceId)
    .maybeSingle();

  if (!existingPrice) {
    const { data: existingProduct } = await admin
      .from('products')
      .select('id')
      .eq('id', product.id)
      .maybeSingle();
    if (!existingProduct) {
      await upsertProductRecord(admin, product);
    }
    await upsertPriceRecord(admin, price);
  }

  const now = new Date().toISOString();
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

  const { error } = await admin.from('subscriptions').upsert([subscriptionData]);
  if (error) throw error;

  if (subscription.status === 'active' || subscription.status === 'trialing') {
    const { tier } = getTierByPriceId(priceId);
    if (tier) {
      await resetSubscriptionCredits(admin, uuid, tier.id);
    }
  }

  return subscription;
}
