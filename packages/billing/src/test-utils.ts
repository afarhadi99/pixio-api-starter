/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AdminClient } from '@pixio/database/admin';

export interface FakeAdmin {
  client: AdminClient;
  updates: { table: string; payload: any }[];
  inserts: { table: string; payload: any }[];
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
      upsert: (payload: any) => {
        inserts.push({ table, payload });
        return Promise.resolve({ error: null });
      },
    };
    return chain;
  }

  const client: any = { from: (t: string) => builder(t) };
  return {
    client: client as AdminClient,
    updates,
    inserts,
    queueSelect: (r) => selectQueue.push(r),
  };
}
