import type { SVGAttributes } from 'react';

/**
 * @platform shared
 * Indicador de progresso circular (0–100).
 */
export interface ProgressCircleProps extends SVGAttributes<SVGSVGElement> {
  /** Valor de 0 a 100 */
  progress: number;
  size?: number;
  strokeWidth?: number;
  tone?: 'brand' | 'success' | 'warning' | 'critical';
  /** Texto descritivo para leitores de tela */
  label?: string;
}
