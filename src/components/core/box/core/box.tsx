import { forwardRef, memo, type Ref } from 'react';
import { ArborTransform } from '../../../../ecosystem';
import { type BoxProps } from '../interfaces';

const BoxComponent = forwardRef<HTMLElement, BoxProps>(function Box(props, ref) {
  const legacyRef = props.innerRef as Ref<HTMLElement> | undefined;
  return <ArborTransform {...props} innerRef={ref ?? legacyRef} />;
});

BoxComponent.displayName = 'Box';
export const Box = memo(BoxComponent);
