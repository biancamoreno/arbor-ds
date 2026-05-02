import { forwardRef, type Ref } from 'react';
import { ArborTransform } from '../../../../ecosystem';
import { type SpacerProps } from '../interfaces';

/**
 * @platform shared
 *
 * Espaçador flexível para uso dentro de containers `Flex`/`Stack`. Aplica
 * `flex: 1` + `align/justifySelf: stretch`, empurrando irmãos vizinhos para as
 * extremidades. Use quando quiser distribuir espaço sem fixar `gap`/`margin`.
 *
 * @see {@link SpacerProps}
 */
export const Spacer = forwardRef<HTMLElement, SpacerProps>(function Spacer(props, ref) {
  const legacyRef = props.innerRef as Ref<HTMLElement> | undefined;
  return <ArborTransform {...props} innerRef={ref ?? legacyRef} flex={1} justifySelf="stretch" alignSelf="stretch" />;
});

Spacer.displayName = 'Spacer';
