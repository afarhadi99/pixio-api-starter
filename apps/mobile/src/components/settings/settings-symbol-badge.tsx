import medium from 'expo-symbols/androidWeights/medium';
import { SymbolView } from 'expo-symbols';
import React from 'react';
import { Platform, View, type ColorValue } from 'react-native';

import { settingsSymbolBadgeStyles } from './settings-symbol-badge.styles';
import type { SettingsSymbolName } from './settings.constants';

type SettingsSymbolBadgeProps = {
  name: SettingsSymbolName;
  size?: number;
  tintColor: ColorValue;
  backgroundColor?: ColorValue;
  animated?: boolean;
};

export function SettingsSymbolBadge(props: SettingsSymbolBadgeProps) {
  const { name, size = 18, tintColor, backgroundColor, animated = false } = props;
  const shellSize = size + 18;

  return (
    <View
      style={[
        settingsSymbolBadgeStyles.shell,
        { width: shellSize, height: shellSize, borderRadius: shellSize / 2, backgroundColor },
      ]}
    >
      <SymbolView
        name={name}
        size={size}
        tintColor={tintColor}
        type={Platform.OS === 'ios' ? 'hierarchical' : undefined}
        weight={Platform.OS === 'android' ? { android: medium, ios: 'medium' } : 'medium'}
        animationSpec={
          animated && Platform.OS === 'ios'
            ? { effect: { type: 'pulse', wholeSymbol: true }, repeating: true, speed: 1.9 }
            : undefined
        }
      />
    </View>
  );
}
