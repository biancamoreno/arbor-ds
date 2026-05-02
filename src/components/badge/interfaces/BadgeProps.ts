import type { CSSProperties, ReactNode } from 'react';

/**
 * @platform shared
 *
 * Não estende `HTMLAttributes<HTMLSpanElement>` para preservar paridade
 * cross-platform — atributos DOM-only ficariam vazando em RN.
 */
export interface BadgeProps {
  children?: ReactNode;
  /** Semântica de cor */
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'critical' | 'info';
  /** Preenchimento sólido vs. suave */
  variant?: 'solid' | 'subtle';
  size?: 'sm' | 'md';
  /** Escape hatch para CSS não coberto pelo sistema */
  style?: CSSProperties;
  className?: string;
}

/** Posiciona um Badge sobre um elemento-pai */
export interface BadgeAnchorProps {
  children: ReactNode;
  badge: ReactNode;
  /** @default 'top-right' */
  placement?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  /** Escape hatch para CSS não coberto pelo sistema */
  style?: CSSProperties;
  className?: string;
}
