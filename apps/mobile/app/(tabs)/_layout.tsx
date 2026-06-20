import { Redirect, Tabs } from 'expo-router';

import { useAuth } from '@/lib/auth';
import { Loading } from '@/components/primitives';
import { GlassTabBar } from '@/components/glass-tab-bar';
import { ScrollProvider } from '@/lib/scroll-context';

export default function TabsLayout() {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Redirect href="/(auth)/login" />;

  return (
    <ScrollProvider>
      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <GlassTabBar {...(props as Parameters<typeof GlassTabBar>[0])} />}
      >
        <Tabs.Screen name="index" options={{ title: 'Generate' }} />
        <Tabs.Screen name="assets" options={{ title: 'Assets' }} />
        <Tabs.Screen name="account" options={{ title: 'Account' }} />
      </Tabs>
    </ScrollProvider>
  );
}
