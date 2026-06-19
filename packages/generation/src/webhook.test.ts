import { describe, it, expect, vi, afterEach } from 'vitest';
import { createFakeAdmin } from './test-utils';
import { processPixioWebhook } from './webhook';

afterEach(() => {
  vi.unstubAllGlobals();
});

const mediaRow = (overrides: Record<string, any> = {}) => ({
  id: 'media-1',
  user_id: 'user-1',
  media_type: 'image',
  status: 'processing',
  metadata: { run_id: 'run-1' },
  ...overrides,
});

describe('processPixioWebhook', () => {
  it('rejects payloads missing required fields', async () => {
    const fake = createFakeAdmin();
    const res = await processPixioWebhook(fake.client, { run_id: '', status: 'success' } as any);
    expect(res.received).toBe(false);
  });

  it('acknowledges when no media record matches the run_id', async () => {
    const fake = createFakeAdmin();
    fake.queueSelect({ data: null, error: { message: 'not found' } });
    const res = await processPixioWebhook(fake.client, { run_id: 'x', status: 'success' });
    expect(res).toMatchObject({ received: true, warning: 'Media record not found' });
  });

  it('is idempotent for rows already completed', async () => {
    const fake = createFakeAdmin();
    fake.queueSelect({ data: mediaRow({ status: 'completed' }), error: null });
    const res = await processPixioWebhook(fake.client, { run_id: 'run-1', status: 'success' });
    expect(res.warning).toBe('Already in terminal state');
    expect(fake.updates).toHaveLength(0);
  });

  it('marks a failed run as failed with the error message', async () => {
    const fake = createFakeAdmin();
    fake.queueSelect({ data: mediaRow(), error: null });
    const res = await processPixioWebhook(fake.client, {
      run_id: 'run-1',
      status: 'failed',
      error: 'boom',
    });
    expect(res.status).toBe('failed');
    const update = fake.updates.find((u) => u.table === 'generated_media');
    expect(update?.payload.status).toBe('failed');
    expect(update?.payload.metadata.error).toBe('boom');
  });

  it('downloads, stores and completes a successful run', async () => {
    const fake = createFakeAdmin();
    fake.queueSelect({ data: mediaRow(), error: null });
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        statusText: 'OK',
        arrayBuffer: async () => new ArrayBuffer(16),
      })),
    );

    const res = await processPixioWebhook(fake.client, {
      run_id: 'run-1',
      status: 'success',
      outputs: [{ data: { images: [{ url: 'https://pixio.test/out.png' }] } }],
    });

    expect(res).toMatchObject({ received: true, status: 'completed', mediaId: 'media-1' });
    expect(fake.uploads).toHaveLength(1);
    const update = fake.updates.find((u) => u.table === 'generated_media');
    expect(update?.payload.status).toBe('completed');
    expect(update?.payload.media_url).toContain('https://storage.test/');
  });

  it('fails the row when a successful webhook carries no output URL', async () => {
    const fake = createFakeAdmin();
    fake.queueSelect({ data: mediaRow(), error: null });
    const res = await processPixioWebhook(fake.client, {
      run_id: 'run-1',
      status: 'success',
      outputs: [],
    });
    expect(res.error).toBe('No output URL');
    expect(fake.updates[0]?.payload.status).toBe('failed');
  });
});
