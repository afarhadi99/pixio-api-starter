import { Color } from 'expo-router';
import { useMemo } from 'react';
import { Platform, useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export function useSettingsColors() {
  const scheme = useColorScheme();
  const normalizedScheme = scheme === 'dark' ? 'dark' : 'light';
  const fallback = Colors[normalizedScheme];
  const isDark = normalizedScheme === 'dark';

  return useMemo(() => {
    if (Platform.OS === 'android') {
      return {
        background: Color.android.dynamic.surface,
        backgroundRaised: Color.android.dynamic.surfaceContainerLow,
        surface: Color.android.dynamic.surfaceContainer,
        surfaceElevated: Color.android.dynamic.surfaceContainerHigh,
        chip: Color.android.dynamic.surfaceContainerHighest,
        text: Color.android.dynamic.onSurface,
        textSecondary: Color.android.dynamic.onSurfaceVariant,
        icon: isDark ? '#f8fafc' : '#111827',
        border: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
        primary: Color.android.dynamic.primary,
        primaryContainer: Color.android.dynamic.primaryContainer,
        onPrimaryContainer: Color.android.dynamic.onPrimaryContainer,
        secondary: Color.android.dynamic.secondary,
        secondaryContainer: Color.android.dynamic.secondaryContainer,
        onSecondaryContainer: Color.android.dynamic.onSecondaryContainer,
        tertiary: Color.android.dynamic.tertiary,
        tertiaryContainer: Color.android.dynamic.tertiaryContainer,
        onTertiaryContainer: Color.android.dynamic.onTertiaryContainer,
        positive: '#16a34a',
        negative: '#dc2626',
        shadow: isDark ? 'rgba(0,0,0,0.34)' : 'rgba(15,23,42,0.14)',
        overlay: isDark ? 'rgba(0,0,0,0.58)' : 'rgba(15,23,42,0.24)',
        frostedIntensity: 84,
        blurTint: isDark ? 'systemUltraThinMaterialDark' : 'systemUltraThinMaterialLight',
        blurFallback: isDark ? 'rgba(12,14,18,0.46)' : 'rgba(255,255,255,0.34)',
        sheetBackground: isDark ? 'rgba(28,28,32,0.95)' : 'rgba(255,255,255,0.95)',
        sheetHandle: Color.android.dynamic.outlineVariant,
      } as const;
    }

    if (Platform.OS === 'ios') {
      return {
        background: isDark ? '#000000' : '#F2F2F7',
        backgroundRaised: isDark ? '#1C1C1E' : '#FFFFFF',
        surface: isDark ? '#1C1C1E' : '#FFFFFF',
        surfaceElevated: isDark ? '#2C2C2E' : '#F2F2F7',
        chip: isDark ? 'rgba(120,120,128,0.32)' : 'rgba(120,120,128,0.16)',
        text: isDark ? '#FFFFFF' : '#111827',
        textSecondary: isDark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)',
        icon: isDark ? '#f8fafc' : '#111827',
        border: isDark ? 'rgba(84,84,88,0.65)' : 'rgba(60,60,67,0.29)',
        primary: isDark ? '#0A84FF' : '#007AFF',
        primaryContainer: isDark ? '#5E5CE6' : '#5856D6',
        onPrimaryContainer: '#ffffff',
        secondary: isDark ? '#40C8E0' : '#30B0C7',
        secondaryContainer: isDark ? '#40C8E0' : '#30B0C7',
        onSecondaryContainer: '#ffffff',
        tertiary: isDark ? '#7D7AFF' : '#6E6BFF',
        tertiaryContainer: isDark ? '#7D7AFF' : '#6E6BFF',
        onTertiaryContainer: '#ffffff',
        positive: '#16a34a',
        negative: '#dc2626',
        shadow: isDark ? 'rgba(0,0,0,0.28)' : 'rgba(15,23,42,0.12)',
        overlay: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(15,23,42,0.2)',
        frostedIntensity: 84,
        blurTint: isDark ? 'systemUltraThinMaterialDark' : 'systemUltraThinMaterialLight',
        blurFallback: isDark ? 'rgba(18,18,22,0.3)' : 'rgba(255,255,255,0.24)',
        sheetBackground: isDark ? 'rgba(28,28,32,0.95)' : 'rgba(255,255,255,0.95)',
        sheetHandle: isDark ? 'rgba(235,235,245,0.3)' : 'rgba(60,60,67,0.3)',
      } as const;
    }

    return {
      background: fallback.background,
      backgroundRaised: fallback.backgroundElement,
      surface: fallback.backgroundElement,
      surfaceElevated: fallback.backgroundElement,
      chip: fallback.backgroundSelected,
      text: fallback.text,
      textSecondary: fallback.textSecondary,
      icon: isDark ? '#f8fafc' : '#111827',
      border: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
      primary: '#4f46e5',
      primaryContainer: '#6366f1',
      onPrimaryContainer: '#ffffff',
      secondary: '#0f766e',
      secondaryContainer: '#14b8a6',
      onSecondaryContainer: '#ffffff',
      tertiary: '#8b5cf6',
      tertiaryContainer: '#a78bfa',
      onTertiaryContainer: '#ffffff',
      positive: '#16a34a',
      negative: '#dc2626',
      shadow: isDark ? 'rgba(0,0,0,0.28)' : 'rgba(15,23,42,0.12)',
      overlay: isDark ? 'rgba(0,0,0,0.56)' : 'rgba(15,23,42,0.24)',
      frostedIntensity: 84,
      blurTint: isDark ? 'systemUltraThinMaterialDark' : 'systemUltraThinMaterialLight',
      blurFallback: isDark ? 'rgba(18,18,20,0.42)' : 'rgba(255,255,255,0.28)',
      sheetBackground: isDark ? 'rgba(28,28,32,0.95)' : 'rgba(255,255,255,0.95)',
      sheetHandle: fallback.textSecondary,
    } as const;
  }, [fallback, isDark]);
}
