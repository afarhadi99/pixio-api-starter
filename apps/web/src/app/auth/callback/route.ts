// src/app/auth/callback/route.ts
import { createClient } from '@repo/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  
  // Create the redirect URL
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = next as string;
  redirectUrl.searchParams.delete('token_hash');
  redirectUrl.searchParams.delete('type');
  redirectUrl.searchParams.delete('code');
  redirectUrl.searchParams.delete('next');
  
  // Call cookies to prevent caching
  cookies();
  
  const supabase = await createClient();
  
  if (token_hash && type) {
    // Handle email OTP login
    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash
    });
    
    if (error) {
      redirectUrl.pathname = '/login';
      redirectUrl.searchParams.set('error', error.message);
      return NextResponse.redirect(redirectUrl);
    }
  } else if (code) {
    // Handle OAuth login
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      redirectUrl.pathname = '/login';
      redirectUrl.searchParams.set('error', error.message);
      return NextResponse.redirect(redirectUrl);
    }
  }
  
  return NextResponse.redirect(redirectUrl);
}
