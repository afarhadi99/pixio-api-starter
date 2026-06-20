import type { Href } from 'expo-router';
import { router, usePathname } from 'expo-router';
import {
  Coins,
  ChevronRight,
  Image as ImageIcon,
  Settings,
  Sparkles,
  type LucideIcon,
} from 'lucide-react-native';
import React, { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, View, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSettingsColors } from '@/components/settings/settings-colors';
import { ThemedText } from '@/components/themed-text';
import { IosGlassSurface } from '@/components/ui/ios-glass-surface';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useCredits } from '@/lib/hooks';

type OptionsDrawerItem = {
  href: Href;
  label: string;
  caption: string;
  icon: LucideIcon;
};

const OPTIONS_DRAWER_ITEMS = [
  {
    href: '/',
    label: 'Generate',
    caption: 'Create images and video',
    icon: Sparkles,
  },
  {
    href: '/assets',
    label: 'Assets',
    caption: 'Your generated files',
    icon: ImageIcon,
  },
  {
    href: '/account',
    label: 'Account',
    caption: 'Credits, plan, and billing',
    icon: Settings,
  },
] satisfies OptionsDrawerItem[];

type OptionsDrawerContentProps = {
  navigation: {
    closeDrawer: () => void;
  };
};

export function OptionsDrawerContent(props: OptionsDrawerContentProps) {
  const colors = useSettingsColors();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { total } = useCredits();
  const activeButtonBackground = String(colors.primaryContainer);
  const inactiveButtonBackground =
    colorScheme === 'dark' ? 'rgba(44, 44, 46, 0.88)' : 'rgba(255, 255, 255, 0.82)';

  const closeAndNavigate = useCallback(
    (href: Href) => {
      router.push(href);
      props.navigation.closeDrawer();
    },
    [props.navigation],
  );

  return (
    <IosGlassSurface
      glassAnimate={false}
      glassEffectStyle="regular"
      colorScheme={colorScheme === 'dark' ? 'dark' : 'light'}
      fallbackBackgroundColor={
        colorScheme === 'dark' ? 'rgba(28, 28, 30, 0.94)' : 'rgba(242, 242, 247, 0.94)'
      }
      style={[styles.drawerSurface, { borderRightColor: colors.border }]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, Spacing.three) + Spacing.two,
            paddingBottom: insets.bottom + Spacing.four,
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.drawerRail}>
          <View style={[styles.creditsInline, { borderBottomColor: colors.border }]}>
            <View style={styles.creditsTextBlock}>
              <View style={styles.creditsLabelRow}>
                <Coins size={15} color={String(colors.primary)} />
                <ThemedText type="small" style={{ color: colors.textSecondary }}>
                  Available credits
                </ThemedText>
              </View>
              <ThemedText selectable type="subtitle" style={[styles.creditsValue, { color: colors.text }]}>
                {total.toLocaleString()}
              </ThemedText>
            </View>
          </View>

          <View style={styles.menuList}>
            {OPTIONS_DRAWER_ITEMS.map((item) => (
              <DrawerMenuItem
                key={item.label}
                item={item}
                focused={pathname === item.href}
                activeBackgroundColor={activeButtonBackground}
                inactiveBackgroundColor={inactiveButtonBackground}
                onPress={() => closeAndNavigate(item.href)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </IosGlassSurface>
  );
}

function DrawerMenuItem(props: {
  item: OptionsDrawerItem;
  focused: boolean;
  activeBackgroundColor: string;
  inactiveBackgroundColor: string;
  onPress: () => void;
}) {
  const colors = useSettingsColors();
  const colorScheme = useColorScheme();
  const Icon = props.item.icon;
  const isDark = colorScheme === 'dark';
  const labelColor = props.focused ? colors.onPrimaryContainer : colors.text;
  const captionColor = props.focused
    ? 'rgba(255, 255, 255, 0.84)'
    : isDark
      ? 'rgba(235, 235, 245, 0.82)'
      : 'rgba(28, 28, 30, 0.72)';
  const chevronColor = props.focused
    ? 'rgba(255, 255, 255, 0.92)'
    : isDark
      ? 'rgba(235, 235, 245, 0.72)'
      : 'rgba(28, 28, 30, 0.56)';
  const iconBackgroundColor = props.focused
    ? 'rgba(255, 255, 255, 0.22)'
    : isDark
      ? 'rgba(120, 120, 128, 0.36)'
      : 'rgba(120, 120, 128, 0.14)';
  const iconColor = props.focused ? colors.onPrimaryContainer : colors.text;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: props.focused }}
      onPress={props.onPress}
      style={({ pressed }) => [styles.menuItemPressable, { opacity: pressed ? 0.72 : 1 }]}
    >
      <IosGlassSurface
        isInteractive
        glassEffectStyle="regular"
        tintColor={props.focused ? String(colors.primaryContainer) : undefined}
        colorScheme={isDark ? 'dark' : 'light'}
        fallbackBackgroundColor={
          props.focused ? props.activeBackgroundColor : props.inactiveBackgroundColor
        }
        style={[
          styles.menuItem,
          { borderColor: props.focused ? 'rgba(255, 255, 255, 0.18)' : colors.border },
        ]}
      >
        <View
          style={[
            styles.activeRail,
            { backgroundColor: props.focused ? 'rgba(255, 255, 255, 0.92)' : 'transparent' },
          ]}
        />
        <View style={[styles.menuIcon, { backgroundColor: iconBackgroundColor }]}>
          <Icon size={19} color={String(iconColor)} />
        </View>
        <View style={styles.menuTextBlock}>
          <ThemedText type="smallBold" numberOfLines={1} style={{ color: labelColor }}>
            {props.item.label}
          </ThemedText>
          <ThemedText type="small" numberOfLines={1} style={[styles.menuCaption, { color: captionColor }]}>
            {props.item.caption}
          </ThemedText>
        </View>
        <ChevronRight size={17} color={String(chevronColor)} />
      </IosGlassSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  drawerSurface: {
    borderCurve: 'continuous',
    borderRightWidth: StyleSheet.hairlineWidth,
    flex: 1,
  },
  scrollView: { backgroundColor: 'transparent' },
  scrollContent: { flexGrow: 1, paddingHorizontal: Spacing.four },
  drawerRail: {
    alignSelf: 'center',
    flexGrow: 1,
    gap: Spacing.four,
    maxWidth: MaxContentWidth,
    width: '100%',
  },
  creditsInline: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: Spacing.four,
    paddingHorizontal: Spacing.one,
  },
  creditsTextBlock: { gap: Spacing.two },
  creditsLabelRow: { alignItems: 'center', flexDirection: 'row', gap: Spacing.two },
  creditsValue: { fontSize: 34, fontVariant: ['tabular-nums'], lineHeight: 40 },
  menuList: { gap: Spacing.two },
  menuItemPressable: { borderCurve: 'continuous', borderRadius: 18 },
  menuItem: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: Spacing.three,
    minHeight: 62,
    overflow: 'hidden',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  activeRail: { borderRadius: 2, bottom: 12, left: 0, position: 'absolute', top: 12, width: 3 },
  menuIcon: {
    alignItems: 'center',
    borderRadius: 17,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  menuTextBlock: { flex: 1, gap: Spacing.half, minWidth: 0 },
  menuCaption: { fontSize: 13, fontWeight: '500', lineHeight: 17 },
});
