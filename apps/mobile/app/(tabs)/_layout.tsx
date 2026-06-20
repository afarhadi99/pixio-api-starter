import React from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { Redirect } from 'expo-router';

import { useAuth } from '@/lib/auth';
import { Loading } from '@/components/primitives';
import { AppScreenShell } from '@/components/options/app-screen-shell';
import {
  AppBottomMenuProvider,
  useAppBottomMenuState,
} from '@/components/options/app-bottom-menu-state';
import { OptionsDrawerContent } from '@/components/options/options-drawer-content';
import { useSettingsColors } from '@/components/settings/settings-colors';
import { useBumpIosGlassGeneration } from '@/components/ui/ios-glass-host-context';

export default function TabsLayout() {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Redirect href="/(auth)/login" />;

  return (
    <AppBottomMenuProvider>
      <AppDrawerLayout />
    </AppBottomMenuProvider>
  );
}

function AppDrawerLayout() {
  const colors = useSettingsColors();
  const { expand, requestReevaluation } = useAppBottomMenuState();
  const bumpGlassGeneration = useBumpIosGlassGeneration();
  const { width } = useWindowDimensions();
  const drawerWidth = Math.min(Math.max(width * 0.82, 300), 380);
  const swipeEdgeWidth = Math.min(Math.max(width * 0.18, 64), 104);

  return (
    <Drawer
      drawerContent={(props) => <OptionsDrawerContent {...(props as { navigation: { closeDrawer: () => void } })} />}
      screenListeners={{
        focus: () => {
          bumpGlassGeneration?.();
          requestAnimationFrame(() => bumpGlassGeneration?.());
          setTimeout(() => bumpGlassGeneration?.(), 420);
        },
        transitionStart: (event: { data: { closing: boolean } }) => {
          if (event.data.closing === false) {
            expand();
            bumpGlassGeneration?.();
            requestAnimationFrame(() => bumpGlassGeneration?.());
          }
        },
        transitionEnd: (event: { data: { closing: boolean } }) => {
          if (event.data.closing === true) {
            requestReevaluation();
            requestAnimationFrame(requestReevaluation);
            setTimeout(requestReevaluation, 260);
          }
        },
      }}
      screenLayout={({ children }: { children: React.ReactNode }) => (
        <AppScreenShell>{children}</AppScreenShell>
      )}
      screenOptions={{
        headerShown: false,
        drawerPosition: 'left',
        drawerType: 'front',
        drawerStyle: {
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.sheetBackground,
          width: drawerWidth,
        },
        overlayColor: colors.overlay,
        sceneStyle: { backgroundColor: colors.background },
        swipeEnabled: true,
        swipeEdgeWidth,
        swipeMinDistance: 20,
      }}
    >
      <Drawer.Screen name="index" options={{ title: 'Generate', drawerLabel: 'Generate' }} />
      <Drawer.Screen name="assets" options={{ title: 'Assets', drawerLabel: 'Assets' }} />
      <Drawer.Screen name="account" options={{ title: 'Account', drawerLabel: 'Account' }} />
    </Drawer>
  );
}
