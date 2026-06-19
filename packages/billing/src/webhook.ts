import type Stripe from 'stripe';
import type { AdminClient } from '@pixio/database/admin';
import { addPurchasedCredits } from '@pixio/credits';
import {
  upsertProductRecord,
  upsertPriceRecord,
  manageSubscriptionStatusChange,
} from './sync';

export const RELEVANT_STRIPE_EVENTS = new Set<string>([
  'product.created',
  'product.updated',
  'price.created',
  'price.updated',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'checkout.session.completed',
  'payment_intent.succeeded',
  'invoice.paid',
  'invoice.payment_succeeded',
]);

/** Grant credits for a completed one-time purchase and record it (idempotent-ish). */
async function grantCreditsFromMetadata(
  admin: AdminClient,
  metadata: Record<string, string> | null | undefined,
  fallbackPriceId: string | undefined,
) {
  if (!metadata || metadata.type !== 'credit_purchase') return;
  const userId = metadata.userId;
  const creditAmount = parseInt(metadata.creditAmount || '0', 10);
  if (!userId || creditAmount <= 0) return;

  await addPurchasedCredits(admin, userId, creditAmount);
  await admin.from('credit_purchases').insert({
    user_id: userId,
    amount: creditAmount,
    price_id: metadata.priceId || fallbackPriceId || 'unknown',
  });
}

/**
 * Process a verified Stripe event. Caller is responsible for signature
 * verification (web route) before calling this.
 */
export async function processStripeEvent(
  event: Stripe.Event,
  deps: { admin: AdminClient; stripe: Stripe },
): Promise<void> {
  const { admin, stripe } = deps;

  switch (event.type) {
    case 'product.created':
    case 'product.updated':
      await upsertProductRecord(admin, event.data.object as Stripe.Product);
      break;

    case 'price.created':
    case 'price.updated':
      await upsertPriceRecord(admin, event.data.object as Stripe.Price);
      break;

    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      await manageSubscriptionStatusChange(
        admin,
        stripe,
        subscription.id,
        subscription.customer as string,
        event.type === 'customer.subscription.created',
      );
      break;
    }

    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode === 'payment') {
        await grantCreditsFromMetadata(
          admin,
          session.metadata as Record<string, string>,
          session.line_items?.data?.[0]?.price?.id,
        );
      }
      if (session.mode === 'subscription' && session.subscription) {
        const subscriptionId =
          typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription.id;
        const customerId =
          typeof session.customer === 'string' ? session.customer : session.customer?.id;
        if (subscriptionId && customerId) {
          await manageSubscriptionStatusChange(admin, stripe, subscriptionId, customerId, true);
        }
      }
      break;
    }

    case 'payment_intent.succeeded': {
      // Native credit-pack purchases confirm via PaymentIntent (no checkout session).
      const pi = event.data.object as Stripe.PaymentIntent;
      await grantCreditsFromMetadata(admin, pi.metadata as Record<string, string>, undefined);
      break;
    }

    case 'invoice.paid':
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as any;
      if (invoice?.customer && invoice?.subscription) {
        await manageSubscriptionStatusChange(
          admin,
          stripe,
          invoice.subscription as string,
          invoice.customer as string,
          false,
        );
      }
      break;
    }

    default:
      break;
  }
}
