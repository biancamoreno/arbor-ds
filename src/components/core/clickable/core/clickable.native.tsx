import { forwardRef } from 'react';
import { Pressable, type View, type GestureResponderEvent } from 'react-native';
import { Box } from '../../box';
import type { ClickableProps } from '../interfaces';

type AccessibilityRoleNative =
  | 'button'
  | 'link'
  | 'menuitem'
  | 'tab'
  | 'radio'
  | 'checkbox'
  | 'combobox'
  | 'switch'
  | 'header'
  | 'image'
  | 'imagebutton'
  | 'text'
  | 'adjustable'
  | 'summary'
  | 'none'
  | 'search';

type AccessibilityStateNative = {
  selected?: boolean;
  checked?: boolean | 'mixed';
  busy?: boolean;
  expanded?: boolean;
  disabled?: boolean;
};

type ClickableNativeOnly = {
  accessibilityRole?: AccessibilityRoleNative;
  accessibilityLabel?: string;
  accessibilityState?: AccessibilityStateNative;
  testID?: string;
};

/**
 * @platform native
 *
 * Wrapper `<Pressable>` + `<Box>` que preserva a API pública do `Clickable`
 * web em React Native:
 * - `onClick` é disparado pelo `onPress` do Pressable.
 * - `role` mapeia para `accessibilityRole` (default `'button'`).
 * - `aria-label` mapeia para `accessibilityLabel`.
 * - `disabled` bloqueia o press e propaga em `accessibilityState`.
 *
 * Props styled-system são spreadadas no `<Box>` interno; gestures e a11y
 * vivem no Pressable. `as` e `innerRef` são aceitos pela tipagem
 * cross-platform e ignorados em native.
 *
 * @see {@link ClickableProps}
 */
export const Clickable = forwardRef<View, ClickableProps>(function Clickable(props, ref) {
  const {
    onClick,
    disabled,
    role,
    'aria-label': ariaLabel,
    testID,
    children,
    accessibilityRole,
    accessibilityLabel,
    accessibilityState,
    as: _ignoredAs,
    innerRef: _ignoredInnerRef,
    ...boxProps
  } = props as ClickableProps & ClickableNativeOnly & { as?: unknown; innerRef?: unknown };

  const a11yRole = accessibilityRole ?? (role as AccessibilityRoleNative | undefined) ?? 'button';
  const a11yLabel = accessibilityLabel ?? (ariaLabel as string | undefined);
  const a11yState: AccessibilityStateNative = { ...(accessibilityState ?? {}), disabled: !!disabled };

  const handlePress = (_event: GestureResponderEvent) => {
    if (disabled || !onClick) return;
    onClick({} as React.MouseEvent<HTMLElement>);
  };

  return (
    <Pressable
      ref={ref}
      onPress={handlePress}
      disabled={!!disabled}
      accessibilityRole={a11yRole}
      accessibilityState={a11yState}
      accessibilityLabel={a11yLabel}
      testID={testID as string | undefined}
    >
      <Box {...boxProps}>{children}</Box>
    </Pressable>
  );
});

Clickable.displayName = 'Clickable';
