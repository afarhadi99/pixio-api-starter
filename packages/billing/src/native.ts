import type Stripe from 'stripe';
import { STRIPE_API_VERSION } from './stripe';
import { CREDIT_PACKS } from '@pixio/config/pricing';

export interface NativePaymentParams {
  paymentIntentClientSecret: string;
  ephemeralKey: string;
  customerId: string;
  publishableKey: string;
}

/**
 * Create an ephemeral key for a customer so the native PaymentSheet can
 * manage saved payment methods.
 */
export async function createEphemeralKey(stripe: Stripe, customerId: string): Promise<string> {
  const key = await stripe.ephemeralKeys.create(
    { customer: customerId },
    { apiVersion: STRIPE_API_VERSION },
  );
  return key.secret as string;
}

/**
 * Build everything the native Stripe PaymentSheet needs to buy a credit pack
 * (one-time payment). The Stripe webhook (checkout.session.completed /
 * payment_intent.succeeded) grants the credits using the returned metadata.
 */
export async function createPaymentIntentForCreditPack(
  stripe: Stripe,
  params: { customerId: string; priceId: string; userId: string; publishableKey: string },
): Promise<NativePaymentParams> {
  const creditPack = CREDIT_PACKS.find((pack) => pack.priceId === params.priceId);
  if (!creditPack) {
    throw new Error('Invalid credit pack price ID');
  }

  const ephemeralKey = await createEphemeralKey(stripe, params.customerId);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: creditPack.price,
    currency: 'usd',
    customer: params.customerId,
    automatic_payment_methods: { enabled: true },
    metadata: {
      userId: params.userId,
      creditAmount: creditPack.amount.toString(),
      priceId: params.priceId,
      type: 'credit_purchase',
    },
  });

  return {
    paymentIntentClientSecret: paymentIntent.client_secret as string,
    ephemeralKey,
    customerId: params.customerId,
    publishableKey: params.publishableKey,
  };
}

/**
 * Create a subscription in `default_incomplete` state and return the
 * PaymentIntent client secret so the native PaymentSheet can confirm it
 * fully on-device. `customer.subscription.*` / `invoice.*` webhooks then
 * sync status and reset credits.
 */
export async function createSubscriptionForNative(
  stripe: Stripe,
  params: { customerId: string; priceId: string; userId: string; publishableKey: string },
): Promise<NativePaymentParams & { subscriptionId: string }> {
  const ephemeralKey = await createEphemeralKey(stripe, params.customerId);

  const subscription = await stripe.subscriptions.create({
    customer: params.customerId,
    items: [{ price: params.priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
    metadata: { userId: params.userId },
  });

  const invoice = subscription.latest_invoice as Stripe.Invoice & {
    payment_intent?: Stripe.PaymentIntent;
  };
  const paymentIntent = invoice?.payment_intent;
  if (!paymentIntent?.client_secret) {
    throw new Error('Unable to resolve payment intent for subscription');
  }

  return {
    subscriptionId: subscription.id,
    paymentIntentClientSecret: paymentIntent.client_secret,
    ephemeralKey,
    customerId: params.customerId,
    publishableKey: params.publishableKey,
  };
}
