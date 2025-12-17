// src/middleware.ts
import { type NextRequest } from 'next/server';
import { updateSession } from '@repo/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)',
  ],
};
