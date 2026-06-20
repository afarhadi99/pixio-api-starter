// settings-colors imports `Color` from expo-router for Android dynamic colors;
// stub it so jest doesn't load the full (untranspiled) router module.
jest.mock('expo-router', () => ({
  Color: { android: { dynamic: new Proxy({}, { get: () => '#000000' }) } },
}));

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Button } from './primitives';

describe('Button', () => {
  it('renders its title', () => {
    render(<Button title="Generate" onPress={() => {}} />);
    expect(screen.getByText('Generate')).toBeTruthy();
  });

  it('fires onPress when tapped', () => {
    const onPress = jest.fn();
    render(<Button title="Tap" onPress={onPress} testID="btn" />);
    fireEvent.press(screen.getByTestId('btn'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not fire onPress while loading', () => {
    const onPress = jest.fn();
    render(<Button title="Wait" onPress={onPress} loading testID="btn" />);
    fireEvent.press(screen.getByTestId('btn'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not fire onPress when disabled', () => {
    const onPress = jest.fn();
    render(<Button title="No" onPress={onPress} disabled testID="btn" />);
    fireEvent.press(screen.getByTestId('btn'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
