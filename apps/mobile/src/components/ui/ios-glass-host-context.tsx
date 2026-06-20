import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

type IosGlassHostContextValue = {
  ready: boolean;
  generation: number;
  markReady: () => void;
  bumpGeneration: () => void;
};

const IosGlassHostContext = createContext<IosGlassHostContextValue | null>(null);

export function IosGlassHostProvider(props: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [generation, setGeneration] = useState(0);

  const markReady = useCallback(() => {
    setReady((current) => (current ? current : true));
  }, []);

  const bumpGeneration = useCallback(() => {
    setGeneration((current) => current + 1);
    setReady(true);
  }, []);

  const value = useMemo(
    () => ({ ready, generation, markReady, bumpGeneration }),
    [bumpGeneration, generation, markReady, ready],
  );

  return (
    <IosGlassHostContext.Provider value={value}>{props.children}</IosGlassHostContext.Provider>
  );
}

export function useIosGlassHostReady(): boolean {
  const context = useContext(IosGlassHostContext);
  return context?.ready ?? true;
}

export function useIosGlassGeneration(): number {
  const context = useContext(IosGlassHostContext);
  return context?.generation ?? 0;
}

export function useMarkIosGlassHostReady() {
  const context = useContext(IosGlassHostContext);
  return context?.markReady;
}

export function useBumpIosGlassGeneration() {
  const context = useContext(IosGlassHostContext);
  return context?.bumpGeneration;
}
