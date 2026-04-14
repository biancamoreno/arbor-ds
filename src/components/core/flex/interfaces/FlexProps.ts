import type { MouseEventHandler } from 'react';
import { type ArborTransformProps } from '../../../../ecosystem';

export type FlexProps = ArborTransformProps & {
  onClick?: MouseEventHandler<HTMLElement>;
};
