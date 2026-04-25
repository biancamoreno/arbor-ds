/**
 * Tamanhos semânticos para `<Icon>`.
 *
 * Origem: RFC-0009.
 * - `xs` (12px): ícones inline em texto pequeno (helper text, badges).
 * - `sm` (16px): ícones em buttons sm, chips, tags.
 * - `md` (20px): default — buttons md, inputs, alerts.
 * - `lg` (24px): buttons lg, headers de section.
 * - `xl` (32px): hero icons em cards e empty states.
 * - `hero` (48px): ilustrações de empty state ou onboarding.
 */
export const iconSize = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  hero: 48,
} as const;

export type IconSizeToken = keyof typeof iconSize;
