// src/app/(app)/account/page.tsx
import { createClient } from '@/lib/supabase/server';
import { getUserSubscription } from '@/lib/supabase/subscriptions';
import { formatPrice } from '@/lib/utils';
import { redirect } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UpdateProfileForm } from '@/components/account/update-profile-form';
import { SuccessToastWrapper } from '@/components/account/success-toast';
import { ManageSubscriptionButton } from '@/components/account/manage-subscription-button';
import { getUserCredits } from '@/lib/credits';
import { CREDIT_PACKS } from '@/lib/config/pricing';
import { CreditPackCard } from '@/components/account/credit-pack-card';
import { User as UserIcon, CreditCard, Zap, Wallet, ImageIcon, Film, Wand2, Clock } from 'lucide-react';

// Helper function to format time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default async function AccountPage() {
  const supabase = await createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch data concurrently
  const [profileResult, subscriptionResult, userCreditsResult, creditUsageResult] = await Promise.all([
    supabase.from('users').select('*').eq('id', user.id).single(),
    getUserSubscription(), // Fetches subscription with price and product
    getUserCredits(),
    supabase
      .from('credit_usage')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  const profile = profileResult.data;
  const subscription = subscriptionResult; // Already includes nested data
  const userCredits = userCreditsResult;
  const creditUsage = creditUsageResult.data;
  
  // Convert dates to ISO strings to avoid hydration mismatches
  const safeUsage = creditUsage?.map(usage => ({
    ...usage,
    // Convert dates to ISO strings to ensure serialization
    created_at: new Date(usage.created_at).toISOString()
  }));

  return (
    <div className="container mx-auto px-4 py-10 space-y-10"> 
      {/* Client component to handle URL parameters and show toast */}
      <SuccessToastWrapper />

      {/* Page Header */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent inline-block">
          Account Settings
        </h1>
        <p className="text-xl text-muted-foreground">
          Manage your profile, subscription, and credits.
        </p>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Main Content Column (Profile, Credits, Security) */}
        <div className="md:col-span-2 space-y-8">

          {/* Profile Card */}
          <Card className="glass-card border border-white/15 shadow-xl overflow-hidden">
            <CardHeader className="pb-4 border-b border-white/15 bg-gradient-to-b from-white/5 to-transparent flex flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center border border-white/15 shadow-inner">
                 <UserIcon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                 <CardTitle className="text-2xl text-foreground/95">Profile Information</CardTitle>
                 <CardDescription className="text-base text-muted-foreground">
                   Update your account details
                 </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <UpdateProfileForm profile={profile} />
            </CardContent>
          </Card>

          {/* Credits Card */}
          <Card className="glass-card border border-white/15 shadow-xl overflow-hidden">
            <CardHeader className="pb-4 border-b border-white/15 bg-gradient-to-b from-white/5 to-transparent flex flex-row items-center gap-4">
               <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center border border-white/15 shadow-inner">
                  <Wallet className="w-6 h-6 text-accent-foreground" />
               </div>
               <div>
                  <CardTitle className="text-2xl text-foreground/95">Your Credits</CardTitle>
                  <CardDescription className="text-base text-muted-foreground">
                     Manage and view your credit balance and usage.
                  </CardDescription>
               </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg text-foreground/95">Total Credits Available</h3>
                  <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary inline-block">{userCredits.total.toLocaleString()}</p>
                </div>
              </div>

              <Separator className="bg-white/15" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-foreground/95 text-lg">Subscription Credits</h3>
                  <p className="text-xl text-primary font-bold">{userCredits.subscriptionCredits.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground mt-1">Refreshes monthly based on your plan</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground/95 text-lg">Purchased Credits</h3>
                  <p className="text-xl text-accent/90 font-bold">{userCredits.purchasedCredits.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground mt-1">Never expires</p>
                </div>
              </div>

              {safeUsage && safeUsage.length > 0 && (
                <>
                  <Separator className="bg-white/15" />
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-foreground/95">Recent Usage</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2 styled-scrollbars">
                      {safeUsage.map((usage) => {
                        // Parse the description to get model info
                        const description = usage.description || '';
                        const isKreaFlux = description.includes('image:') || description.includes('Krea Flux');
                        const isQwenEdit = description.includes('Qwen') || description.includes('edit');
                        const isWan = description.includes('firstLastFrameVideo') || description.includes('Wan');
                        
                        // Extract prompt from description
                        const promptMatch = description.match(/[""](.*?)[""]/);
                        const prompt = promptMatch ? promptMatch[1] : description;
                        
                        // Get icon and model name
                        let icon, modelName;
                        if (isWan) {
                          icon = <Film className="h-4 w-4 text-secondary" />;
                          modelName = 'Wan 2.2';
                        } else if (isQwenEdit) {
                          icon = <Wand2 className="h-4 w-4 text-accent" />;
                          modelName = 'Qwen Edit';
                        } else {
                          icon = <ImageIcon className="h-4 w-4 text-primary" />;
                          modelName = 'Krea Flux';
                        }
                        
                        // Format date
                        const date = new Date(usage.created_at);
                        const timeAgo = getTimeAgo(date);
                        
                        return (
                          <div
                            key={usage.id}
                            className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                          >
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                              {icon}
                            </div>
                            <div className="flex-grow min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="font-medium text-sm text-foreground/90">{modelName}</span>
                                <span className="font-bold text-sm text-destructive/90">-{usage.amount}</span>
                              </div>
                              <p className="text-xs text-muted-foreground truncate" title={prompt}>
                                {prompt.length > 40 ? prompt.substring(0, 40) + '...' : prompt}
                              </p>
                              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground/70">
                                <Clock className="h-3 w-3" />
                                <span>{timeAgo}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Purchase Credits Card - Use client component for each card */}
          <Card className="glass-card border border-white/15 shadow-xl overflow-hidden">
            <CardHeader className="pb-4 border-b border-white/15 bg-gradient-to-b from-white/5 to-transparent flex flex-row items-center gap-4">
               <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary/30 to-accent/30 flex items-center justify-center border border-white/15 shadow-inner">
                  <CreditCard className="w-6 h-6 text-secondary-foreground" />
               </div>
               <div>
                  <CardTitle className="text-2xl text-foreground/95">Purchase More Credits</CardTitle>
                  <CardDescription className="text-base text-muted-foreground">
                     Top up your balance with one-time credit packs.
                  </CardDescription>
               </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {CREDIT_PACKS.map((pack) => (
                  <CreditPackCard key={pack.id} creditPack={pack} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Card Column */}
        <div>
          <Card className="glass-card border border-white/15 shadow-xl overflow-hidden sticky top-24">
            <CardHeader className="pb-4 border-b border-white/15 bg-gradient-to-b from-white/5 to-transparent flex flex-row items-center gap-4">
               <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary/30 to-primary/30 flex items-center justify-center border border-white/15 shadow-inner">
                  <Zap className="w-6 h-6 text-secondary-foreground" />
               </div>
               <div>
                  <CardTitle className="text-2xl text-foreground/95">Subscription</CardTitle>
                  <CardDescription className="text-base text-muted-foreground">
                     Manage your plan and billing.
                  </CardDescription>
               </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {subscription ? (
                <>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground/95">Current Plan</h3>
                    {/* Use optional chaining and nullish coalescing for safety */}
                    <p className="text-2xl font-bold text-primary">{subscription.prices?.products?.name || 'Unknown Plan'}</p>
                    <p className="text-base text-muted-foreground mt-1">
                      {subscription.prices?.unit_amount ? formatPrice(subscription.prices.unit_amount) : '$0.00'}
                      / {subscription.prices?.interval || 'month'}
                    </p>
                  </div>

                  <Separator className="bg-white/15" />

                  <div>
                    <h3 className="font-semibold text-lg text-foreground/95">Status</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className={`w-3 h-3 rounded-full ${
                        subscription.status === 'active' ? 'bg-green-500' :
                        subscription.status === 'trialing' ? 'bg-blue-500' : 'bg-red-500'
                      }`}></div>
                      <p className="capitalize text-base text-foreground/95">{subscription.status}</p>
                    </div>
                  </div>

                   <Separator className="bg-white/15" />

                   {/* Manage Subscription Button - Client Component */}
                   <ManageSubscriptionButton />

                </>
              ) : (
                <>
                  <div className="text-center py-4 space-y-4">
                    <h3 className="font-semibold text-lg text-foreground/95">Free Plan</h3>
                    <p className="text-base text-muted-foreground">
                      You are currently on our free plan with limited features.
                    </p>
                    <Button asChild className="w-full glass-button bg-gradient-to-r from-primary to-secondary text-white hover:opacity-95 hover:shadow-lg transition-all duration-300 shadow-md text-lg py-3 font-semibold">
                      <Link href="/pricing">Upgrade Plan</Link>
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
