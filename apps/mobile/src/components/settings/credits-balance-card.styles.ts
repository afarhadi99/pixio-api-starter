import { StyleSheet } from 'react-native';

import { Spacing } from '@/constants/theme';

export const creditsBalanceCardStyles = StyleSheet.create({
  content: { gap: Spacing.three },
  balanceBlock: { gap: Spacing.half },
  balanceLabelRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  value: { fontSize: 40, lineHeight: 44, fontWeight: '700', fontVariant: ['tabular-nums'] },
  statsRow: { flexDirection: 'row', flexWrap: 'nowrap', gap: Spacing.two },
  statChip: {
    flex: 1,
    minWidth: 0,
    borderRadius: 18,
    borderCurve: 'continuous',
    borderWidth: 1,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    gap: 4,
    alignItems: 'center',
  },
  statHeader: { flexDirection: 'column', alignItems: 'center', gap: Spacing.one },
  buttonRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  buttonItem: { flexGrow: 1, minWidth: 160 },
  loadingState: { minHeight: 132, alignItems: 'center', justifyContent: 'center', gap: Spacing.two },
});
