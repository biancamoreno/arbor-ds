import { forwardRef, type Ref } from 'react';
import { ArborTransform } from '../../../../ecosystem';
import { type SpacerProps } from '../interfaces';

export const Spacer = forwardRef<HTMLElement, SpacerProps>(function Spacer(props, ref) {
  const legacyRef = props.innerRef as Ref<HTMLElement> | undefined;
  return <ArborTransform {...props} innerRef={ref ?? legacyRef} flex={1} justifySelf="stretch" alignSelf="stretch" />;
});

Spacer.displayName = 'Spacer';
