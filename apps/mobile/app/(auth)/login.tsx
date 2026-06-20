import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
  type ColorValue,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Reanimated, { FadeInDown } from 'react-native-reanimated';

import { ScreenShell } from '@/components/screen-shell';
import { SettingsFrostedView } from '@/components/settings/settings-frosted-view';
import { useSettingsColors } from '@/components/settings/settings-colors';
import { ThemedText } from '@/components/themed-text';
import { IosGlassSurface, useIosGlassEligible } from '@/components/ui/ios-glass-surface';
import { useAuth } from '@/lib/auth';
import { Spacing } from '@/constants/theme';

type AuthTab = 'signin' | 'signup';

function LoginPrimaryButton({
  label,
  onPress,
  disabled,
  loading,
  iosGlass,
  primaryContainer,
  primaryOnButton,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  iosGlass: boolean;
  primaryContainer: ColorValue;
  primaryOnButton: ColorValue;
}) {
  const content = loading ? (
    <ActivityIndicator color={primaryOnButton} />
  ) : (
    <ThemedText style={[styles.primaryButtonText, { color: primaryOnButton }]}>{label}</ThemedText>
  );

  if (iosGlass) {
    return (
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [!disabled && { transform: [{ scale: pressed ? 0.98 : 1 }] }, disabled && styles.buttonDisabled]}
      >
        <IosGlassSurface
          isInteractive
          tintColor={String(primaryContainer)}
          glassEffectStyle="regular"
          fallbackBackgroundColor={primaryContainer}
          style={[styles.primaryButton, styles.primaryButtonGlass]}
        >
          {content}
        </IosGlassSurface>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        { backgroundColor: primaryContainer },
        disabled && styles.buttonDisabled,
        !disabled && pressed && styles.buttonPressed,
      ]}
    >
      {content}
    </Pressable>
  );
}

export default function LoginScreen() {
  const colors = useSettingsColors();
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const iosGlass = Platform.OS === 'ios' && useIosGlassEligible();

  const [activeTab, setActiveTab] = useState<AuthTab>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const inputSurface = { backgroundColor: colors.chip, borderColor: colors.border };

  const submit = async () => {
    if (!email.trim() || !password) return;
    setLoading(true);
    const action = activeTab === 'signin' ? signIn : signUp;
    const { error } = await action(email.trim(), password);
    setLoading(false);
    if (error) {
      Alert.alert(activeTab === 'signin' ? 'Sign in failed' : 'Sign up failed', error);
    } else {
      router.replace('/(tabs)');
    }
  };

  const Tab = ({ tab, label }: { tab: AuthTab; label: string }) => {
    const active = activeTab === tab;
    return (
      <Pressable
        style={[styles.tab, active && { backgroundColor: colors.primaryContainer }]}
        onPress={() => setActiveTab(tab)}
      >
        <ThemedText
          style={[styles.tabText, { color: active ? colors.onPrimaryContainer : colors.textSecondary }]}
        >
          {label}
        </ThemedText>
      </Pressable>
    );
  };

  return (
    <ScreenShell>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
            <Reanimated.View entering={FadeInDown.duration(360)} style={styles.logoSection}>
              <Image source={require('../../assets/images/pixio-icon.png')} style={styles.brandIcon} />
              <ThemedText type="title" style={[styles.title, { color: colors.text }]}>
                Pixio Lite
              </ThemedText>
            </Reanimated.View>

            <View style={styles.authCardWrap}>
              <SettingsFrostedView
                intensity={100}
                style={[styles.authCard, { borderColor: colors.border, boxShadow: `0 24px 48px ${colors.shadow}` }]}
              >
                <View style={[styles.tabContainer, { borderColor: colors.border }]}>
                  <Tab tab="signin" label="Sign In" />
                  <Tab tab="signup" label="Create Account" />
                </View>

                <View style={styles.formContainer}>
                  <TextInput
                    style={[styles.input, inputSurface, { color: colors.text }]}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.textSecondary as string}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    testID="login-email"
                  />
                  <TextInput
                    style={[styles.input, inputSurface, { color: colors.text }]}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.textSecondary as string}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    testID="login-password"
                  />
                  <LoginPrimaryButton
                    label={activeTab === 'signin' ? 'Sign In' : 'Create Account'}
                    onPress={submit}
                    disabled={loading}
                    loading={loading}
                    iosGlass={iosGlass}
                    primaryContainer={colors.primaryContainer}
                    primaryOnButton={colors.onPrimaryContainer}
                  />
                </View>

                <ThemedText type="small" style={[styles.footerText, { color: colors.textSecondary }]}>
                  {activeTab === 'signin'
                    ? 'New to Pixio? Create an account to get started.'
                    : 'Creating an account grants you free starter credits.'}
                </ThemedText>
              </SettingsFrostedView>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  keyboardView: { flex: 1 },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
  },
  logoSection: { alignItems: 'center', gap: Spacing.two, marginBottom: Spacing.one },
  brandIcon: { width: 112, height: 112 },
  title: { textAlign: 'center' },
  authCardWrap: { maxWidth: 420, width: '100%', alignSelf: 'center' },
  authCard: {
    borderRadius: 30,
    borderCurve: 'continuous',
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 28,
    borderCurve: 'continuous',
    padding: 4,
    width: '100%',
    alignSelf: 'center',
    borderWidth: 1,
  },
  tab: { flex: 1, paddingVertical: 12, borderRadius: 24, borderCurve: 'continuous', alignItems: 'center', justifyContent: 'center' },
  tabText: { fontSize: 14, fontWeight: '600' },
  formContainer: { gap: Spacing.three, width: '100%', alignSelf: 'center' },
  input: { height: 50, borderRadius: 12, borderCurve: 'continuous', borderWidth: 1, paddingHorizontal: Spacing.three, fontSize: 16 },
  primaryButton: { height: 50, borderRadius: 12, borderCurve: 'continuous', alignItems: 'center', justifyContent: 'center' },
  primaryButtonGlass: { overflow: 'hidden', borderWidth: 1, borderColor: 'transparent', backgroundColor: 'transparent' },
  buttonPressed: { opacity: 0.92 },
  buttonDisabled: { opacity: 0.6 },
  primaryButtonText: { fontSize: 16, fontWeight: '600' },
  footerText: { textAlign: 'center' },
});
