import { StyleSheet } from 'react-native';

import { Spacing } from '@/constants/theme';

export const settingsCardStyles = StyleSheet.create({
  card: {
    borderRadius: 28,
    borderCurve: 'continuous',
    padding: Spacing.four,
    gap: Spacing.three,
    borderWidth: 1,
  },
  header: { gap: Spacing.one },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, flex: 1 },
  eyebrowPill: {
    borderRadius: 999,
    borderCurve: 'continuous',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderWidth: 1,
  },
  eyebrow: { letterSpacing: 0.8, textTransform: 'uppercase' },
  description: { maxWidth: 560 },
});
