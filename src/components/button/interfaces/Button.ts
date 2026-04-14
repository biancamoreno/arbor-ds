import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonVariant {
  variant?: 'primary' | 'secondary' | 'ghost';
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
