// src/components/account/manage-subscription-button.tsx
'use client';

import { Button } from '@repo/ui';
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Settings } from 'lucide-react'; // Added icon

export function ManageSubscriptionButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleManageSubscription = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/create-customer-portal', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create customer portal session');
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Something went wrong');
      setIsLoading(false);
    }
  };

  return (
    // Styled Button with icon
    <Button
      onClick={handleManageSubscription}
      className="w-full glass-button bg-white/10 hover:bg-white/20 text-foreground hover:text-primary transition-all duration-300 shadow-md text-base py-2.5 font-semibold" // Styled button
      disabled={isLoading}
    >
      {isLoading ? (
        <>
           <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
        </>
      ) : (
        <>
           <Settings className="mr-2 h-4 w-4" /> Manage Subscription
        </>
      )}
    </Button>
  );
}
