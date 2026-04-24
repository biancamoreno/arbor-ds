import type { MouseEventHandler } from 'react';
import type { ArborTransformProps } from '../../../../ecosystem';

/**
 * @platform web-only
 * Botão interativo que usa APIs DOM (cursor, border, button element, MouseEventHandler).
 * Para interações nativas use Pressable do React Native ou um componente dedicado.
 *
 * Para feedback visual de press, componha com `<PressFeedback>` como filho irmão dos children:
 * ```tsx
 * <Clickable onClick={handler}>
 *   <PressFeedback variant="default" />
 *   <Text>Click me</Text>
 * </Clickable>
 * ```
 */
export type ClickableProps = ArborTransformProps & {
  onClick?: MouseEventHandler<HTMLElement>;
};
