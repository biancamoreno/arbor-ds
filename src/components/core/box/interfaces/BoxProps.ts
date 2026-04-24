import type { MouseEventHandler } from 'react';
import { type ArborTransformProps } from '../../../../ecosystem';

/**
 * @platform shared
 * Layout primitive que funciona em web e React Native via ArborTransform.
 * A prop `onClick` é ignorada em contexto native — use `onPress` para interações nativas.
 */
export type BoxProps = ArborTransformProps & {
  onClick?: MouseEventHandler<HTMLElement>;
};
