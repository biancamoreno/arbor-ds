import { forwardRef } from 'react';
import { Square } from '../../square';
import { type CircleProps } from '../interfaces';

export const Circle = forwardRef<HTMLElement, CircleProps>(function Circle(props, ref) {
  return <Square ref={ref} {...props} borderRadius="full" />;
});

Circle.displayName = 'Circle';
