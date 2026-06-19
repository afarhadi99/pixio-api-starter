import { describe, it, expect } from 'vitest';
import { createFakeAdmin } from './test-utils';
import { useCredits, addPurchasedCredits, resetSubscriptionCredits } from './index';

describe('useCredits', () => {
  it('spends subscription credits first', async () => {
    const fake = createFakeAdmin();
    fake.queueSelect({ data: { subscription_credits: 100, purchased_credits: 50 }, error: null });

    const ok = await useCredits(fake.client, 'user-1', 30, 'gen');
    expect(ok).toBe(true);

    const userUpdate = fake.updates.find((u) => u.table === 'users');
    expect(userUpdate?.payload).toMatchObject({
      subscription_credits: 70,
      purchased_credits: 50,
    });
    expect(fake.inserts.some((i) => i.table === 'credit_usage')).toBe(true);
  });

  it('falls through to purchased credits when subscription is insufficient', async () => {
    const fake = createFakeAdmin();
    fake.queueSelect({ data: { subscription_credits: 20, purchased_credits: 100 }, error: null });

    const ok = await useCredits(fake.client, 'user-1', 50, 'gen');
    expect(ok).toBe(true);

    const userUpdate = fake.updates.find((u) => u.table === 'users');
    expect(userUpdate?.payload).toMatchObject({
      subscription_credits: 0,
      purchased_credits: 70,
    });
  });

  it('returns false and mutates nothing when balance is too low', async () => {
    const fake = createFakeAdmin();
    fake.queueSelect({ data: { subscription_credits: 5, purchased_credits: 5 }, error: null });

    const ok = await useCredits(fake.client, 'user-1', 50, 'gen');
    expect(ok).toBe(false);
    expect(fake.updates).toHaveLength(0);
    expect(fake.inserts).toHaveLength(0);
  });
});

describe('addPurchasedCredits', () => {
  it('increments the existing purchased balance', async () => {
    const fake = createFakeAdmin();
    fake.queueSelect({ data: { purchased_credits: 1000 }, error: null });

    const ok = await addPurchasedCredits(fake.client, 'user-1', 2500);
    expect(ok).toBe(true);
    expect(fake.updates[0]?.payload).toMatchObject({ purchased_credits: 3500 });
  });
});

describe('resetSubscriptionCredits', () => {
  it('sets credits to the tier allowance', async () => {
    const fake = createFakeAdmin();
    const ok = await resetSubscriptionCredits(fake.client, 'user-1', 'pro');
    expect(ok).toBe(true);
    expect(fake.updates[0]?.payload).toMatchObject({ subscription_credits: 3000 });
  });
});
