import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

/**
 * @platform shared
 */
export interface ChipRootProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: 'filled' | 'outlined' | 'subtle';
  size?: 'sm' | 'md';
  /** Chip está selecionado/ativo */
  selected?: boolean;
  disabled?: boolean;
  /** Tone semântico da cor */
  tone?: 'neutral' | 'brand';
}

export interface ChipLabelProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export interface ChipIconProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export interface ChipRemoveProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** @default "Remover" */
  label?: string;
}
