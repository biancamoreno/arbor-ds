import type { CSSProperties } from 'react';

/**
 * @platform shared
 *
 * Barra de progresso determinada (0–100) ou indeterminada.
 *
 * Não estende `HTMLAttributes<HTMLDivElement>` para preservar paridade
 * cross-platform — atributos DOM-only ficariam vazando em RN.
 */
export interface ProgressBarProps {
  /** Valor de 0 a 100 (ignorado quando indeterminate=true) */
  progress: number;
  /** Quando true, exibe animação de progresso indeterminado */
  indeterminate?: boolean;
  /** Texto descritivo para leitores de tela */
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'brand' | 'success' | 'warning' | 'critical';
  /** Escape hatch para CSS não coberto pelo sistema */
  style?: CSSProperties;
  className?: string;
}
