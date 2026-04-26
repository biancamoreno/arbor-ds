import type { HTMLAttributes } from 'react';

/**
 * @platform native-ready
 * Placeholder de carregamento com animação pulse.
 *
 * - Web (`skeleton.tsx`): shimmer via gradient + keyframes CSS.
 * - Native (`skeleton.native.tsx`): pulse via `Animated` em opacity (sem gradient no MVP).
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
