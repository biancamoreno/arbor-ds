import { type ArborTheme, themeLight } from '../../../../foundations';
import { cssInJs, type ThemeProviderProps as ArborProviderProps } from '../../adapters';

export type { ArborProviderProps };

/**
 * Componente ArborProvider, responsável por aplicar o tema, e as propriedades adicionais.
 *
 * @param theme - O tema a ser utilizado.
 * @param props - Outras propriedades para o componente ArborProviderProps.
 * @returns O componente ArborProvider.
 */
export function ArborProvider({ theme = themeLight, ...props }: Partial<ArborProviderProps<ArborTheme>>) {
  return <cssInJs.ThemeProvider theme={theme} {...props} />;
}
