import type { TextInputProps } from './TextInputProps';

/**
 * @platform shared
 *
 * Props do `SearchInput` — `TextInput` pré-configurado para busca, com ícone
 * de lupa à esquerda fixo e `type="search"`. Herda toda a API do `TextInput`,
 * incluindo Field-awareness, exceto a prop `type` (que é fixada).
 */
export interface SearchInputProps extends Omit<TextInputProps, 'type'> {
  /**
   * Disparado quando o usuário pressiona Enter no campo, com o valor atual
   * como argumento. Não há debounce embutido — para busca incremental
   * conforme digita, use `onValueChange` (do `TextInput` base).
   */
  onSearch?: (value: string) => void;
}
