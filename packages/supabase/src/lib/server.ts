// src/lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/db_types';

export async function createClient() {
  const cookieStore = await cookies();
  
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { 
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try { 
            cookiesToSet.forEach(({ name, value, options }) => 
              cookieStore.set(name, value, options)
            ); 
          } catch { 
            // This will happen if we're inside a Server Component
            // This can be ignored if middleware is refreshing sessions
          }
        },
      },
    }
  );
}
