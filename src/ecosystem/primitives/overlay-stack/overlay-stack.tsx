/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useRef } from 'react';

const BASE_Z_INDEX = 1000;

type OverlayStackContextValue = {
  getNextZIndex: () => number;
};

const OverlayStackContext = createContext<OverlayStackContextValue | null>(null);

export function OverlayStack({ children }: { children: React.ReactNode }): React.ReactElement {
  const counterRef = useRef(0);
  const value = useMemo(
    () => ({ getNextZIndex: () => BASE_Z_INDEX + ++counterRef.current }),
    [],
  );

  return (
    <OverlayStackContext.Provider value={value}>
      {children}
    </OverlayStackContext.Provider>
  );
}

export function useOverlayStack(): OverlayStackContextValue {
  const ctx = useContext(OverlayStackContext);
  if (!ctx) {
    throw new Error('useOverlayStack must be used within OverlayStack');
  }
  return ctx;
}
