import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { type SharedValue, runOnJS, useAnimatedReaction } from 'react-native-reanimated';

type AppBottomMenuState = {
  canScrollToTop: boolean;
  compact: boolean;
  reevaluateToken: number;
  setCompact: (compact: boolean) => void;
  expand: () => void;
  requestReevaluation: () => void;
  registerScrollToTop: (handler: () => void) => () => void;
  scrollToTop: () => void;
};

const AppBottomMenuContext = React.createContext<AppBottomMenuState>({
  canScrollToTop: false,
  compact: false,
  reevaluateToken: 0,
  setCompact: () => undefined,
  expand: () => undefined,
  requestReevaluation: () => undefined,
  registerScrollToTop: () => () => undefined,
  scrollToTop: () => undefined,
});

const COMPACT_SCROLL_THRESHOLD = 42;

export function AppBottomMenuProvider(props: { children: React.ReactNode }) {
  const [compact, setCompactState] = useState(false);
  const [reevaluateToken, setReevaluateToken] = useState(0);
  const [canScrollToTop, setCanScrollToTop] = useState(false);
  const scrollToTopHandlerRef = useRef<(() => void) | null>(null);
  const scrollToTopRegistrationRef = useRef<symbol | null>(null);

  const setCompact = useCallback((nextCompact: boolean) => {
    setCompactState((current) => (current === nextCompact ? current : nextCompact));
  }, []);

  const expand = useCallback(() => {
    setCompact(false);
  }, [setCompact]);

  const requestReevaluation = useCallback(() => {
    setReevaluateToken((current) => current + 1);
  }, []);

  const registerScrollToTop = useCallback((handler: () => void) => {
    const registration = Symbol('app-bottom-menu-scroll-top');
    scrollToTopRegistrationRef.current = registration;
    scrollToTopHandlerRef.current = handler;
    setCanScrollToTop(true);

    return () => {
      if (scrollToTopRegistrationRef.current !== registration) return;
      scrollToTopRegistrationRef.current = null;
      scrollToTopHandlerRef.current = null;
      setCanScrollToTop(false);
    };
  }, []);

  const scrollToTop = useCallback(() => {
    scrollToTopHandlerRef.current?.();
  }, []);

  const value = useMemo(
    () => ({
      canScrollToTop,
      compact,
      reevaluateToken,
      setCompact,
      expand,
      requestReevaluation,
      registerScrollToTop,
      scrollToTop,
    }),
    [canScrollToTop, compact, expand, reevaluateToken, registerScrollToTop, requestReevaluation, scrollToTop, setCompact],
  );

  return <AppBottomMenuContext.Provider value={value}>{props.children}</AppBottomMenuContext.Provider>;
}

export function useAppBottomMenuState() {
  return React.useContext(AppBottomMenuContext);
}

export function useCompactBottomMenuOnScroll(scrollY: SharedValue<number>, active: boolean) {
  const { reevaluateToken, setCompact } = useAppBottomMenuState();

  useAnimatedReaction(
    () => {
      const y = scrollY.value;
      return { compact: active && y > COMPACT_SCROLL_THRESHOLD, reevaluateToken, y };
    },
    (next, previous) => {
      if (!previous || next.compact !== previous.compact) {
        runOnJS(setCompact)(next.compact);
        return;
      }
      const isContinuingDownPastThreshold = next.compact && next.y > previous.y + 2;
      if (isContinuingDownPastThreshold) {
        runOnJS(setCompact)(true);
      }
    },
    [active, reevaluateToken, setCompact],
  );
}

export function useAppBottomMenuScrollToTop(handler: () => void, active: boolean) {
  const { registerScrollToTop } = useAppBottomMenuState();
  useEffect(() => {
    if (!active) return;
    return registerScrollToTop(handler);
  }, [active, handler, registerScrollToTop]);
}

export function useAppBottomMenuNativeScrollHandler(active: boolean) {
  const { reevaluateToken, setCompact } = useAppBottomMenuState();
  const latestOffsetYRef = useRef(0);

  useEffect(() => {
    setCompact(active && latestOffsetYRef.current > COMPACT_SCROLL_THRESHOLD);
  }, [active, reevaluateToken, setCompact]);

  return useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      latestOffsetYRef.current = event.nativeEvent.contentOffset.y;
      if (!active) return;
      setCompact(latestOffsetYRef.current > COMPACT_SCROLL_THRESHOLD);
    },
    [active, setCompact],
  );
}

export function useFixedBottomMenuCompact(active: boolean, compact: boolean) {
  const { reevaluateToken, setCompact } = useAppBottomMenuState();
  useLayoutEffect(() => {
    if (active) setCompact(compact);
  }, [active, compact, reevaluateToken, setCompact]);
}
