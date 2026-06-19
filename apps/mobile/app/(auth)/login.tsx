import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Button, Field, Heading, Muted, Screen } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { colors, spacing } from '@/lib/theme';

export default function Login() {
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
    <Screen style={{ justifyContent: 'center' }}>
      <Heading>Welcome back</Heading>
      <Muted>Sign in to generate with Pixio.</Muted>
      <View style={{ height: spacing.lg }} />
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
      <View style={{ height: spacing.md }} />
      <Text style={{ color: colors.textMuted, textAlign: 'center' }}>
        No account?{' '}
        <Link href="/(auth)/signup" style={{ color: colors.primary }}>
          Create one
        </Link>
      </Text>
    </Screen>
  );
}
