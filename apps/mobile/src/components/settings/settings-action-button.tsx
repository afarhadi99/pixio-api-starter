import medium from 'expo-symbols/androidWeights/medium';
import { SymbolView } from 'expo-symbols';
import React from 'react';
import { Platform, Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IosGlassSurface, useIosGlassEligible } from '@/components/ui/ios-glass-surface';

import { useSettingsColors } from './settings-colors';
import type { SettingsSymbolName } from './settings.constants';
import { settingsActionButtonStyles } from './settings-action-button.styles';

type SettingsActionButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'destructive';
  disabled?: boolean;
  symbol?: SettingsSymbolName;
};

export function SettingsActionButton(props: SettingsActionButtonProps) {
  const { label, onPress, variant = 'secondary', disabled = false, symbol } = props;
  const colors = useSettingsColors();
  const glassEligible = useIosGlassEligible();
  const iosGlass = Platform.OS === 'ios' && glassEligible;
  const isPrimary = variant === 'primary';
  const isDestructive = variant === 'destructive';
  const backgroundColor = isPrimary
    ? colors.primaryContainer
    : isDestructive
      ? colors.negative
      : colors.chip;
  const textColor = isPrimary
    ? colors.onPrimaryContainer
    : isDestructive
      ? '#ffffff'
      : colors.text;
  const borderColor = isPrimary
    ? colors.primaryContainer
    : isDestructive
      ? colors.negative
      : colors.border;

  const shadowStyle =
    isPrimary || isDestructive ? `0 10px 22px ${colors.shadow}` : `0 8px 18px ${colors.shadow}`;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        !iosGlass && { opacity: pressed || disabled ? 0.78 : 1 },
        iosGlass && !disabled && { transform: [{ scale: pressed ? 0.97 : 1 }] },
      ]}
    >
      <IosGlassSurface
        isInteractive={iosGlass}
        glassAnimate={false}
        tintColor={
          iosGlass && isPrimary
            ? String(colors.primaryContainer)
            : iosGlass && isDestructive
              ? String(colors.negative)
              : undefined
        }
        glassEffectStyle={iosGlass && (isPrimary || isDestructive) ? 'regular' : 'clear'}
        fallbackBackgroundColor={backgroundColor}
        style={[settingsActionButtonStyles.button, { borderColor, boxShadow: shadowStyle }]}
      >
        <View
          style={[settingsActionButtonStyles.content, iosGlass && disabled && { opacity: 0.62 }]}
        >
          {symbol ? (
            <SymbolView
              name={symbol}
              size={18}
              tintColor={textColor}
              type={Platform.OS === 'ios' ? 'hierarchical' : undefined}
              weight={Platform.OS === 'android' ? { android: medium, ios: 'medium' } : 'medium'}
            />
          ) : null}
          <ThemedText type="smallBold" style={{ color: textColor }}>
            {label}
          </ThemedText>
        </View>
      </IosGlassSurface>
    </Pressable>
  );
}
