import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { StripeProvider } from '@stripe/stripe-react-native';

import { AuthProvider } from '@/lib/auth';
import { ENV } from '@/lib/env';
import { IosGlassHostProvider } from '@/components/ui/ios-glass-host-context';
import { ErrorBoundary } from '@/components/error-boundary';

/**
 * Only mount StripeProvider when a publishable key is configured. Initializing
 * the native Stripe module with an empty key can crash on launch, and native
 * payments are optional (billing also works on the web).
 */
function MaybeStripeProvider({ children }: { children: React.ReactNode }) {
  if (!ENV.stripePublishableKey) return <>{children}</>;
  return (
    <StripeProvider
      publishableKey={ENV.stripePublishableKey}
      merchantIdentifier="merchant.com.mytsi.pixiolite"
    >
      {children as React.ReactElement}
    </StripeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <SafeAreaProvider>
          <IosGlassHostProvider>
            <MaybeStripeProvider>
              <AuthProvider>
                <StatusBar style="auto" />
                <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="(auth)" />
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="media/[id]" options={{ presentation: 'modal' }} />
                </Stack>
              </AuthProvider>
            </MaybeStripeProvider>
          </IosGlassHostProvider>
        </SafeAreaProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
