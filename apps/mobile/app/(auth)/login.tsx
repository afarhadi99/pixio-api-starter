import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenShell } from '@/components/screen-shell';
import { SettingsFrostedView } from '@/components/settings/settings-frosted-view';
import { useSettingsColors } from '@/components/settings/settings-colors';
import { ThemedText } from '@/components/themed-text';
import { Button, Field } from '@/components/primitives';
import { useAuth } from '@/lib/auth';
import { Spacing } from '@/constants/theme';

export default function Login() {
  const colors = useSettingsColors();
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);
    if (error) Alert.alert('Sign in failed', error);
    else router.replace('/(tabs)');
  };

  return (
    <ScreenShell>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.six }]}
        keyboardShouldPersistTaps="handled"
      >
        <SettingsFrostedView style={[styles.card, { borderColor: colors.border, boxShadow: `0 24px 48px ${colors.shadow}` }]}>
          <ThemedText type="subtitle" style={{ color: colors.text }}>
            Welcome back
          </ThemedText>
          <ThemedText type="small" style={{ color: colors.textSecondary, marginBottom: Spacing.three }}>
            Sign in to generate with Pixio.
          </ThemedText>
          <View style={{ gap: Spacing.three }}>
            <Field
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              testID="login-email"
            />
            <Field
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              testID="login-password"
            />
            <Button title="Sign in" onPress={onSubmit} loading={loading} testID="login-submit" />
          </View>
          <ThemedText type="small" style={{ color: colors.textSecondary, textAlign: 'center', marginTop: Spacing.three }}>
            No account?{' '}
            <Link href="/(auth)/signup" style={{ color: colors.primary }}>
              Create one
            </Link>
          </ThemedText>
        </SettingsFrostedView>
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, justifyContent: 'center', padding: Spacing.three },
  card: { borderRadius: 28, borderCurve: 'continuous', borderWidth: 1, padding: Spacing.four },
});
