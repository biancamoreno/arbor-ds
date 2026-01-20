import { type CustomProps, type CustomPropsConfig } from './types';
import { type Theme } from '../../tokens';
import { getTokenValue } from '../transform/new-transform/token-handlers';

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
  return (props: CustomProps<Config> & { theme?: Theme }) => {
    const result: Record<string, unknown> = {};
    const theme = props.theme;

    for (const key in config) {
      const value = props[key];
      if (value === undefined || value === null) continue;

      const { property, scale, transform } = config[key];
      let resolvedValue: unknown = value;

      if (scale && theme) {
        resolvedValue = getTokenValue(scale, theme, value as string) ?? value;
      }

      if (transform) {
        resolvedValue = transform(String(resolvedValue));
      }

      result[property] = resolvedValue;
    }

    return result;
  };
}
