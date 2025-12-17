// src/components/shared/credits-display.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@repo/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export function CreditsDisplay() {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  
  // Initial fetch and setup of realtime subscription
  useEffect(() => {
    const supabase = createClient();
    let isActive = true;
    
    async function fetchCredits() {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          if (isActive) {
            setLoading(false);
            setCredits(null);
          }
          return;
        }
        
        // Store user ID for realtime subscription
        if (isActive) {
          setUserId(user.id);
        }
        
        // Fetch user credits
        const { data: userData, error } = await supabase
          .from('users')
          .select('subscription_credits, purchased_credits')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching credits:', error);
          if (isActive) {
            setLoading(false);
          }
          return;
        }
        
        if (userData && isActive) {
          const subscriptionCredits = userData.subscription_credits || 0;
          const purchasedCredits = userData.purchased_credits || 0;
          setCredits(subscriptionCredits + purchasedCredits);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in fetchCredits:', error);
        if (isActive) {
          setLoading(false);
        }
      }
    }
    
    // Initial fetch
    fetchCredits();
    
    // Listen for auth changes (login/logout)
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        fetchCredits();
      }
    });
    
    return () => {
      isActive = false;
      
      // Clean up auth subscription
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);
  
  // Set up realtime subscription when userId is available
  useEffect(() => {
    if (!userId) return;
    
    const supabase = createClient();
    
    console.log(`Setting up realtime credits subscription for user ${userId}`);
    
    // Create a channel for this user's credits
    const channel = supabase
      .channel(`credits-for-${userId}`)
      .on('postgres_changes', 
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${userId}`
        }, 
        (payload) => {
          console.log('Credits update received:', payload);
          const newData = payload.new;
          
          if (newData) {
            const subscriptionCredits = newData.subscription_credits || 0;
            const purchasedCredits = newData.purchased_credits || 0;
            setCredits(subscriptionCredits + purchasedCredits);
          }
        }
      )
      .subscribe((status) => {
        console.log(`Realtime subscription status: ${status}`);
      });
    
    // Store the channel reference for cleanup
    channelRef.current = channel;
    
    // Cleanup function
    return () => {
      console.log('Cleaning up credits subscription');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [userId]);
  
  if (loading) {
    return (
      <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium animate-pulse">
        Loading...
      </div>
    );
  }
  
  if (credits === null) {
    return null;
  }
  
  return (
    <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium flex items-center gap-1">
      <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
      {credits.toLocaleString()} Credits
    </div>
  );
}
