import type { HTMLAttributes } from 'react';

/**
 * @platform shared
 * Barra de progresso determinada (0–100).
 */
export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Valor de 0 a 100 */
  progress: number;
  /** Texto descritivo para leitores de tela */
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'brand' | 'success' | 'warning' | 'critical';
}
