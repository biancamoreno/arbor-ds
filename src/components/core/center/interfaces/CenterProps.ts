import { type ArborTransformProps } from '../../../../ecosystem';

/**
 * @platform shared
 * Container de centralização que funciona em web e React Native via ArborTransform.
 */
export type CenterProps<T extends object> = Omit<ArborTransformProps<T>, 'display' | 'alignItems' | 'justifyContent'>;
