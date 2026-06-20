import { StyleSheet } from 'react-native';

import { Spacing } from '@/constants/theme';

export const accountSettingsCardStyles = StyleSheet.create({
  content: { gap: Spacing.three },
  buttonRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  buttonItem: { flexGrow: 1, minWidth: 180 },
});
