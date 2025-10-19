/* eslint-disable @typescript-eslint/no-explicit-any */
/** Configuração base dos breakpoints.*/
export interface BaseBreakpointConfig {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

/**
 * Array de breakpoints.
 *
 * @typeparam T - A configuração dos breakpoints.
 *
 * @example
 * const breakpoints: BreakpointsArray<BaseBreakpointConfig> = ['480px', '768px', '1024px', '1280px'];
 */
type BreakpointsArray<T extends BaseBreakpointConfig> = Array<string> & T;

/**
 * Cria os breakpoints com base na configuração fornecida.
 *
 * @typeparam T - A configuração dos breakpoints.
 *
 * @param config - A configuração dos breakpoints.
 * @returns Os breakpoints criados.
 *
 * @example
 * const config: BaseBreakpointConfig = {
 *   sm: '480px',
 *   md: '768px',
 *   lg: '1024px',
 *   xl: '1280px',
 *  '2xl': '1536px',
 * };
 * const breakpoints = createBreakpoints(config); // ['480px', '768px', '1024px', '1280px']
 */
export const createBreakpoints = <T extends BaseBreakpointConfig>(config: T): BreakpointsArray<T> => {
  const breakpointsArray = Object.values(config);

  Object.entries(config).forEach(([key, value]: any) => {
    breakpointsArray[key] = value;
  });

  return breakpointsArray as BreakpointsArray<T>;
};
