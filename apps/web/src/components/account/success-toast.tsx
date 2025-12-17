// src/components/account/success-toast.tsx
'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

export function SuccessToast() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get('success') === 'true';
  const creditSuccess = searchParams.get('credit_success') === 'true';
  
  useEffect(() => {
    if (success) {
      // Show subscription success toast
      toast.success(
        <div className="flex flex-col">
          <span className="font-medium">Payment successful!</span>
          <span className="text-sm">Your subscription is now active.</span>
        </div>,
        {
          duration: 5000,
        }
      );
      
      // Clean up URL parameters
      setTimeout(() => {
        router.replace('/account');
      }, 500);
    } else if (creditSuccess) {
      // Show credit purchase success toast
      toast.success(
        <div className="flex flex-col">
          <span className="font-medium">Credits purchased!</span>
          <span className="text-sm">Your credits have been added to your account.</span>
        </div>,
        {
          duration: 5000,
        }
      );
      
      // Clean up URL parameters
      setTimeout(() => {
        router.replace('/account');
      }, 500);
    }
  }, [router, success, creditSuccess]);
  
  return null;
}

// This wrapper component handles all the URL parameter logic
export function SuccessToastWrapper() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success') === 'true';
  const creditSuccess = searchParams.get('credit_success') === 'true';
  
  if (success || creditSuccess) {
    return <SuccessToast />;
  }
  
  return null;
}
