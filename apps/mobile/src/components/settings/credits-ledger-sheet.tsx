import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/generation/bottom-sheet';
import { useSettingsColors } from '@/components/settings/settings-colors';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

type IoniconName = keyof typeof Ionicons.glyphMap;

type LedgerRow = {
  id: string;
  amount: number;
  description: string | null;
  created_at: string;
};

function formatLedgerTimestamp(value: string) {
  return new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function iconForDescription(description: string | null): IoniconName {
  const text = (description ?? '').toLowerCase();
  if (text.includes('video') || text.includes('frame')) return 'film-outline';
  if (text.includes('image') || text.includes('edit')) return 'image-outline';
  if (text.includes('refund') || text.includes('grant') || text.includes('bonus')) return 'gift-outline';
  return 'sparkles-outline';
}

/** Bottom-sheet drawer listing the user's recent credit activity. */
export function CreditsLedgerSheet({
  visible,
  onClose,
  userId,
}: {
  visible: boolean;
  onClose: () => void;
  userId: string | undefined;
}) {
  const colors = useSettingsColors();
  const [rows, setRows] = useState<LedgerRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible || !userId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    void supabase
      .from('credit_usage')
      .select('id, amount, description, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data, error: err }) => {
        if (cancelled) return;
        if (err) setError(err.message);
        else setRows((data ?? []) as LedgerRow[]);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [visible, userId]);

  return (
    <BottomSheet visible={visible} title="Credits Ledger" onClose={onClose}>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary as string} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <ThemedText type="smallBold" style={{ color: colors.text }}>
            Unable to load history
          </ThemedText>
          <ThemedText type="small" style={{ color: colors.textSecondary, textAlign: 'center' }}>
            {error}
          </ThemedText>
        </View>
      ) : rows.length === 0 ? (
        <View style={styles.centered}>
          <ThemedText type="smallBold" style={{ color: colors.text }}>
            No history yet
          </ThemedText>
          <ThemedText type="small" style={{ color: colors.textSecondary, textAlign: 'center' }}>
            Credits activity will show up here once you start using the app.
          </ThemedText>
        </View>
      ) : (
        rows.map((row, index) => (
          <View key={`${row.id}-${index}`}>
            {index > 0 ? <View style={[styles.separator, { backgroundColor: colors.border }]} /> : null}
            <LedgerRowView row={row} />
          </View>
        ))
      )}
    </BottomSheet>
  );
}

function LedgerRowView({ row }: { row: LedgerRow }) {
  const colors = useSettingsColors();
  const delta = -Math.abs(row.amount);
  return (
    <View style={styles.row}>
      <View style={[styles.iconShell, { backgroundColor: colors.chip, borderColor: colors.border }]}>
        <Ionicons name={iconForDescription(row.description)} size={18} color={colors.icon as string} />
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <ThemedText type="smallBold" numberOfLines={1} style={[styles.label, { color: colors.text }]}>
            {row.description || 'Credit usage'}
          </ThemedText>
          <ThemedText type="smallBold" style={[styles.delta, { color: colors.negative as string }]}>
            {delta.toLocaleString()}
          </ThemedText>
        </View>
        <ThemedText type="small" style={{ color: colors.textSecondary }}>
          {formatLedgerTimestamp(row.created_at)}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { alignItems: 'center', justifyContent: 'center', gap: Spacing.two, paddingVertical: Spacing.five },
  separator: { height: 1, marginVertical: Spacing.one },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.two },
  iconShell: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  content: { flex: 1, gap: 2 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.two },
  label: { flexShrink: 1 },
  delta: { fontVariant: ['tabular-nums'], flexShrink: 0 },
});
