import React from 'react';
import type { RefObject } from 'react';
import type { View } from 'react-native';

type SettingsEffectsContextValue = {
  blurTargetRef: RefObject<View | null> | null;
};

const SettingsEffectsContext = React.createContext<SettingsEffectsContextValue>({
  blurTargetRef: null,
});

type SettingsEffectsProviderProps = {
  blurTargetRef: RefObject<View | null>;
  children: React.ReactNode;
};

export function SettingsEffectsProvider(props: SettingsEffectsProviderProps) {
  return (
    <SettingsEffectsContext.Provider value={{ blurTargetRef: props.blurTargetRef }}>
      {props.children}
    </SettingsEffectsContext.Provider>
  );
}

export function useSettingsEffects() {
  return React.useContext(SettingsEffectsContext);
}
