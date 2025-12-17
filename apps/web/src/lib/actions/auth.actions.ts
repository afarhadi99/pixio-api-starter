// src/lib/actions/auth.actions.ts
'use server';

import { createClient } from '@repo/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { loginSchema, signupSchema, TLoginSchema, TSignupSchema, updateProfileSchema, TUpdateProfileSchema } from '@/lib/validators/auth';
import { initializeUserCredits } from '@/lib/credits';

export async function login(values: TLoginSchema) {
  // Validate input
  const validatedFields = loginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Invalid input' };
  }

  const { email, password } = validatedFields.data;
  
  // Call cookies to prevent caching
  cookies();

  const supabase = await createClient();
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    return { error: error.message };
  }
  
  redirect('/dashboard');
}

export async function signup(values: TSignupSchema) {
  // Validate input
  const validatedFields = signupSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Invalid input' };
  }

  const { email, password, full_name } = validatedFields.data;
  
  // Call cookies to prevent caching
  cookies();

  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: {
        full_name,
      },
    },
  });
  
  if (error) {
    return { error: error.message };
  }
  
  // Initialize credits for the new user
  if (data.user) {
    await initializeUserCredits(data.user.id);
  }
  
  // Check if email confirmation is required
  // Redirect to a confirmation page if needed
  
  redirect('/dashboard');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}

export async function updateProfile(values: TUpdateProfileSchema) {
  // Validate input
  const validatedFields = updateProfileSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Invalid input' };
  }

  const { full_name, avatar_url } = validatedFields.data;
  
  // Call cookies to prevent caching
  cookies();

  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return { error: 'Authentication error' };
  }
  
  // Update user metadata
  const { error: updateAuthError } = await supabase.auth.updateUser({
    data: { full_name, avatar_url },
  });
  
  if (updateAuthError) {
    return { error: updateAuthError.message };
  }
  
  // Update public profile
  const { error: updateProfileError } = await supabase
    .from('users')
    .update({
      full_name,
      avatar_url,
    })
    .eq('id', user.id);
  
  if (updateProfileError) {
    return { error: updateProfileError.message };
  }
  
  return { success: true };
}
