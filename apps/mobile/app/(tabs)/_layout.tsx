import React from 'react';
import { Tabs } from 'expo-router';
import { Redirect } from 'expo-router';

import { useAuth } from '@/lib/auth';
import { Loading } from '@/components/primitives';
import { AppBottomMenuProvider } from '@/components/options/app-bottom-menu-state';
import { CollapsingTabBar } from '@/components/collapsing-tab-bar';
import { useSettingsColors } from '@/components/settings/settings-colors';

export default function TabsLayout() {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Redirect href="/(auth)/login" />;

  return (
    <AppBottomMenuProvider>
      <AppTabsLayout />
    </AppBottomMenuProvider>
  );
}

function AppTabsLayout() {
  const colors = useSettingsColors();

  return (
    <Tabs
      tabBar={(props) => (
        <CollapsingTabBar {...(props as unknown as React.ComponentProps<typeof CollapsingTabBar>)} />
      )}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Generate' }} />
      <Tabs.Screen name="assets" options={{ title: 'Assets' }} />
      <Tabs.Screen name="account" options={{ title: 'Account' }} />
    </Tabs>
  );
}
