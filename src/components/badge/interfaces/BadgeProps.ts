import type { CSSProperties, ReactNode } from 'react';
import type { FeedbackTone } from '../../../foundations';

/**
 * @platform shared
 *
 * Indicador denso textual/numérico (badge decorativo). Não-interativo; pensado
 * para contagem ("3", "99+"), dot ("•") ou label curto frequentemente
 * sobreposto a Avatar/Icon/Button via `Badge.Anchor`.
 *
 * Não estende `HTMLAttributes<HTMLSpanElement>` para preservar paridade
 * cross-platform — atributos DOM-only ficariam vazando em RN.
 */
export interface BadgeProps {
  children?: ReactNode;
  /**
   * Ícone opcional renderizado antes do `children`. Tipicamente `<Icon
   * name="..." size="xsmall" decorative />`. Quando presente, o slot `icon`
   * da recipe aplica `display:inline-flex` + `flexShrink:0`.
   */
  icon?: ReactNode;
  /** Conjunto canônico `FeedbackTone` (RFC-0032). @default 'neutral' */
  tone?: FeedbackTone;
  /**
   * Decoração visual.
   * - `'solid'` (default): preenchimento opaco — alta saliência para contagem
   *   sobre âncora.
   * - `'subtle'`: fundo discreto + texto saturado — para badges inline em
   *   linhas de metadados.
   *
   * @default 'solid'
   */
  variant?: 'solid' | 'subtle';
  /** @default 'medium' */
  size?: 'small' | 'medium';
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
