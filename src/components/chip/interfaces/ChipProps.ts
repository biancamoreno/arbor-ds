import type { CSSProperties, ReactNode } from 'react';
import type { FeedbackTone } from '../../../foundations';

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
  /**
   * Conjunto canônico `FeedbackTone` (RFC-0032). A interatividade real
   * (focável, `aria-pressed`) será endereçada pela RFC-0033.
   *
   * @default 'neutral'
   */
  tone?: FeedbackTone;
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
