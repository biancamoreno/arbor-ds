import { type ArborTransformProps } from '../../../../ecosystem';
export type CenterProps<T> = Omit<ArborTransformProps<T>, 'display' | 'alignItems' | 'justifyContent'>;
