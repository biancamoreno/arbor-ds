import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * @platform shared
 * Botão cross-platform. Web renderiza `<Clickable as="button">`; native compõe
 * `Clickable.native` (Pressable + Box) com `accessibilityRole="button"` e
 * `accessibilityState={{ disabled, busy }}`. Loader é o `<Spinner>` em ambas.
 *
 * Props específicas de DOM (`type`, `aria-*`) são aceitas pelo tipo (extends
 * `ButtonHTMLAttributes`) e ignoradas em native — segue o padrão de Tag (RFC-0018 onda 5).
 */
export interface ButtonVariant {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariant {
  children: ReactNode;
  /** Label de a11y. Cross-platform (web mapeia para `aria-label`, native para `accessibilityLabel`). */
  accessibilityLabel?: string;
  /** Papel de a11y. Default `'button'` aplicado pelo `Button.native`; em web é descartado (a tag `<button>` já carrega o role). */
  accessibilityRole?: string;
  /** Dica de a11y para React Native (`accessibilityHint`). Em web é descartada. */
  accessibilityHint?: string;
}

export interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  'aria-label': string;
  children: ReactNode;
  shape?: 'square' | 'circle';
}
