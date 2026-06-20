import type React from 'react';
import { SymbolView } from 'expo-symbols';

export type SettingsSymbolName = React.ComponentProps<typeof SymbolView>['name'];

export const SETTINGS_SYMBOLS = {
  billing: { ios: 'creditcard.fill', android: 'credit_card', web: 'credit_card' },
  ledger: {
    ios: 'list.bullet.rectangle.portrait.fill',
    android: 'receipt_long',
    web: 'receipt_long',
  },
  subscription: { ios: 'sparkles', android: 'workspace_premium', web: 'workspace_premium' },
  account: { ios: 'person.crop.circle.fill', android: 'account_circle', web: 'account_circle' },
  logout: {
    ios: 'rectangle.portrait.and.arrow.right',
    android: 'logout',
    web: 'logout',
  },
  buyMore: { ios: 'cart.fill', android: 'shopping_bag', web: 'shopping_bag' },
  monthly: { ios: 'arrow.clockwise.circle.fill', android: 'cycle', web: 'cycle' },
  cap: { ios: 'gauge.with.dots.needle.67percent', android: 'speed', web: 'speed' },
  permanent: { ios: 'shippingbox.fill', android: 'inventory_2', web: 'inventory_2' },
  generate: { ios: 'wand.and.stars', android: 'auto_awesome', web: 'auto_awesome' },
  assets: { ios: 'photo.on.rectangle.angled', android: 'photo_library', web: 'photo_library' },
} as const satisfies Record<string, SettingsSymbolName>;
