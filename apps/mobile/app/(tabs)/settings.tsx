import { useEffect, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { PricingTier, CreditPack } from '@pixio/config';
import { Button, Card, Heading, Muted, Screen } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { useCredits, useSubscription } from '@/lib/hooks';
import { usePayments } from '@/lib/payments';
import { api } from '@/lib/api';
import { colors, spacing } from '@/lib/theme';

export default function SettingsScreen() {
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

  const afterPurchase = async (label: string, run: () => Promise<{ status: string; error?: string }>) => {
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
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Heading>Settings</Heading>
        <Muted>{user?.email}</Muted>
        <View style={{ height: spacing.md }} />

        <Card>
          <Text style={styles.sectionTitle}>Subscription</Text>
          <View style={styles.row}>
            <Muted>Current plan</Muted>
            <Text style={styles.value}>{tier.toUpperCase()}</Text>
          </View>
          {subscription?.current_period_end ? (
            <View style={styles.row}>
              <Muted>Renews</Muted>
              <Text style={styles.value}>
                {new Date(subscription.current_period_end).toLocaleDateString()}
              </Text>
            </View>
          ) : null}
          {tier !== 'free' ? (
            <Button title="Manage subscription" variant="ghost" onPress={openPortal} />
          ) : null}
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Credits</Text>
          <View style={styles.row}>
            <Muted>Subscription</Muted>
            <Text style={styles.value}>{subCredits.toLocaleString()}</Text>
          </View>
          <View style={styles.row}>
            <Muted>Purchased</Muted>
            <Text style={styles.value}>{purchased.toLocaleString()}</Text>
          </View>
          <View style={[styles.row, styles.totalRow]}>
            <Text style={styles.value}>Total</Text>
            <Text style={[styles.value, { color: colors.primary }]}>{total.toLocaleString()}</Text>
          </View>
        </Card>

        {tiers.length > 0 && (
          <Card>
            <Text style={styles.sectionTitle}>Plans</Text>
            {tiers.map((t) => {
              const priceId = t.pricing.monthly.priceId;
              return (
                <View key={t.id} style={styles.planRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.value}>{t.name}</Text>
                    <Muted>${((t.pricing.monthly.amount ?? 0) / 100).toFixed(0)}/mo · {t.credits} credits</Muted>
                  </View>
                  <Button
                    title={tier === t.id ? 'Current' : 'Subscribe'}
                    disabled={tier === t.id || !priceId}
                    loading={busy === `sub-${t.id}`}
                    onPress={() => priceId && afterPurchase(`sub-${t.id}`, () => subscribe(priceId))}
                  />
                </View>
              );
            })}
          </Card>
        )}

        {packs.length > 0 && (
          <Card>
            <Text style={styles.sectionTitle}>Buy credits</Text>
            {packs.map((p) => (
              <View key={p.id} style={styles.planRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.value}>{p.name}</Text>
                  <Muted>${(p.price / 100).toFixed(0)}</Muted>
                </View>
                <Button
                  title="Buy"
                  disabled={!p.priceId}
                  loading={busy === `pack-${p.id}`}
                  onPress={() => p.priceId && afterPurchase(`pack-${p.id}`, () => buyCreditPack(p.priceId))}
                />
              </View>
            ))}
          </Card>
        )}

        <Button title="Sign out" variant="danger" onPress={signOut} testID="sign-out" />
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  totalRow: { borderTopColor: colors.cardBorder, borderTopWidth: 1, marginTop: spacing.xs, paddingTop: spacing.sm },
  value: { color: colors.text, fontWeight: '600' },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderTopColor: colors.cardBorder,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
