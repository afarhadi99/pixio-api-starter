// src/app/(marketing)/pricing/page.tsx
import { createClient } from '@repo/supabase/server';
import { PRICING_TIERS, getTierByPriceId } from '@/lib/config/pricing';
import { PricingClient } from '@/components/pricing/pricing-client';

export default async function PricingPage() {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  // Variable for client-side component to access
  const initialBillingInterval = 'monthly';
  
  // If user is authenticated, fetch their subscription to highlight current plan
  let userSubscription = null;
  let userTierId = 'free';
  let userBillingInterval: 'monthly' | 'yearly' = initialBillingInterval;
  
  if (user) {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*, prices(id, products(*))')
      .eq('user_id', user.id)
      .in('status', ['trialing', 'active'])
      .maybeSingle();
    
    if (subscription) {
      userSubscription = subscription;
      
      // Determine which tier the user is on based on price ID
      const priceId = subscription.prices?.id;
      const { tier, interval } = getTierByPriceId(priceId);
      
      if (tier) {
        userTierId = tier.id;
        
        // If we have the interval information, use it as the initial billing interval
        if (interval) {
          userBillingInterval = interval;
        }
      }
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="text-center max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Choose the perfect plan for your needs. All plans include a 14-day free trial.
        </p>
        
        {/* Client-side component for billing toggle */}
        <PricingClient 
          initialBillingInterval={userBillingInterval} 
          pricingTiers={PRICING_TIERS} 
          userTierId={userTierId}
          isAuthenticated={!!user}
        />
      </div>
    </div>
  );
}
