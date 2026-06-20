import React, { createContext, useContext, useMemo } from 'react';
import {
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

type ScrollContextValue = {
  /** Current vertical scroll offset of the active feed. */
  scrollY: SharedValue<number>;
  /** 1 when the bottom bar should be hidden (scrolling down), 0 when shown. */
  tabHidden: SharedValue<number>;
};

const ScrollContext = createContext<ScrollContextValue | null>(null);

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const scrollY = useSharedValue(0);
  const tabHidden = useSharedValue(0);
  const value = useMemo(() => ({ scrollY, tabHidden }), [scrollY, tabHidden]);
  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
}

export function useScroll(): ScrollContextValue {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error('useScroll must be used within ScrollProvider');
  return ctx;
}

/**
 * Animated scroll handler for a feed: tracks offset and collapses the bottom
 * bar when scrolling down, restores it when scrolling up or near the top.
 */
export function useFeedScrollHandler() {
  const { scrollY, tabHidden } = useScroll();
  const lastY = useSharedValue(0);

  return useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = event.contentOffset.y;
      scrollY.value = y;
      const dy = y - lastY.value;
      if (y <= 6) {
        tabHidden.value = withTiming(0, { duration: 180 });
      } else if (dy > 8) {
        tabHidden.value = withTiming(1, { duration: 180 });
      } else if (dy < -8) {
        tabHidden.value = withTiming(0, { duration: 180 });
      }
      lastY.value = y;
    },
  });
}
