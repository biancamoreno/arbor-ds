import { useWindowDimensions } from 'react-native';
import { useTheme } from '../../adapters';
import type { Theme } from '../../tokens';

const breakpointOrder = ['base', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

function parseBreakpointValue(value: string): number {
  const num = parseInt(value.replace(/[^0-9]/g, ''), 10);
  return isNaN(num) ? 0 : num;
}

export function useBreakpoint(): string {
  const { width } = useWindowDimensions();
  const theme = useTheme() as Theme;
  const breakpoints = (theme?.breakpoints ?? []) as Array<string> & Record<string, string>;

  let current = 'base';
  for (const key of breakpointOrder) {
    if (key === 'base') continue;
    const bpValue = breakpoints[key];
    if (bpValue && width >= parseBreakpointValue(bpValue)) {
      current = key;
    }
  }
  return current;
}
