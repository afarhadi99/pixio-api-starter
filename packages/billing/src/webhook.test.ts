import { describe, it, expect } from 'vitest';
import { createFakeAdmin } from './test-utils';
import { processStripeEvent, RELEVANT_STRIPE_EVENTS } from './webhook';

const stripeStub = {} as any;

describe('RELEVANT_STRIPE_EVENTS', () => {
  it('includes the native payment_intent.succeeded event', () => {
    expect(RELEVANT_STRIPE_EVENTS.has('payment_intent.succeeded')).toBe(true);
  });
});

describe('processStripeEvent — credit grants', () => {
  it('grants credits for a completed one-time checkout session', async () => {
    const fake = createFakeAdmin();
    fake.queueSelect({ data: { purchased_credits: 0 }, error: null }); // addPurchasedCredits read

    await processStripeEvent(
      {
        type: 'checkout.session.completed',
        data: {
          object: {
            mode: 'payment',
            metadata: { type: 'credit_purchase', userId: 'user-1', creditAmount: '1000', priceId: 'price_1' },
          },
        },
      } as any,
      { admin: fake.client, stripe: stripeStub },
    );

    expect(fake.updates.find((u) => u.table === 'users')?.payload).toMatchObject({
      purchased_credits: 1000,
    });
    expect(fake.inserts.some((i) => i.table === 'credit_purchases')).toBe(true);
  });

  it('grants credits for a native payment_intent.succeeded event', async () => {
    const fake = createFakeAdmin();
    fake.queueSelect({ data: { purchased_credits: 500 }, error: null });

    await processStripeEvent(
      {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            metadata: { type: 'credit_purchase', userId: 'user-2', creditAmount: '2500', priceId: 'price_2' },
          },
        },
      } as any,
      { admin: fake.client, stripe: stripeStub },
    );

    expect(fake.updates.find((u) => u.table === 'users')?.payload).toMatchObject({
      purchased_credits: 3000,
    });
  });

  it('ignores payment intents without credit metadata', async () => {
    const fake = createFakeAdmin();
    await processStripeEvent(
      { type: 'payment_intent.succeeded', data: { object: { metadata: {} } } } as any,
      { admin: fake.client, stripe: stripeStub },
    );
    expect(fake.updates).toHaveLength(0);
    expect(fake.inserts).toHaveLength(0);
  });
});
