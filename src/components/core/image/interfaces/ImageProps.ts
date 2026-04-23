import type { CSSProperties } from 'react';

/**
 * @platform native-ready
 * Componente de imagem com implementação dedicada para web (`image.tsx`) e React Native (`image.native.tsx`).
 * Suporta web, iOS e Android.
 */
export type ImageProps = {
  source: string | { uri: string } | number;
  width?: number | string;
  height?: number | string;
  resizeMode?: ResizeMode;
  style?: CSSProperties;
  children?: React.ReactNode;
  testID?: string;
  alt?: string;
  onError?: () => void;
  onLoad?: () => void;
};

type ResizeMode = 'center' | 'contain' | 'cover' | 'stretch';
