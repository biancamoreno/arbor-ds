/**
 * Tamanhos semânticos para `<Icon>`.
 *
 * Origem: RFC-0009 (revisado 2026-05-02 — nomenclatura alinhada à escala
 * semântica do DS: spacing/borderRadius usam prosa, não abreviação).
 *
 * - `xsmall` (12px): ícones inline em texto pequeno (helper text, badges).
 * - `small`  (16px): ícones em buttons sm, chips, tags.
 * - `medium` (20px): default — buttons md, inputs, alerts.
 * - `large`  (24px): buttons lg, headers de section.
 * - `xlarge` (32px): hero icons em cards e empty states.
 * - `hero`   (48px): ilustrações de empty state ou onboarding.
 */
export const iconSize = {
  xsmall: 12,
  small: 16,
  medium: 20,
  large: 24,
  xlarge: 32,
  hero: 48,
} as const;

export type IconSizeToken = keyof typeof iconSize;
