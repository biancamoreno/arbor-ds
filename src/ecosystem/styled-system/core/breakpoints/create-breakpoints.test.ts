import { createBreakpoints, type BaseBreakpointConfig } from './create-breakpoints';

describe('createBreakpoints', () => {
  const breakpointConfig: BaseBreakpointConfig = {
    sm: '320px',
    md: '600px',
    lg: '1024px',
    xl: '1440px',
    '2xl': '1920px',
  };

  it('should return an array containing keys from the configuration object', () => {
    const result = createBreakpoints(breakpointConfig);

    expect(Object.keys(result)).toEqual(['0', '1', '2', '3', 'sm', 'md', 'lg', 'xl']);
  });

  it('should return an array containing the correct values from the configuration object', () => {
    const breakpoints = createBreakpoints(breakpointConfig);

    expect(breakpoints[0]).toBe('320px');
    expect(breakpoints[1]).toBe('600px');
    expect(breakpoints[2]).toBe('1024px');
    expect(breakpoints[3]).toBe('1440px');

    expect(breakpoints.sm).toBe('320px');
    expect(breakpoints.md).toBe('600px');
    expect(breakpoints.lg).toBe('1024px');
    expect(breakpoints.xl).toBe('1440px');
  });
});
