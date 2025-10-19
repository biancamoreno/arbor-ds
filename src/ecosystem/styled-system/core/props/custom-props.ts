import { system, compose } from 'styled-system';
import { type CustomProps, type CustomPropsConfig } from './types';

/**
 *  Cria as custom props com base na configuração fornecida.
 *
 * @typeparam Config - A configuração das custom props.
 *
 * @param config - A configuração das custom props.
 * @returns A função de estilo que aplica as custom props.
 *
 * @example
 * const config: CustomPropsConfig = {
 *   color: { property: 'color' },
 *   fontSize: { property: 'font-size', scale: 'fontSizes', transform: (value) => `${value}px` },
 *   margin: { property: 'margin', scale: 'space', transform: (value) => `${value}px` },
 * };
 * const customProps = createCustomProps(config);
 */
export function createCustomProps<Config extends CustomPropsConfig>(config: Config) {
  const properties: Record<string, CustomProps<Config>> = {};

  for (const key in config) {
    properties[key] = {
      property: config[key].property,
      scale: config[key].scale || undefined,
      transform: config[key].transform || undefined,
    };
  }

  const systemFunction = system(properties);

  return compose(systemFunction);
}
