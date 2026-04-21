import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * @platform web-only
 * Botão que estende HTMLButtonElement — usa APIs DOM exclusivas da web.
 * Uma implementação React Native será adicionada em fase futura.
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
