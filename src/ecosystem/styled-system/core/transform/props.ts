import { type ForwardedRef, type MutableRefObject, type PropsWithChildren, type RefObject } from 'react';
import { type StyleProps as PropsWithStyle } from '../../system';
import type { Tags } from '../tags';

/** Propriedades que contêm o atributo `testID`. */
type PropsWithTestID = { testID: string };

/** Propriedades que contêm o atributo `innerRef`. */
type PropsWithInnerRef<T> = {
  innerRef?: RefObject<T> | MutableRefObject<T | undefined> | ForwardedRef<T>;
};

/** Propriedades que contêm o atributo `as`, para transformação do Styled Components. */
type PropsWithTransform = {
  as: Partial<Tags>;
};

/** Outras propriedades não específicas. */
type PropsOther = Record<string, unknown>;

/**
 * Propriedades para um componente Arbor.
 *
 * @typeparam T - Outras propriedades específicas.
 *
 * @example
 *   const props: ArborTransformProps<HTMLButtonElement, { disabled: boolean }> = {
 *   disabled: true,
 *   as: { web: 'button', native: 'TouchableOpacity' },
 *   fontSize: 'lg',
 *   outraProp: 'Hello',
 *   testID: 'button',
 *   innerRef: useRef(null),
 * };
 */
export type ArborTransformProps<T = PropsOther, U = HTMLElement> = Partial<T> &
  Partial<PropsWithTransform> &
  Partial<PropsWithStyle> &
  Partial<PropsWithChildren> &
  Partial<PropsWithTestID> &
  Partial<PropsWithInnerRef<U>>;
