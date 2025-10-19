import { type ArborTransformProps } from '../../../../ecosystem';

export type BoxProps<T> = ArborTransformProps<T> & {
  onClick?: () => void;
};
