import type { CSSProperties, ReactNode } from 'react';

/**
 * @platform shared
 */
export interface ChipRootProps {
  children: ReactNode;
  /** @default 'subtle' */
  variant?: 'filled' | 'outlined' | 'subtle';
  /** @default 'md' */
  size?: 'sm' | 'md';
  /** Chip está selecionado/ativo */
  selected?: boolean;
  disabled?: boolean;
  /** @default 'neutral' */
  tone?: 'neutral' | 'brand';
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}

export interface ChipLabelProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export interface ChipIconProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export interface ChipRemoveProps {
  /** @default "Remover" */
  label?: string;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}
