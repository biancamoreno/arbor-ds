import type { CSSProperties, ReactNode } from 'react';
import type { ImageErrorEvent, ImageLoadEvent } from '../../core/image';

/** @platform shared */
export type AvatarSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

/** @platform shared */
export type AvatarShape = 'circle' | 'square';

/**
 * @platform shared
 *
 * `Avatar` compound (cross-platform). `Root` controla `size` e `shape`;
 * `Image` carrega a imagem e ativa `Fallback` (iniciais ou conteúdo
 * customizado) em loading/erro. `AvatarGroup` empilha avatares com `+N`
 * quando excede `max`.
 *
 * Tamanhos resolvem via `theme.sizes.avatar.{size}`; sobreposição via
 * `theme.sizes.avatarOverlap.{size}`; anel via `shadows.avatarRing` (web)
 * ou `borderColor: 'surface.default'` (native). Override completo via
 * `createTheme`.
 */
export interface AvatarRootProps {
  children: ReactNode;
  size?: AvatarSize;
  shape?: AvatarShape;
  className?: string;
  style?: CSSProperties;
}

/** @platform shared */
export interface AvatarImageProps {
  src: string;
  alt: string;
  onLoad?: (event: ImageLoadEvent) => void;
  onError?: (event: ImageErrorEvent) => void;
  style?: CSSProperties;
}

/** @platform shared */
export interface AvatarFallbackProps {
  children: ReactNode;
  /** Atraso em ms antes de exibir o fallback (evita flash). Default: `0`. */
  delayMs?: number;
  className?: string;
  style?: CSSProperties;
}

/** @platform shared */
export interface AvatarGroupProps {
  children: ReactNode;
  /** Limite de avatares visíveis antes do contador `+N`. */
  max?: number;
  /** Mesmo tamanho aplicado a todos os avatares filhos. */
  size?: AvatarSize;
  className?: string;
  style?: CSSProperties;
}
