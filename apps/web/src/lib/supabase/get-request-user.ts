import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient, type User } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { Database } from '@/types/db_types';

/**
 * Resolve the authenticated user for an API route, accepting EITHER:
 *  - a Supabase cookie session (web), or
 *  - an `Authorization: Bearer <access_token>` header (mobile / native apps).
 *
 * Returns the user or null. Used by routes that both the web app and the
 * Expo app call.
 */
export async function getRequestUser(req: Request): Promise<User | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // 1) Bearer token (mobile)
  const authHeader = req.headers.get('authorization');
  if (authHeader?.toLowerCase().startsWith('bearer ')) {
    const token = authHeader.slice(7).trim();
    const client = createSupabaseClient<Database>(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const {
      data: { user },
    } = await client.auth.getUser(token);
    return user ?? null;
  }

  // 2) Cookie session (web)
  const cookieStore = await cookies();
  const client = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // No-op: API routes don't refresh the session cookie here.
      },
    },
  });
  const {
    data: { user },
  } = await client.auth.getUser();
  return user ?? null;
}
