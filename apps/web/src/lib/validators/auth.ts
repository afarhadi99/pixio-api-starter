// src/lib/validators/auth.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export const signupSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  full_name: z.string().min(1, { message: 'Name is required' }).optional(),
});

export const updateProfileSchema = z.object({
  full_name: z.string().min(1, { message: 'Name is required' }),
  avatar_url: z.string().optional(),
});

export type TLoginSchema = z.infer<typeof loginSchema>;
export type TSignupSchema = z.infer<typeof signupSchema>;
export type TUpdateProfileSchema = z.infer<typeof updateProfileSchema>;
