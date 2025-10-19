import { memo } from 'react';
import { ArborTransform } from '../../../../ecosystem';
import { type BoxProps } from '../interfaces';

function BoxComponent<T>(props: BoxProps<T>) {
  return <ArborTransform<T> {...props} />;
}

export const Box = memo(BoxComponent) as typeof BoxComponent;
