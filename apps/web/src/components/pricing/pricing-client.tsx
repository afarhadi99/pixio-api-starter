// src/components/pricing/pricing-client.tsx
'use client';

import { useState } from 'react';
import { Button } from '@repo/ui';
import { formatPrice } from '@repo/ui/utils';
import Link from 'next/link';
import { toast } from 'sonner';
import { PRICING_TIERS, PricingTier } from '@/lib/config/pricing';

// Component for toggling between monthly and yearly billing
function BillingToggle({ 
  billingInterval, 
  setBillingInterval 
}: { 
  billingInterval: 'monthly' | 'yearly',
  setBillingInterval: (interval: 'monthly' | 'yearly') => void 
}) {
  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      <span className={`text-sm ${billingInterval === 'monthly' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
        Monthly
      </span>
      <button
        type="button"
        className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-muted transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        role="switch"
        aria-checked={billingInterval === 'yearly'}
        onClick={() => setBillingInterval(billingInterval === 'monthly' ? 'yearly' : 'monthly')}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${
            billingInterval === 'yearly' ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
      <span className={`text-sm flex items-center gap-1.5 ${billingInterval === 'yearly' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
        Yearly
        <span className="inline-block px-1.5 py-0.5 text-xs rounded-full bg-accent/10 text-accent font-medium">
          Save up to 16%
        </span>
      </span>
    </div>
  );
}

export interface PricingClientProps { 
  initialBillingInterval: 'monthly' | 'yearly';
  pricingTiers: PricingTier[];
  userTierId: string;
  isAuthenticated: boolean;
}

export function PricingClient({ 
  initialBillingInterval,
  pricingTiers,
  userTierId,
  isAuthenticated
}: PricingClientProps) {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>(initialBillingInterval);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  
  // Function to handle subscription with redirect checkout
  const handleSubscribe = async (priceId: string) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    
    setIsLoading(priceId);
    
    try {
      console.log(`Creating checkout session for price: ${priceId}`);
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.url) {
        console.log(`Redirecting to checkout: ${data.url}`);
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast.error(error.message || 'Something went wrong');
      setIsLoading(null);
    }
  };
  
  return (
    <>
      <BillingToggle 
        billingInterval={billingInterval} 
        setBillingInterval={setBillingInterval} 
      />
      
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pricingTiers.map((tier) => {
          const price = tier.pricing[billingInterval];
          const isCurrentPlan = userTierId === tier.id;
          
          return (
            <div 
              key={tier.id}
              className={`relative rounded-xl overflow-hidden border ${
                tier.popular 
                  ? 'border-primary shadow-lg' 
                  : 'border-border shadow'
              } ghibli-card`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-primary text-white text-xs px-3 py-1 rounded-bl-lg">
                  Popular
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                <p className="text-muted-foreground mb-4">{tier.description}</p>
                <div className="mb-4">
                  {price.amount ? (
                    <div>
                      <span className="text-3xl font-bold">{formatPrice(price.amount)}</span>
                      <span className="text-muted-foreground ml-1">/{billingInterval === 'monthly' ? 'month' : 'year'}</span>
                      
                      {billingInterval === 'yearly' && tier.pricing.yearly.discount && (
                        <p className="text-sm text-accent mt-1">
                          Save {tier.pricing.yearly.discount}% with annual billing
                        </p>
                      )}
                    </div>
                  ) : (
                    <span className="text-3xl font-bold">Free</span>
                  )}
                </div>
                
                <ul className="mb-6 space-y-2">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {price.priceId ? (
                  isCurrentPlan && billingInterval === initialBillingInterval ? (
                    <Button disabled className="w-full">
                      Current Plan
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleSubscribe(price.priceId!)}
                      className="w-full" 
                      variant={tier.popular ? 'default' : 'outline'}
                      disabled={isLoading === price.priceId}
                    >
                      {isLoading === price.priceId ? 'Processing...' : (isCurrentPlan ? 'Change Plan' : 'Subscribe')}
                    </Button>
                  )
                ) : (
                  <Button asChild className="w-full" variant={tier.popular ? 'default' : 'outline'}>
                    <Link href={isCurrentPlan ? '/dashboard' : (isAuthenticated ? '/dashboard' : '/signup')}>
                      {isCurrentPlan ? 'Dashboard' : 'Get Started'}
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
