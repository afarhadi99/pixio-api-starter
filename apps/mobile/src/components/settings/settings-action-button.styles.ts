import { StyleSheet } from 'react-native';

import { Spacing } from '@/constants/theme';

export const settingsActionButtonStyles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 18,
    borderCurve: 'continuous',
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
  },
});
