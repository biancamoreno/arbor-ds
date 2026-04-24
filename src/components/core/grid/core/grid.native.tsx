import { forwardRef, type Ref } from 'react';
import { ArborTransform } from '../../../../ecosystem';
import type { GridProps } from '../interfaces';

export const Grid = forwardRef<unknown, GridProps>(function Grid(props, ref) {
  const legacyRef = props.innerRef as Ref<unknown> | undefined;
  return <ArborTransform {...props} innerRef={ref ?? legacyRef} display="flex" flexWrap="wrap" flexDirection="row" />;
});

Grid.displayName = 'Grid';
