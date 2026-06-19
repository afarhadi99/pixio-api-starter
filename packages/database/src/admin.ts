import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

export type AdminClient = SupabaseClient<Database>;

/**
 * Create a service-role Supabase client (bypasses RLS). SERVER-ONLY.
 * Each app creates a single instance and passes it into the @pixio/* helpers.
 */
export function createAdminClient(supabaseUrl: string, serviceRoleKey: string): AdminClient {
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Convenience: build the admin client from standard env vars.
 */
export function createAdminClientFromEnv(env: NodeJS.ProcessEnv = process.env): AdminClient {
  const url = env.NEXT_PUBLIC_SUPABASE_URL ?? env.EXPO_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for admin client');
  }
  return createAdminClient(url, key);
}
