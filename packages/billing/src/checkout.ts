import type Stripe from 'stripe';
import { CREDIT_PACKS } from '@pixio/config/pricing';

/** Subscription checkout session (hosted, web redirect flow). */
export async function createSubscriptionCheckoutSession(
  stripe: Stripe,
  params: { customerId: string; priceId: string; userId: string; siteUrl: string },
): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    billing_address_collection: 'auto',
    customer: params.customerId,
    line_items: [{ price: params.priceId, quantity: 1 }],
    mode: 'subscription',
    allow_promotion_codes: true,
    subscription_data: { metadata: { userId: params.userId } },
    success_url: `${params.siteUrl}/account?success=true`,
    cancel_url: `${params.siteUrl}/`,
  });
}

/** One-time credit-pack checkout session (hosted, web redirect flow). */
export async function createCreditPurchaseSession(
  stripe: Stripe,
  params: { customerId: string; priceId: string; userId: string; siteUrl: string },
): Promise<Stripe.Checkout.Session> {
  const creditPack = CREDIT_PACKS.find((pack) => pack.priceId === params.priceId);
  if (!creditPack) {
    throw new Error('Invalid price ID');
  }

  return stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    billing_address_collection: 'auto',
    customer: params.customerId,
    line_items: [{ price: params.priceId, quantity: 1 }],
    mode: 'payment',
    allow_promotion_codes: true,
    metadata: {
      userId: params.userId,
      creditAmount: creditPack.amount.toString(),
      type: 'credit_purchase',
      priceId: params.priceId,
    },
    success_url: `${params.siteUrl}/account?credit_success=true`,
    cancel_url: `${params.siteUrl}/account`,
  });
}

/** Stripe billing portal session. */
export async function createCustomerPortalSession(
  stripe: Stripe,
  params: { customerId: string; returnUrl: string },
): Promise<Stripe.BillingPortal.Session> {
  return stripe.billingPortal.sessions.create({
    customer: params.customerId,
    return_url: params.returnUrl,
  });
}
