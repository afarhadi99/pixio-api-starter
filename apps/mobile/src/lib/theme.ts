import { Platform } from 'react-native';

/** Dark theme aligned with Pixio web glass aesthetic. */
export const colors = {
  bg: '#0B0B0F',
  surface: Platform.OS === 'android' ? '#1C1C24' : '#16161DCC',
  surfaceElevated: Platform.OS === 'android' ? '#252530' : '#1E1E28CC',
  surfaceTab: Platform.OS === 'android' ? '#141419' : '#121218CC',
  card: '#16161D',
  cardBorder: '#26262F',
  border: '#2E2E3A',
  text: '#F5F5F7',
  textMuted: '#9A9AA6',
  primary: '#7C5CFF',
  primaryText: '#FFFFFF',
  danger: '#FF5C70',
  success: '#39D98A',
  ripple: 'rgba(124, 92, 255, 0.24)',
};

/** Material elevation levels (Android). */
export const elevation = {
  low: 2,
  medium: 6,
  high: 12,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
};
