import { StyleSheet } from 'react-native';

import { Spacing } from '@/constants/theme';

export const subscriptionSummaryCardStyles = StyleSheet.create({
  content: { gap: Spacing.three },
  summaryBlock: { gap: Spacing.two },
  productName: { fontSize: 34, lineHeight: 38, fontWeight: '700' },
  productDescription: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  badge: { borderRadius: 999, borderWidth: 1, paddingHorizontal: Spacing.two, paddingVertical: Spacing.one },
  loadingState: { minHeight: 120, alignItems: 'center', justifyContent: 'center', gap: Spacing.two },
});
