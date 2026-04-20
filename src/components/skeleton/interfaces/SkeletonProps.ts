import type { HTMLAttributes } from 'react';

/**
 * @platform shared
 * Placeholder de carregamento com animação shimmer.
 */
export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  /** Largura em px ou string CSS */
  width?: number | string;
  /** Altura em px ou string CSS */
  height?: number | string;
  borderRadius?: number | string;
  /** Renderiza múltiplas linhas empilhadas */
  lines?: number;
}
