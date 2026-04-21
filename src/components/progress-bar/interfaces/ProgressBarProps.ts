import type { HTMLAttributes } from 'react';

/**
 * @platform shared
 * Barra de progresso determinada (0–100) ou indeterminada.
 */
export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Valor de 0 a 100 (ignorado quando indeterminate=true) */
  progress: number;
  /** Quando true, exibe animação de progresso indeterminado */
  indeterminate?: boolean;
  /** Texto descritivo para leitores de tela */
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'brand' | 'success' | 'warning' | 'critical';
}
