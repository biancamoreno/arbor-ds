import type { SVGAttributes } from 'react';

/**
 * @platform shared
 * Indicador de progresso circular (0–100) ou indeterminado.
 */
export interface ProgressCircleProps extends SVGAttributes<SVGSVGElement> {
  /** Valor de 0 a 100 (ignorado quando indeterminate=true) */
  progress: number;
  /** Quando true, exibe animação de progresso indeterminado */
  indeterminate?: boolean;
  size?: number;
  strokeWidth?: number;
  tone?: 'brand' | 'success' | 'warning' | 'critical';
  /** Texto descritivo para leitores de tela */
  label?: string;
}
