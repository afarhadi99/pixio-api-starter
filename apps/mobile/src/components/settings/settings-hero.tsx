import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

import { SETTINGS_SYMBOLS } from './settings.constants';
import { useSettingsColors } from './settings-colors';
import { SettingsFrostedView } from './settings-frosted-view';
import { SettingsSymbolBadge } from './settings-symbol-badge';

type SettingsHeroProps = {
  title: string;
  subtitle: string;
  symbol: keyof typeof SETTINGS_SYMBOLS;
};

export function SettingsHero({ title, subtitle, symbol }: SettingsHeroProps) {
  const colors = useSettingsColors();

  return (
    <SettingsFrostedView
      style={[styles.shell, { borderColor: colors.border, boxShadow: `0 24px 48px ${colors.shadow}` }]}
    >
      <Animated.View
        entering={FadeIn.duration(320)}
        layout={LinearTransition.springify().damping(18)}
        style={styles.titleRow}
      >
        <SettingsSymbolBadge
          name={SETTINGS_SYMBOLS[symbol]}
          size={22}
          tintColor={colors.onPrimaryContainer}
          backgroundColor={colors.primaryContainer}
          animated
        />
        <ThemedText type="title" selectable style={[styles.title, { color: colors.text }]}>
          {title}
        </ThemedText>
      </Animated.View>

      <ThemedText type="default" selectable style={[styles.subtitle, { color: colors.textSecondary }]}>
        {subtitle}
      </ThemedText>
    </SettingsFrostedView>
  );
}

const styles = StyleSheet.create({
  shell: { borderRadius: 32, borderCurve: 'continuous', padding: Spacing.four, gap: Spacing.two, borderWidth: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  title: { fontSize: 36, lineHeight: 42, fontWeight: '700', flexShrink: 1 },
  subtitle: { maxWidth: 560 },
});
