import type { MouseEventHandler, ReactElement } from 'react';
import type { ArborTransformProps, TapStateProps } from '../../../../ecosystem';

export type ClickableProps = ArborTransformProps<ReactElement> & {
  tapState?: TapStateProps;
  onClick?: MouseEventHandler<HTMLElement>;
};
