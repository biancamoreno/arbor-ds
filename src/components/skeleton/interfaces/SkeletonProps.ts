import type { CSSProperties } from 'react';

/**
 * @platform native-ready
 * Placeholder de carregamento com animação pulse.
 *
 * - Web (`skeleton.tsx`): shimmer via gradient + `@keyframes arbor-shimmer` (injetado pelo `ArborProvider`).
 * - Native (`skeleton.native.tsx`): pulse via `Animated` em opacity (sem gradient no MVP).
 *
 * Para suprimir o anúncio do leitor de tela (ex: skeleton dentro de container que
 * já anuncia carregamento via `aria-busy`), passe `label={false}` — o componente
 * vira `aria-hidden`.
 */
export interface SkeletonProps {
  /** Largura em px ou string CSS */
  width?: number | string;
  /** Altura em px ou string CSS */
  height?: number | string;
  borderRadius?: number | string;
  /** Renderiza múltiplas linhas empilhadas */
  lines?: number;
  /**
   * Texto anunciado ao leitor de tela. Passe `false` para suprimir o anúncio
   * (Skeleton fica `aria-hidden`). @default "Carregando"
   */
  label?: string | false;
  /** Escape hatch para CSS não coberto pelo sistema */
  style?: CSSProperties;
  className?: string;
}
