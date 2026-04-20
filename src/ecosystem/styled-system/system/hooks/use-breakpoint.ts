import { useState, useEffect } from 'react';
import { useTheme } from '../../adapters';
import type { Theme } from '../../tokens';
import type { BaseBreakpointConfig } from '../../../../foundations/breakpoints';

const breakpointOrder = ['sm', 'md', 'lg', 'xl', '2xl'] as const;
type BreakpointKey = 'base' | (typeof breakpointOrder)[number];

function getCurrentBreakpoint(breakpoints: BaseBreakpointConfig): BreakpointKey {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'base';
  let current: BreakpointKey = 'base';
  for (const key of breakpointOrder) {
    const value = breakpoints[key];
    if (value && window.matchMedia(`(min-width: ${value})`).matches) {
      current = key;
    }
  }
  return current;
}

export function useBreakpoint(): string {
  const theme = useTheme() as Theme;
  const breakpoints = theme.breakpoints as BaseBreakpointConfig;

  const [bp, setBp] = useState<BreakpointKey>(() => getCurrentBreakpoint(breakpoints));

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

    const update = () => setBp(getCurrentBreakpoint(breakpoints));
    const queries: Array<{ mql: MediaQueryList; listener: () => void }> = [];

    for (const key of breakpointOrder) {
      const value = breakpoints[key];
      if (!value) continue;
      const mql = window.matchMedia(`(min-width: ${value})`);
      mql.addEventListener('change', update);
      queries.push({ mql, listener: update });
    }

    return () => {
      queries.forEach(({ mql, listener }) => mql.removeEventListener('change', listener));
    };
  }, [breakpoints]);

  return bp;
}
