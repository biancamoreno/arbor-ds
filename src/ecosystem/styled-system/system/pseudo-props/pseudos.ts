interface PseudoSelectors {
  [key: string]: unknown;
}

const pseudoSelectors: PseudoSelectors = {
  /**
   * Estilos para o seletor CSS `&:hover`
   */
  _hover: '&:hover, &[data-hover]',
  /**
   * Estilos para o seletor CSS `&:active`
   */
  _active: '&:active, &[data-active]',
  /**
   * Estilos para o seletor CSS `&:focus`
   *
   */
  _focus: '&:focus, &[data-focus]',
  /**
   * Estilos a serem aplicados quando um filho deste elemento recebeu o foco
   * - Seletor CSS `&:focus-within`
   */
  _focusWithin: '&:focus-within',
  _focusVisible: '&:focus-visible',
  /**
   * Estilos a serem aplicados quando este elemento estiver desabilitado. Os estilos passados são aplicados a estes seletores CSS:
   * - `&[aria-disabled=true]`
   * - `&:disabled`
   * - `&[data-disabled]`
   */
  _disabled: '&[disabled], &[aria-disabled=true], &[data-disabled]',
  /**
   * Estilos para o seletor CSS `&:readonly`
   */
  _readOnly: '&[aria-readonly=true], &[readonly], &[data-readonly]',
  /**
   * Estilos para o seletor CSS `&::before`
   *
   * OBSERVAÇÃO: ao usar isso, certifique-se de que o `content` esteja entre crases.
   * @example
   * ```jsx
   * <Box _before={{content:`""` }}/>
   * ```
   */
  _before: '&::before',
  /**
   * Estilos para o seletor CSS `&::after`
   *
   * OBSERVAÇÃO: ao usar isso, certifique-se de que o `content` esteja entre crases.
   * @example
   * ```jsx
   * <Box _after={{content:`""` }}/>
   * ```
   */
  _after: '&::after',
  _empty: '&:empty',
  /**
   * Estilos para o seletor CSS `&:-webkit-autofill`
   */
  _autofill: '&:-webkit-autofill',
  /**
   * Estilos para o seletor CSS `&:nth-child(even)`
   */
  _even: '&:nth-of-type(even)',
  /**
   * Estilos para o seletor CSS `&:nth-child(odd)`
   */
  _odd: '&:nth-of-type(odd)',
  /**
   * Estilos para o seletor CSS `&:first-of-type`
   */
  _first: '&:first-of-type',
  /**
   * Estilos para o seletor CSS `&:last-of-type`
   */
  _last: '&:last-of-type',
  /**
   * Estilos para o seletor CSS `&:not(:first-of-type)`
   */
  _notFirst: '&:not(:first-of-type)',
  /**
   * Estilos para o seletor CSS `&:not(:last-of-type)`
   */
  _notLast: '&:not(:last-of-type)',
  /**
   * Estilos para o seletor CSS `&:visited`
   */
  _visited: '&:visited',
  /**
   * Estilos para o seletor CSS `&::placeholder`
   */
  _placeholder: '&::-webkit-input-placeholder',
};

export const pseudoPropNames = Object.keys(pseudoSelectors);

export function systemPseudoProps(pseudoProps: Partial<PseudoSelectors>): Partial<PseudoSelectors> {
  const css: PseudoSelectors = {};

  Object.entries(pseudoProps).forEach(([key, value]) => {
    const pseudoSelector = pseudoSelectors[key] as string;

    if (pseudoSelector && value) {
      css[pseudoSelector] = value;
    }
  });

  return css;
}
