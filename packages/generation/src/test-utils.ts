/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AdminClient } from '@pixio/database/admin';

export interface FakeAdmin {
  client: AdminClient;
  updates: { table: string; payload: any }[];
  inserts: { table: string; payload: any }[];
  uploads: { path: string }[];
  queueSelect(result: { data: any; error: any }): void;
}

export function createFakeAdmin(): FakeAdmin {
  const updates: { table: string; payload: any }[] = [];
  const inserts: { table: string; payload: any }[] = [];
  const uploads: { path: string }[] = [];
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
    upload: async (path: string) => {
      uploads.push({ path });
      return { data: { path }, error: null };
    },
    getPublicUrl: (path: string) => ({ data: { publicUrl: `https://storage.test/${path}` } }),
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
    uploads,
    queueSelect: (r) => selectQueue.push(r),
  };
}
