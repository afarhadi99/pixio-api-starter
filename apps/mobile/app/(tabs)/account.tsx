import { useEffect, useMemo, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, View } from 'react-native';
import { useIsFocused } from 'expo-router/react-navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CreditPack } from '@pixio/config';
import { getCreditsByTier, getTierById } from '@pixio/config';

import { ScreenShell } from '@/components/screen-shell';
import { SETTINGS_SYMBOLS } from '@/components/settings/settings.constants';
import { SettingsHero } from '@/components/settings/settings-hero';
import { CreditsBalanceCard } from '@/components/settings/credits-balance-card';
import { CreditsLedgerSheet } from '@/components/settings/credits-ledger-sheet';
import { SubscriptionSummaryCard } from '@/components/settings/subscription-summary-card';
import { AccountSettingsCard } from '@/components/settings/account-settings-card';
import type { CreditsBalanceSummary, SubscriptionSummary } from '@/components/settings/settings.types';
import { useAppBottomMenuNativeScrollHandler } from '@/components/options/app-bottom-menu-state';
import { useAuth } from '@/lib/auth';
import { useCredits, useSubscription } from '@/lib/hooks';
import { usePayments } from '@/lib/payments';
import { api } from '@/lib/api';
import { ENV } from '@/lib/env';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const onScroll = useAppBottomMenuNativeScrollHandler(isFocused);
  const { user, signOut } = useAuth();
  const { subscription, tier, loading: subLoading } = useSubscription();
  const {
    subscription: subCredits,
    purchased,
    total,
    loading: creditsLoading,
    refresh: refreshCredits,
  } = useCredits();
  const { buyCreditPack } = usePayments();

  const [packs, setPacks] = useState<CreditPack[]>([]);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [ledgerVisible, setLedgerVisible] = useState(false);

  useEffect(() => {
    api
      .getConfig()
      .then((c) => setPacks(c.creditPacks))
      .catch(() => {});
  }, []);

  const creditsBalance: CreditsBalanceSummary = useMemo(
    () => ({
      total,
      recurringCurrent: subCredits,
      recurringQuota: getCreditsByTier(tier),
      permanent: purchased,
      resetText: subscription?.current_period_end
        ? `Monthly credits renew ${new Date(subscription.current_period_end).toLocaleDateString()}`
        : undefined,
    }),
    [total, subCredits, purchased, tier, subscription?.current_period_end],
  );

  const subscriptionSummary: SubscriptionSummary = useMemo(() => {
    const tierData = getTierById(tier);
    const productName = subscription?.prices?.products?.name ?? tierData?.name ?? 'Free';
    const interval = subscription?.prices?.interval;
    return {
      productName,
      productDescription: tierData?.description,
      statusText: subscription?.status
        ? subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)
        : tier === 'free'
          ? 'Free plan'
          : undefined,
      intervalText: interval ? `${interval === 'year' ? 'Yearly' : 'Monthly'}` : undefined,
      renewalText: subscription?.current_period_end
        ? `Renews ${new Date(subscription.current_period_end).toLocaleDateString()}`
        : undefined,
    };
  }, [subscription, tier]);

  const handleBuyMore = () => {
    if (packs.length === 0) {
      Alert.alert('Credits unavailable', 'Credit packs are not configured.');
      return;
    }
    Alert.alert(
      'Buy credits',
      'Choose a credit pack',
      [
        ...packs.map((p) => ({
          text: `${p.name} · $${(p.price / 100).toFixed(0)}`,
          onPress: async () => {
            if (!p.priceId) return;
            const res = await buyCreditPack(p.priceId);
            if (res.status === 'completed') {
              Alert.alert('Success', 'Payment complete. Your credits will update shortly.');
              setTimeout(refreshCredits, 1500);
            } else if (res.status === 'failed') {
              Alert.alert('Payment failed', res.error ?? 'Please try again.');
            }
          },
        })),
        { text: 'Cancel', style: 'cancel' as const },
      ],
    );
  };

  const handleShowLedger = () => setLedgerVisible(true);

  const openManageSubscription = async () => {
    try {
      const { url } = await api.openPortal();
      Linking.openURL(url);
    } catch (e: any) {
      Alert.alert('Could not open billing', e.message);
    }
  };

  const openAccountSettings = () => {
    const base = ENV.apiUrl?.replace(/\/$/, '');
    if (base) Linking.openURL(`${base}/account`);
    else openManageSubscription();
  };

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut();
    } catch {
      Alert.alert('Unable to log out', 'Please try again in a moment.');
      setIsSigningOut(false);
    }
  };

  return (
    <ScreenShell>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingTop: insets.top + Spacing.five,
            paddingBottom: insets.bottom + BottomTabInset + Spacing.four,
          },
        ]}
      >
        <View style={styles.content}>
          <SettingsHero
            title="Account"
            subtitle="Billing, subscription, and account in one place — with native checkout built in."
            symbol={SETTINGS_SYMBOLS.account}
          />

          <View style={styles.section}>
            <CreditsBalanceCard
              balance={creditsBalance}
              isLoading={creditsLoading}
              onBuyMore={handleBuyMore}
              onShowLedger={handleShowLedger}
            />
          </View>

          <View style={styles.section}>
            <SubscriptionSummaryCard
              subscription={subscriptionSummary}
              isLoading={subLoading}
              onManageSubscription={openManageSubscription}
            />
          </View>

          <View style={styles.section}>
            <AccountSettingsCard
              email={user?.email ?? undefined}
              onOpenAccountSettings={openAccountSettings}
              onSignOut={handleSignOut}
              isSigningOut={isSigningOut}
            />
          </View>
        </View>
      </ScrollView>

      <CreditsLedgerSheet
        visible={ledgerVisible}
        onClose={() => setLedgerVisible(false)}
        userId={user?.id}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  contentContainer: { alignItems: 'center' },
  content: { width: '100%', maxWidth: MaxContentWidth, gap: Spacing.four, paddingHorizontal: Spacing.three },
  section: { gap: 0 },
});
