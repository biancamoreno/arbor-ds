import { type ArborTransformProps } from '../../../../ecosystem';

/**
 * @platform shared
 * Container quadrado com dimensões iguais que funciona em web e React Native via ArborTransform.
 */
export type SquareOmitted = 'width' | 'height' | 'w' | 'h';

export type SquareProps = Omit<ArborTransformProps, SquareOmitted> & {
  centerContent?: boolean;
  size?: ArborTransformProps['width'];
};
