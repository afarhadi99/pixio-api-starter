import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { StripeProvider } from '@stripe/stripe-react-native';
import { AuthProvider } from '@/lib/auth';
import { ENV } from '@/lib/env';
import { colors } from '@/lib/theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <StripeProvider
        publishableKey={ENV.stripePublishableKey}
        merchantIdentifier="merchant.com.mytsi.pixiolite"
      >
        <AuthProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="media/[id]" options={{ presentation: 'modal' }} />
          </Stack>
        </AuthProvider>
      </StripeProvider>
    </GestureHandlerRootView>
  );
}
