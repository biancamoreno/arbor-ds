import type { HTMLAttributes, ImgHTMLAttributes, ReactNode } from 'react';

/**
 * @platform shared
 */
export interface AvatarRootProps extends HTMLAttributes<HTMLSpanElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Forma do avatar */
  shape?: 'circle' | 'square';
  children: ReactNode;
}

export interface AvatarImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export interface AvatarFallbackProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  /** Atraso em ms antes de exibir o fallback (evita flash) @default 0 */
  delayMs?: number;
}

export interface AvatarGroupProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  /** Limite de avatares visíveis antes do contador */
  max?: number;
  /** Mesmo tamanho aplicado a todos os avatares filhos */
  size?: AvatarRootProps['size'];
}
