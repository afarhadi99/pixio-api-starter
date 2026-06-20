import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { StripeProvider } from '@stripe/stripe-react-native';

import { AuthProvider } from '@/lib/auth';
import { ENV } from '@/lib/env';
import { IosGlassHostProvider } from '@/components/ui/ios-glass-host-context';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <IosGlassHostProvider>
          <StripeProvider
            publishableKey={ENV.stripePublishableKey}
            merchantIdentifier="merchant.com.mytsi.pixiolite"
          >
            <AuthProvider>
              <StatusBar style="auto" />
              <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="media/[id]" options={{ presentation: 'modal' }} />
              </Stack>
            </AuthProvider>
          </StripeProvider>
        </IosGlassHostProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
