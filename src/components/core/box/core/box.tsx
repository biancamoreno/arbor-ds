import { forwardRef, memo, type Ref } from 'react';
import { ArborTransform } from '../../../../ecosystem';
import { type BoxProps } from '../interfaces';

const BoxComponent = forwardRef<HTMLElement, BoxProps>(function Box(props, ref) {
  const legacyRef = props.innerRef as Ref<HTMLElement> | undefined;
  return <ArborTransform {...props} innerRef={ref ?? legacyRef} />;
});

BoxComponent.displayName = 'Box';
/**
 * @platform shared
 *
 * Primitivo de layout polimórfico do Arbor-DS — bloco genérico que recebe props
 * do styled-system (`padding`, `backgroundColor`, `borderRadius`, etc.) e renderiza
 * via `ArborTransform`. Use como base de quase todas as composições visuais; troque
 * a tag HTML/RN com `as` quando precisar de outro elemento semântico.
 *
 * @see {@link BoxProps}
 */
export const Box = memo(BoxComponent);
