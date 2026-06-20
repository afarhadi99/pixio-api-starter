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

export default function Signup() {
  const colors = useSettingsColors();
  const insets = useSafeAreaInsets();
  const { signUp } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    const { error } = await signUp(email.trim(), password);
    setLoading(false);
    if (error) Alert.alert('Sign up failed', error);
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
            Create account
          </ThemedText>
          <ThemedText type="small" style={{ color: colors.textSecondary, marginBottom: Spacing.three }}>
            Start with free credits.
          </ThemedText>
          <View style={{ gap: Spacing.three }}>
            <Field
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <Field placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
            <Button title="Create account" onPress={onSubmit} loading={loading} />
          </View>
          <ThemedText type="small" style={{ color: colors.textSecondary, textAlign: 'center', marginTop: Spacing.three }}>
            Already have an account?{' '}
            <Link href="/(auth)/login" style={{ color: colors.primary }}>
              Sign in
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
