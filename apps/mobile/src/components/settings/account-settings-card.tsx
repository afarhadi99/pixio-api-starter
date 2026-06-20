import React from 'react';
import { View } from 'react-native';

import { SettingsActionButton } from './settings-action-button';
import { SettingsCard } from './settings-card';
import { SETTINGS_SYMBOLS } from './settings.constants';
import { accountSettingsCardStyles } from './account-settings-card.styles';

type AccountSettingsCardProps = {
  email?: string;
  onOpenAccountSettings: () => void;
  onSignOut: () => void;
  isSigningOut?: boolean;
};

export function AccountSettingsCard(props: AccountSettingsCardProps) {
  return (
    <SettingsCard
      eyebrow="Account"
      title="Account Settings"
      symbol={SETTINGS_SYMBOLS.account}
      tone="primary"
      description={props.email ?? 'Manage your account and session.'}
    >
      <View style={accountSettingsCardStyles.content}>
        <View style={accountSettingsCardStyles.buttonRow}>
          <View style={accountSettingsCardStyles.buttonItem}>
            <SettingsActionButton
              label="Open Account Settings"
              onPress={props.onOpenAccountSettings}
              variant="primary"
              symbol={SETTINGS_SYMBOLS.account}
            />
          </View>
          <View style={accountSettingsCardStyles.buttonItem}>
            <SettingsActionButton
              label={props.isSigningOut ? 'Logging Out...' : 'Log Out'}
              onPress={props.onSignOut}
              variant="destructive"
              disabled={props.isSigningOut}
              symbol={SETTINGS_SYMBOLS.logout}
            />
          </View>
        </View>
      </View>
    </SettingsCard>
  );
}
