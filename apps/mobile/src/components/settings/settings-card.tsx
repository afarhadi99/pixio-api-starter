import React from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { useSettingsColors } from './settings-colors';
import type { SettingsSymbolName } from './settings.constants';
import { SettingsFrostedView } from './settings-frosted-view';
import { SettingsSymbolBadge } from './settings-symbol-badge';
import { settingsCardStyles } from './settings-card.styles';

type SettingsCardProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  symbol?: SettingsSymbolName;
  tone?: 'primary' | 'secondary' | 'tertiary' | 'neutral';
  children?: React.ReactNode;
};

export function SettingsCard(props: SettingsCardProps) {
  const { eyebrow, title, description, children, symbol, tone = 'neutral' } = props;
  const colors = useSettingsColors();
  const toneStyles = getToneStyles(tone, colors);

  return (
    <SettingsFrostedView
      style={[
        settingsCardStyles.card,
        { borderColor: colors.border, boxShadow: `0 20px 42px ${colors.shadow}` },
      ]}
    >
      <View style={settingsCardStyles.header}>
        <View style={settingsCardStyles.topRow}>
          <View style={settingsCardStyles.titleRow}>
            {symbol ? (
              <SettingsSymbolBadge
                name={symbol}
                tintColor={toneStyles.symbolTint}
                backgroundColor={toneStyles.symbolBackground}
              />
            ) : null}
            <ThemedText type="smallBold" selectable style={{ color: colors.text }}>
              {title}
            </ThemedText>
          </View>

          {eyebrow ? (
            <View
              style={[
                settingsCardStyles.eyebrowPill,
                { backgroundColor: toneStyles.eyebrowBackground, borderColor: toneStyles.eyebrowBorder },
              ]}
            >
              <ThemedText
                type="smallBold"
                selectable
                style={[settingsCardStyles.eyebrow, { color: toneStyles.eyebrowText }]}
              >
                {eyebrow}
              </ThemedText>
            </View>
          ) : null}
        </View>

        {description ? (
          <ThemedText
            type="small"
            selectable
            style={[settingsCardStyles.description, { color: colors.textSecondary }]}
          >
            {description}
          </ThemedText>
        ) : null}
      </View>

      {children}
    </SettingsFrostedView>
  );
}

function getToneStyles(
  tone: NonNullable<SettingsCardProps['tone']>,
  colors: ReturnType<typeof useSettingsColors>,
) {
  if (tone === 'primary') {
    return {
      symbolBackground: colors.primaryContainer,
      symbolTint: colors.onPrimaryContainer,
      eyebrowBackground: colors.primaryContainer,
      eyebrowBorder: colors.primaryContainer,
      eyebrowText: colors.onPrimaryContainer,
    } as const;
  }
  if (tone === 'secondary') {
    return {
      symbolBackground: colors.secondaryContainer,
      symbolTint: colors.onSecondaryContainer,
      eyebrowBackground: colors.secondaryContainer,
      eyebrowBorder: colors.secondaryContainer,
      eyebrowText: colors.onSecondaryContainer,
    } as const;
  }
  if (tone === 'tertiary') {
    return {
      symbolBackground: colors.tertiaryContainer,
      symbolTint: colors.onTertiaryContainer,
      eyebrowBackground: colors.tertiaryContainer,
      eyebrowBorder: colors.tertiaryContainer,
      eyebrowText: colors.onTertiaryContainer,
    } as const;
  }
  return {
    symbolBackground: colors.chip,
    symbolTint: colors.text,
    eyebrowBackground: colors.chip,
    eyebrowBorder: colors.border,
    eyebrowText: colors.textSecondary,
  } as const;
}
