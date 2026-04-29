import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * @platform native-ready
 * Botão cross-platform. Web renderiza `<Clickable as="button">`; native compõe
 * `Clickable.native` (Pressable + Box) com `accessibilityRole="button"` e
 * `accessibilityState={{ disabled, busy }}`. Loader é o `<Spinner>` em ambas.
 *
 * Props específicas de DOM (`type`, `aria-*`) são aceitas pelo tipo (extends
 * `ButtonHTMLAttributes`) e ignoradas em native — segue o padrão de Tag (RFC-0018 onda 5).
 */
export interface ButtonVariant {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariant {
  children: ReactNode;
}

export interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  'aria-label': string;
  children: ReactNode;
  shape?: 'square' | 'circle';
}
