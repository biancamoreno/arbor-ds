export interface BaseBreakpointConfig {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

type BreakpointsArray<T extends BaseBreakpointConfig> = Array<string> & T;

export const createBreakpoints = <T extends BaseBreakpointConfig>(config: T): BreakpointsArray<T> => {
  const breakpointsArray = Object.values(config) as BreakpointsArray<T>;
  const namedBreakpoints = breakpointsArray as unknown as Record<string, string>;

  Object.entries(config).forEach(([key, value]) => {
    namedBreakpoints[key] = value;
  });

  return breakpointsArray;
};
