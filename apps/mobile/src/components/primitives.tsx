import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { Spacing } from '@/constants/theme';
import { useSettingsColors } from '@/components/settings/settings-colors';

export function Button({
  title,
  onPress,
  loading,
  disabled,
  variant = 'primary',
  testID,
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'ghost' | 'danger';
  testID?: string;
}) {
  const colors = useSettingsColors();
  const isDisabled = disabled || loading;

  const bg =
    variant === 'primary' ? colors.primary : variant === 'danger' ? colors.negative : 'transparent';
  const fg = variant === 'ghost' ? colors.text : '#ffffff';
  const borderColor = variant === 'ghost' ? colors.border : 'transparent';

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled }}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg, borderColor },
        (pressed || isDisabled) && { opacity: 0.6 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <Text style={[styles.buttonText, { color: fg }]}>{title}</Text>
      )}
    </Pressable>
  );
}

export function Field(props: TextInputProps) {
  const colors = useSettingsColors();
  return (
    <TextInput
      placeholderTextColor={colors.textSecondary}
      style={[
        styles.input,
        { backgroundColor: colors.chip, borderColor: colors.border, color: colors.text },
      ]}
      {...props}
    />
  );
}

export function Loading() {
  const colors = useSettingsColors();
  return (
    <View style={[styles.center, { backgroundColor: colors.background }]}>
      <ActivityIndicator color={colors.primary} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 999,
    borderCurve: 'continuous',
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { fontWeight: '700', fontSize: 16 },
  input: {
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    padding: Spacing.three,
    fontSize: 16,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
