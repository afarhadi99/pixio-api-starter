import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Button, Field, Heading, Muted, Screen } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { colors, spacing } from '@/lib/theme';

export default function Signup() {
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
    <Screen style={{ justifyContent: 'center' }}>
      <Heading>Create account</Heading>
      <Muted>Start with free credits.</Muted>
      <View style={{ height: spacing.lg }} />
      <Field
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <Field placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Create account" onPress={onSubmit} loading={loading} />
      <View style={{ height: spacing.md }} />
      <Text style={{ color: colors.textMuted, textAlign: 'center' }}>
        Already have an account?{' '}
        <Link href="/(auth)/login" style={{ color: colors.primary }}>
          Sign in
        </Link>
      </Text>
    </Screen>
  );
}
