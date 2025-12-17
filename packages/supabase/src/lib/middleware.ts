// src/lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import { Database } from '../types/db_types';

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log("[Middleware] Checking Env:", { 
    url: supabaseUrl ? (supabaseUrl.substring(0, 10) + '...') : "MISSING", 
    key: supabaseKey ? "PRESENT" : "MISSING" 
  });

  if (!supabaseUrl || !supabaseKey) {
    console.error("[Middleware] Critical: Missing Supabase environment variables.");
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  try {
    // Refresh session
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
       console.log("[Middleware] getUser error:", error.message);
    }

    // Optional: Redirect unauthenticated users
    const authPath = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/signup') || 
                     request.nextUrl.pathname.startsWith('/auth');
    
    const protectedPaths = ['/dashboard', '/account', '/premium'];
    const isProtectedPath = protectedPaths.some(path => 
      request.nextUrl.pathname.startsWith(path)
    );

    // Redirect unauthenticated users from protected routes to login
    if (!user && isProtectedPath) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/login';
      redirectUrl.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Redirect authenticated users from auth routes to dashboard
    if (user && authPath) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/dashboard';
      return NextResponse.redirect(redirectUrl);
    }
  } catch (err: any) {
    console.error("[Middleware] Unexpected error fetching user:", err);
  }

  return supabaseResponse;
}
