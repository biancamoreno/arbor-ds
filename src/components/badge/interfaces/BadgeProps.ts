import type { HTMLAttributes, ReactNode } from 'react';

/**
 * @platform shared
 */
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  /** Semântica de cor */
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'critical' | 'info';
  /** Preenchimento sólido vs. suave */
  variant?: 'solid' | 'subtle';
  size?: 'sm' | 'md';
}

/** Posiciona um Badge sobre um elemento-pai */
export interface BadgeAnchorProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  badge: ReactNode;
  /** @default 'top-right' */
  placement?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}
