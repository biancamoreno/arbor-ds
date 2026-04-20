import type { MouseEventHandler } from 'react';
import type { ArborTransformProps, TapStateProps } from '../../../../ecosystem';

/**
 * @platform web-only
 * Botão interativo que usa APIs DOM (cursor, border, button element, MouseEventHandler).
 * Para interações nativas use Pressable do React Native ou um componente dedicado.
 */
export type ClickableProps = ArborTransformProps & {
  tapState?: TapStateProps;
  onClick?: MouseEventHandler<HTMLElement>;
};
