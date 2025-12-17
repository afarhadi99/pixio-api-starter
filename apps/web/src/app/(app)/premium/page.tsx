// src/app/(app)/premium/page.tsx
import { isUserSubscribed, getSubscriptionTier } from '@repo/supabase/subscriptions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@repo/ui';
import { Button } from '@repo/ui';
import Link from 'next/link';

export default async function PremiumPage() {
  const subscribed = await isUserSubscribed();
  const tier = await getSubscriptionTier();
  
  if (!subscribed) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md ghibli-card">
          <CardHeader className="text-center">
            <CardTitle>Premium Content</CardTitle>
            <CardDescription>
              This content requires an active subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4 pb-6">
            <div className="py-6">
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-muted-foreground">
                Upgrade your account to access premium features and content.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/pricing">View Plans</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Premium Content</h1>
        <p className="text-muted-foreground">
          Welcome to the premium section! You have access to exclusive content.
        </p>
      </div>
      
      <div className="p-4 mb-8 rounded-lg bg-primary-50 border border-primary-200 text-primary-800">
        <div className="flex gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <h3 className="font-medium">Your Subscription Tier: {tier.toUpperCase()}</h3>
            <p className="text-sm mt-1">
              You have full access to all premium content based on your {tier} subscription.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Premium Feature 1 */}
        <Card>
          <CardHeader>
            <CardTitle>Advanced Analytics</CardTitle>
            <CardDescription>
              Detailed insights into your data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-primary-50 rounded-md flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="mt-4 text-muted-foreground">
              Unlock deep insights with our advanced analytics tools. Track performance, visualize trends, and make data-driven decisions.
            </p>
          </CardContent>
        </Card>
        
        {/* Premium Feature 2 */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Support</CardTitle>
            <CardDescription>
              Get help when you need it most
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-primary-50 rounded-md flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="mt-4 text-muted-foreground">
              As a premium member, you receive priority support from our team. Get answers quickly and resolve issues faster.
            </p>
          </CardContent>
        </Card>
        
        {tier === 'business' && (
          // Business-only feature
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Enterprise Integration</CardTitle>
              <CardDescription>
                Exclusive to Business Plan subscribers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-accent-50 rounded-md flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-accent-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="mt-4 text-muted-foreground">
                Connect your enterprise systems and enjoy seamless integration with our platform. This feature is exclusively available to Business Plan subscribers.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
