import { useEffect, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { PricingTier, CreditPack } from '@pixio/config';

import { ScreenShell } from '@/components/screen-shell';
import { SettingsHero } from '@/components/settings/settings-hero';
import { SettingsCard } from '@/components/settings/settings-card';
import { useSettingsColors } from '@/components/settings/settings-colors';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/primitives';
import { useAuth } from '@/lib/auth';
import { useCredits, useSubscription } from '@/lib/hooks';
import { usePayments } from '@/lib/payments';
import { api } from '@/lib/api';
import { BottomTabInset, Spacing } from '@/constants/theme';

export default function AccountScreen() {
  const colors = useSettingsColors();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const { subscription, tier, refresh: refreshSub } = useSubscription();
  const { subscription: subCredits, purchased, total, refresh: refreshCredits } = useCredits();
  const { buyCreditPack, subscribe } = usePayments();

  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [packs, setPacks] = useState<CreditPack[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    api
      .getConfig()
      .then((c) => {
        setTiers(c.tiers.filter((t) => t.id !== 'free'));
        setPacks(c.creditPacks);
      })
      .catch(() => {});
  }, []);

  const afterPurchase = async (
    label: string,
    run: () => Promise<{ status: string; error?: string }>,
  ) => {
    setBusy(label);
    const res = await run();
    setBusy(null);
    if (res.status === 'completed') {
      Alert.alert('Success', 'Payment complete. Your account will update shortly.');
      setTimeout(() => {
        refreshCredits();
        refreshSub();
      }, 1500);
    } else if (res.status === 'failed') {
      Alert.alert('Payment failed', res.error ?? 'Please try again.');
    }
  };

  const openPortal = async () => {
    try {
      const { url } = await api.openPortal();
      Linking.openURL(url);
    } catch (e: any) {
      Alert.alert('Could not open billing portal', e.message);
    }
  };

  return (
    <ScreenShell>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + Spacing.four,
          paddingHorizontal: Spacing.three,
          paddingBottom: insets.bottom + BottomTabInset + Spacing.four,
          gap: Spacing.three,
        }}
      >
        <SettingsHero title="Account" subtitle={user?.email ?? 'Manage your plan and credits.'} symbol="account" />

        {/* Credits */}
        <SettingsCard title="Credits" symbol="billing" tone="primary" eyebrow={`${total.toLocaleString()} total`}>
          <Row label="Subscription" value={subCredits.toLocaleString()} />
          <Row label="Purchased" value={purchased.toLocaleString()} />
        </SettingsCard>

        {/* Subscription */}
        <SettingsCard title="Subscription" symbol="subscription" tone="tertiary" eyebrow={tier.toUpperCase()}>
          {subscription?.current_period_end ? (
            <Row label="Renews" value={new Date(subscription.current_period_end).toLocaleDateString()} />
          ) : (
            <ThemedText type="small" style={{ color: colors.textSecondary }}>
              You're on the free plan.
            </ThemedText>
          )}
          {tier !== 'free' ? (
            <Button title="Manage subscription" variant="ghost" onPress={openPortal} />
          ) : null}
        </SettingsCard>

        {/* Plans */}
        {tiers.length > 0 ? (
          <SettingsCard title="Plans" symbol="subscription" tone="secondary">
            {tiers.map((t) => {
              const priceId = t.pricing.monthly.priceId;
              const current = tier === t.id;
              return (
                <View key={t.id} style={styles.planRow}>
                  <View style={{ flex: 1 }}>
                    <ThemedText type="smallBold" style={{ color: colors.text }}>
                      {t.name}
                    </ThemedText>
                    <ThemedText type="small" style={{ color: colors.textSecondary }}>
                      ${((t.pricing.monthly.amount ?? 0) / 100).toFixed(0)}/mo · {t.credits} credits
                    </ThemedText>
                  </View>
                  <Button
                    title={current ? 'Current' : 'Subscribe'}
                    disabled={current || !priceId}
                    loading={busy === `sub-${t.id}`}
                    onPress={() => priceId && afterPurchase(`sub-${t.id}`, () => subscribe(priceId))}
                  />
                </View>
              );
            })}
          </SettingsCard>
        ) : null}

        {/* Buy credits */}
        {packs.length > 0 ? (
          <SettingsCard title="Buy credits" symbol="buyMore" tone="primary">
            {packs.map((p) => (
              <View key={p.id} style={styles.planRow}>
                <View style={{ flex: 1 }}>
                  <ThemedText type="smallBold" style={{ color: colors.text }}>
                    {p.name}
                  </ThemedText>
                  <ThemedText type="small" style={{ color: colors.textSecondary }}>
                    ${(p.price / 100).toFixed(0)}
                  </ThemedText>
                </View>
                <Button
                  title="Buy"
                  disabled={!p.priceId}
                  loading={busy === `pack-${p.id}`}
                  onPress={() => p.priceId && afterPurchase(`pack-${p.id}`, () => buyCreditPack(p.priceId))}
                />
              </View>
            ))}
          </SettingsCard>
        ) : null}

        {/* Account */}
        <SettingsCard title="Account" symbol="account" tone="neutral" description={user?.email ?? undefined}>
          <Button title="Sign out" variant="danger" onPress={signOut} testID="sign-out" />
        </SettingsCard>
      </ScrollView>
    </ScreenShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  const colors = useSettingsColors();
  return (
    <View style={styles.row}>
      <ThemedText type="small" style={{ color: colors.textSecondary }}>
        {label}
      </ThemedText>
      <ThemedText type="smallBold" style={{ color: colors.text }}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
});
