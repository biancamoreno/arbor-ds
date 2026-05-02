import { forwardRef } from 'react';
import { Square } from '../../square';
import { type CircleProps } from '../interfaces';

/**
 * @platform shared
 *
 * `Square` com `borderRadius="full"` aplicado — bloco circular de proporção
 * fixa. Útil para avatares, badges, ícones em selo.
 *
 * @see {@link CircleProps}
 */
export const Circle = forwardRef<HTMLElement, CircleProps>(function Circle(props, ref) {
  return <Square ref={ref} {...props} borderRadius="full" />;
});

Circle.displayName = 'Circle';
