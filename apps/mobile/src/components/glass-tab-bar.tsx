import { SymbolView } from 'expo-symbols';
import * as Haptics from 'expo-haptics';
import React, { useCallback } from 'react';
import { Platform, Pressable, StyleSheet, View, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useSettingsColors } from '@/components/settings/settings-colors';
import { SETTINGS_SYMBOLS } from '@/components/settings/settings.constants';
import { IosGlassSurface } from '@/components/ui/ios-glass-surface';
import { MaxContentWidth, Spacing } from '@/constants/theme';

const TABS: Record<string, { label: string; symbol: keyof typeof SETTINGS_SYMBOLS }> = {
  index: { label: 'Generate', symbol: 'generate' },
  assets: { label: 'Assets', symbol: 'assets' },
  account: { label: 'Account', symbol: 'account' },
};

/**
 * Structural subset of @react-navigation BottomTabBarProps we actually use,
 * typed locally so we don't depend on the (non-hoisted) types package.
 */
type TabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: {
    emit: (event: {
      type: 'tabPress';
      target: string;
      canPreventDefault: boolean;
    }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
};

/** Glassmorphic bottom tab bar — mirrors the Pixio app's glass menu, as 3 tabs. */
export function GlassTabBar({ state, navigation }: TabBarProps) {
  const colors = useSettingsColors();
  const scheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const activeBg = scheme === 'dark' ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.6)';

  const onPress = useCallback(
    (routeName: string, routeKey: string, focused: boolean) => {
      if (Platform.OS === 'ios') void Haptics.selectionAsync().catch(() => undefined);
      const event = navigation.emit({ type: 'tabPress', target: routeKey, canPreventDefault: true });
      if (!focused && !event.defaultPrevented) {
        navigation.navigate(routeName);
      }
    },
    [navigation],
  );

  return (
    <View pointerEvents="box-none" style={[styles.root, { paddingBottom: insets.bottom + Spacing.two }]}>
      <IosGlassSurface
        glassAnimate={false}
        glassEffectStyle="regular"
        colorScheme={scheme === 'dark' ? 'dark' : 'light'}
        fallbackBackgroundColor={colors.sheetBackground}
        style={[styles.bar, { borderColor: colors.border }]}
      >
        {state.routes.map((route, index) => {
          const meta = TABS[route.name];
          if (!meta) return null;
          const focused = state.index === index;
          const tint = focused ? colors.text : colors.textSecondary;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={meta.label}
              testID={`tab-${route.name}`}
              onPress={() => onPress(route.name, route.key, focused)}
              style={({ pressed }) => [
                styles.tab,
                focused && { backgroundColor: activeBg },
                pressed && { opacity: 0.7 },
              ]}
            >
              <SymbolView
                name={SETTINGS_SYMBOLS[meta.symbol]}
                size={22}
                tintColor={tint}
                type={Platform.OS === 'ios' ? 'hierarchical' : undefined}
                weight="medium"
              />
              <ThemedText type="smallBold" numberOfLines={1} style={{ color: tint }}>
                {meta.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </IosGlassSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    zIndex: 20,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.one,
    width: '100%',
    maxWidth: MaxContentWidth,
    height: 64,
    borderRadius: 999,
    borderCurve: 'continuous',
    borderWidth: 1,
    overflow: 'hidden',
    padding: Spacing.one,
  },
  tab: {
    flex: 1,
    height: '100%',
    borderRadius: 999,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
});
