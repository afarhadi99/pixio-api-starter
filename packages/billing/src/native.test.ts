import { describe, it, expect, vi } from 'vitest';
import { createEphemeralKey, createSubscriptionForNative } from './native';

function fakeStripe() {
  return {
    ephemeralKeys: { create: vi.fn(async () => ({ secret: 'ek_secret' })) },
    subscriptions: {
      create: vi.fn(async () => ({
        id: 'sub_123',
        latest_invoice: { payment_intent: { client_secret: 'pi_secret' } },
      })),
    },
  } as any;
}

describe('createEphemeralKey', () => {
  it('returns the secret from the created key', async () => {
    const stripe = fakeStripe();
    const secret = await createEphemeralKey(stripe, 'cus_1');
    expect(secret).toBe('ek_secret');
    expect(stripe.ephemeralKeys.create).toHaveBeenCalledWith(
      { customer: 'cus_1' },
      expect.objectContaining({ apiVersion: expect.any(String) }),
    );
  });
});

describe('createSubscriptionForNative', () => {
  it('creates an incomplete subscription and returns the PI client secret', async () => {
    const stripe = fakeStripe();
    const result = await createSubscriptionForNative(stripe, {
      customerId: 'cus_1',
      priceId: 'price_pro',
      userId: 'user-1',
      publishableKey: 'pk_test',
    });

    expect(result.subscriptionId).toBe('sub_123');
    expect(result.paymentIntentClientSecret).toBe('pi_secret');
    expect(result.ephemeralKey).toBe('ek_secret');
    expect(stripe.subscriptions.create).toHaveBeenCalledWith(
      expect.objectContaining({ payment_behavior: 'default_incomplete' }),
    );
  });
});
