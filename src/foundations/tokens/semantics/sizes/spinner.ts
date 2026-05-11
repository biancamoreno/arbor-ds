/**
 * Tamanhos themable para `<Spinner>` (RFC-0042 / PCV-4).
 *
 * Diferentes de `controlSize` (altura de container interativo): aqui é o
 * tamanho visual do glifo. Mantém 3 valores alinhados ao vocabulário SP-1
 * de Button (small/medium/large).
 *
 * - `small`  (16px): inline em botões medium ou texto.
 * - `medium` (24px): default — área de conteúdo, modais, banners.
 * - `large`  (40px): empty states, page-level loaders, overlays.
 */
export const spinnerSize = {
  small: 16,
  medium: 24,
  large: 40,
} as const;

export type SpinnerSize = keyof typeof spinnerSize;
