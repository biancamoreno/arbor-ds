/**
 * Tokens do componente Breadcrumb.
 *
 * Todos os valores são aliases por string para outros tokens (semantic ou
 * primitive escala) — recipe consome via `$breadcrumb.…` e override via
 * `createTheme({ tokens: { breadcrumb: { … } } })` propaga para web e native.
 */
export const breadcrumb = {
  /** Gap entre Item e Separator dentro da List. */
  gap: 'nano',
  /** Gap dentro de Item quando há mais de um filho (raro). */
  itemGap: 'nano',
  separator: {
    /** Tamanho do ícone do separator default (`<Icon name="ChevronRight">`). */
    iconSize: 'small',
    /** Cor do separator (ícone e texto custom). */
    color: 'text.tertiary',
  },
  link: {
    colors: {
      default: 'interactive.default',
      hover: 'interactive.hover',
    },
  },
  current: {
    color: 'text.primary',
  },
};
