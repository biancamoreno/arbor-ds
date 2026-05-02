/**
 * Pixel sizes shared between `spinner.tsx` and `spinner.native.tsx`.
 *
 * **Não** é token themable — produto consumidor não consegue reescalar via tema
 * hoje. Migração para `theme.sizes.control` está catalogada em SP-2/RFC-0027 follow-up.
 */
export const SIZE_MAP = { sm: 16, md: 24, lg: 40 } as const;

export type SpinnerSize = keyof typeof SIZE_MAP;
