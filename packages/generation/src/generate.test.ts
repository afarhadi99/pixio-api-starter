import { describe, it, expect } from 'vitest';
import { createFakeAdmin } from './test-utils';
import { queueGeneration } from './generate';

const deps = (admin: any) => ({ admin, apiKey: 'test-key', webhookUrl: 'https://app.test/hook' });

describe('queueGeneration validation', () => {
  it('requires a generation mode', async () => {
    const fake = createFakeAdmin();
    const res = await queueGeneration(deps(fake.client), 'user-1', {} as any);
    expect(res).toMatchObject({ success: false, error: 'Missing generation mode' });
  });

  it('requires a prompt for image mode', async () => {
    const fake = createFakeAdmin();
    const res = await queueGeneration(deps(fake.client), 'user-1', { mode: 'image' });
    expect(res).toMatchObject({ success: false, error: 'Missing prompt' });
  });

  it('requires an input image for edit mode', async () => {
    const fake = createFakeAdmin();
    const res = await queueGeneration(deps(fake.client), 'user-1', { mode: 'video' });
    expect(res).toMatchObject({ success: false, error: 'Missing image for editing' });
  });

  it('returns "Not enough credits" when the balance is too low', async () => {
    const fake = createFakeAdmin();
    // useCredits reads the balance first
    fake.queueSelect({ data: { subscription_credits: 1, purchased_credits: 0 }, error: null });
    const res = await queueGeneration(deps(fake.client), 'user-1', {
      mode: 'image',
      prompt: 'a cat',
    });
    expect(res).toMatchObject({ success: false, error: 'Not enough credits' });
  });
});
