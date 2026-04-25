import type { MouseEventHandler } from 'react';
import type { ArborTransformProps } from '../../../../ecosystem';

/**
 * @platform native-ready
 * Botão interativo cross-platform.
 *
 * - Web (`clickable.tsx`): renderiza tag interativa (`<button>`, `<a>`, ...) via `<Flex as>`.
 * - Native (`clickable.native.tsx`): envolve `<Pressable>` + `<Box>` interno; mapeia
 *   `onClick` → `onPress`, `role` → `accessibilityRole`, `aria-label` → `accessibilityLabel`.
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
