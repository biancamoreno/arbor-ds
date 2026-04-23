import { memo } from 'react';
import { ArborTransform } from '../../../../ecosystem';
import { type BoxProps } from '../interfaces';

function BoxComponent<T extends object>(props: BoxProps<T>) {
  return <ArborTransform<T> {...props} />;
}

BoxComponent.displayName = 'Box';
export const Box = memo(BoxComponent) as typeof BoxComponent;
