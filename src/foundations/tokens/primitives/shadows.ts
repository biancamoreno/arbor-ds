export const shadows = {
  none: 'none',
  sm: '0 1px 2px rgba(0,0,0,0.04), 0 1px 1px rgba(0,0,0,0.06)',
  md: '0 2px 4px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.08)',
  lg: '0 4px 8px rgba(0,0,0,0.04), 0 12px 24px rgba(0,0,0,0.10)',
  xl: '0 8px 16px rgba(0,0,0,0.06), 0 24px 48px rgba(0,0,0,0.14)',
  cardHover: '0 4px 8px rgba(0,0,0,0.06), 0 12px 24px rgba(0,0,0,0.10)',
  /**
   * Anel de empilhamento usado em `AvatarGroup`. Resolve a cor via
   * CSS custom property `--arbor-color-surface-default` (emitida pelo `ArborProvider`),
   * com fallback `#fff` para SSR/render fora do provider.
   */
  avatarRing: '0 0 0 2px var(--arbor-color-surface-default, #fff)',
};
