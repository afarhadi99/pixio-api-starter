jest.mock('expo-glass-effect', () => ({
  GlassView: ({ children }: { children: React.ReactNode }) => children,
  isGlassEffectAPIAvailable: () => false,
}));

import React from 'react';
import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { Surface } from './surface';

describe('Surface', () => {
  it('renders children on fallback surfaces', () => {
    render(
      <Surface testID="surface">
        <Text>Hello</Text>
      </Surface>,
    );
    expect(screen.getByText('Hello')).toBeTruthy();
  });
});
