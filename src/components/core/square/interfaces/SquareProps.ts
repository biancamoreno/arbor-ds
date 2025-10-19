import { type ArborTransformProps } from '../../../../ecosystem';

export type SquareOmitted = 'width' | 'height' | 'w' | 'h';

export type SquareProps<T> = Omit<ArborTransformProps<T>, SquareOmitted> & {
  centerContent?: boolean;
  size?: ArborTransformProps['width'];
};
