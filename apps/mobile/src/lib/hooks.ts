import { useCallback, useEffect, useState } from 'react';
import {
  getUserMedia,
  getActiveSubscription,
  deriveTierFromSubscription,
} from '@pixio/database/queries';
import type { GeneratedMedia, Subscription } from '@pixio/database/types';
import { supabase } from './supabase';
import { useAuth } from './auth';

/** Live credit balances for the current user (users table + realtime). */
export function useCredits() {
  const { user } = useAuth();
  const [credits, setCredits] = useState({ subscription: 0, purchased: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('users')
      .select('subscription_credits, purchased_credits')
      .eq('id', user.id)
      .single();
    const subscription = data?.subscription_credits ?? 0;
    const purchased = data?.purchased_credits ?? 0;
    setCredits({ subscription, purchased, total: subscription + purchased });
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
    if (!user) return;
    const channel = supabase
      .channel(`credits:${user.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${user.id}` },
        () => refresh(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refresh]);

  return { ...credits, loading, refresh };
}

/** The current user's generated media, with realtime updates. */
export function useMedia() {
  const { user } = useAuth();
  const [media, setMedia] = useState<GeneratedMedia[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      const rows = await getUserMedia(supabase, user.id);
      setMedia(rows);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
    if (!user) return;
    const channel = supabase
      .channel(`media:${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'generated_media', filter: `user_id=eq.${user.id}` },
        () => refresh(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refresh]);

  return { media, loading, refresh };
}

/** The current user's subscription + derived tier. */
export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      const sub = await getActiveSubscription(supabase, user.id);
      setSubscription(sub);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { subscription, tier: deriveTierFromSubscription(subscription), loading, refresh };
}
