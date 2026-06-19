/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AdminClient } from '@pixio/database/admin';

/**
 * Minimal chainable fake of a Supabase service-role client for unit tests.
 * Records update/insert payloads and serves a queue of select results.
 */
export interface FakeAdmin {
  client: AdminClient;
  updates: { table: string; payload: any }[];
  inserts: { table: string; payload: any }[];
  /** Queue a result for the next `.single()` / `.maybeSingle()` call. */
  queueSelect(result: { data: any; error: any }): void;
}

export function createFakeAdmin(): FakeAdmin {
  const updates: { table: string; payload: any }[] = [];
  const inserts: { table: string; payload: any }[] = [];
  const selectQueue: { data: any; error: any }[] = [];

  function builder(table: string) {
    const next = () => Promise.resolve(selectQueue.shift() ?? { data: null, error: null });
    const chain: any = {
      select: () => chain,
      eq: () => chain,
      in: () => chain,
      order: () => chain,
      limit: () => chain,
      not: () => chain,
      maybeSingle: next,
      single: next,
      update: (payload: any) => {
        updates.push({ table, payload });
        return { eq: () => Promise.resolve({ error: null }) };
      },
      insert: (payload: any) => {
        inserts.push({ table, payload });
        const p: any = Promise.resolve({ error: null });
        p.select = () => ({ single: next });
        return p;
      },
    };
    return chain;
  }

  const storageApi = {
    upload: async () => ({ data: { path: 'p' }, error: null }),
    getPublicUrl: () => ({ data: { publicUrl: 'https://storage.test/p' } }),
    remove: async () => ({ error: null }),
    list: async () => ({ data: [], error: null }),
  };

  const client: any = {
    from: (t: string) => builder(t),
    storage: { from: () => storageApi },
  };

  return {
    client: client as AdminClient,
    updates,
    inserts,
    queueSelect: (r) => selectQueue.push(r),
  };
}
