// src/components/checkout/checkout-modal.tsx
'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@repo/ui';
import { Button } from '@repo/ui';

// Initialize Stripe outside of components (only once)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  priceId: string;
  productName: string;
}

export function CheckoutModal({ isOpen, onClose, priceId, productName }: CheckoutModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if the modal is open
    if (isOpen && priceId) {
      const fetchCheckoutSession = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
          const response = await fetch(`/api/create-checkout-session`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              priceId,
              embedded: true
            }),
          });
          
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          
          const data = await response.json();
          setClientSecret(data.clientSecret);
        } catch (err) {
          console.error('Error creating checkout session:', err);
          setError('Failed to start checkout process. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchCheckoutSession();
    }
  }, [isOpen, priceId]);

  // Handle close - reset state
  const handleClose = () => {
    setClientSecret(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[75%] sm:max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="bg-destructive/10 p-3 rounded-md text-destructive text-sm mb-4">
            {error}
          </div>
        )}
        
        {isLoading && (
          <div className="py-12 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          </div>
        )}
        
        {clientSecret && (
          <div className="w-full">
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ clientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        )}
        
        {!clientSecret && !isLoading && (
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
