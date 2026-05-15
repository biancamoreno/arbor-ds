/**
 * Largura máxima default do `Tooltip`. Themable — produtos podem ajustar via
 * `createTheme(base, { tokens: { tooltip: { maxWidth: '...' } } })`
 * sem editar a recipe `tooltip`.
 */
export const tooltipSize = {
  maxWidth: '240px',
};

export type TooltipSize = typeof tooltipSize;
