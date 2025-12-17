// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert Stripe timestamp to Date object
export function toDateTime(secs: number | null | undefined): Date | null {
  if (secs === null || secs === undefined) {
    return null;
  }
  
  try {
    // Stripe timestamps are in seconds, JavaScript expects milliseconds
    return new Date(secs * 1000);
  } catch (error) {
    console.error(`Invalid timestamp: ${secs}`, error);
    return null;
  }
}

// Helper function to safely get ISO strings
export function safeToISOString(timestamp: number | null | undefined): string | null {
  if (timestamp === null || timestamp === undefined) {
    return null;
  }
  
  try {
    // Stripe timestamps are in seconds, JavaScript expects milliseconds
    const date = new Date(timestamp * 1000);
    return date.toISOString();
  } catch (error) {
    console.error(`Invalid timestamp: ${timestamp}`, error);
    return null;
  }
}

// Format price for display
export function formatPrice(
  price: number | null,
  currency: string = 'USD',
  options: {
    locale?: string;
    notation?: Intl.NumberFormatOptions['notation'];
  } = {}
): string {
  if (price === null) {
    return 'Free';
  }
  
  const { locale = 'en-US', notation = 'standard' } = options;
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation,
  }).format((price / 100));
}

// Get URL for the application
export function getURL() {
  let url = process.env.NEXT_PUBLIC_SITE_URL ?? 
    process.env.NEXT_PUBLIC_VERCEL_URL ?? 
    'http://localhost:3000';
  
  // Make sure URL doesn't have trailing slash
  url = url.trim().replace(/\/$/, '');
  
  return url;
}
