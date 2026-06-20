import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View, useColorScheme } from 'react-native';

import { useSettingsColors } from '@/components/settings/settings-colors';
import { ThemedText } from '@/components/themed-text';
import { IosGlassSurface, useIosGlassEligible } from '@/components/ui/ios-glass-surface';

type ModelSelectorTriggerProps = {
  modelName: string;
  estimatedCredits?: number | null;
  onPress: () => void;
};

/** Pill trigger that opens the model picker — mirrors Pixio's ModelSelectorTrigger. */
export function ModelSelectorTrigger({ modelName, estimatedCredits, onPress }: ModelSelectorTriggerProps) {
  const colors = useSettingsColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const iosGlass = Platform.OS === 'ios' && useIosGlassEligible();

  const inputBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';
  const containerStyle = [
    styles.container,
    { borderColor: colors.border },
    !iosGlass && { backgroundColor: inputBg },
  ];

  const content = (
    <>
      <Ionicons name="cube" size={20} color={colors.textSecondary as string} />
      <View style={styles.textContainer}>
        <ThemedText style={{ color: colors.text as string, fontSize: 14, fontWeight: '500' }} numberOfLines={1}>
          {modelName}
        </ThemedText>
      </View>
      {estimatedCredits != null && estimatedCredits > 0 ? (
        <View style={[styles.creditsBadge, { backgroundColor: colors.overlay, borderColor: colors.border }]}>
          <Ionicons name="flash" size={12} color={colors.primary as string} />
          <ThemedText style={[styles.creditsText, { color: colors.textSecondary as string }]}>
            {estimatedCredits}
          </ThemedText>
        </View>
      ) : null}
      <Ionicons name="chevron-down" size={16} color={colors.textSecondary as string} />
    </>
  );

  return (
    <TouchableOpacity activeOpacity={iosGlass ? 1 : 0.85} style={iosGlass ? undefined : containerStyle} onPress={onPress}>
      {iosGlass ? (
        <IosGlassSurface
          glassAnimate={false}
          isInteractive
          glassEffectStyle="clear"
          colorScheme={isDark ? 'dark' : 'light'}
          fallbackBackgroundColor={inputBg}
          style={containerStyle}
        >
          {content}
        </IosGlassSurface>
      ) : (
        content
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 14,
    borderCurve: 'continuous',
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 1,
  },
  textContainer: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  creditsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  creditsText: { fontSize: 12, fontWeight: '600' },
});
