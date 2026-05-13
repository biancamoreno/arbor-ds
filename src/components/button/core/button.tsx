import type { CSSProperties } from 'react';
import { Clickable } from '../../core';
import { Spinner } from '../../spinner';
import type { ButtonProps } from '../interfaces';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useRecipe } from '../../../ecosystem/styled-system/recipes';
import { useButtonGroup, useButtonGroupItem } from '../../button-group/core/button-group-context';

const spinnerColorByVariant = {
  primary: 'text.inverse',
  secondary: 'text.primary',
  ghost: 'text.primary',
  danger: 'text.inverse',
} as const;

/**
 * @platform shared
 *
 * Botão primário do DS. Quatro variantes (`primary`/`secondary`/`ghost`/`danger`)
 * e três tamanhos (`small`/`medium`/`large`); `loading` exibe `Spinner` à esquerda do
 * texto e desabilita interação. Quando renderizado dentro de `ButtonGroup`,
 * detecta `attached` e colapsa os raios do canto interno automaticamente para
 * formar um conjunto contíguo.
 *
 * Tratamento de disabled (opacity, cursor, pointer-events, bloqueio de onClick)
 * e foco visível são entregues pelo `Clickable` por construção.
 *
 * @see {@link ButtonProps}
 */
export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  style,
  accessibilityLabel,
  accessibilityRole: _accessibilityRole,
  accessibilityHint: _accessibilityHint,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const groupCtx = useButtonGroup();
  const itemCtx = useButtonGroupItem();
  const radiusSmall = theme.radii.small;

  const isDisabled = loading || disabled || (groupCtx?.disabled ?? false);
  const recipeStyles = useRecipe('button', { variant, size });

  let attachedStyle: CSSProperties = {};
  if (groupCtx?.attached && itemCtx) {
    const { index, totalItems } = itemCtx;
    const { orientation } = groupCtx;
    const isFirst = index === 0;
    const isLast = index === totalItems - 1;

    if (orientation === 'horizontal') {
      if (isFirst) {
        attachedStyle = {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          borderTopLeftRadius: radiusSmall,
          borderBottomLeftRadius: radiusSmall,
        };
      } else if (isLast) {
        attachedStyle = {
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderTopRightRadius: radiusSmall,
          borderBottomRightRadius: radiusSmall,
          marginInlineStart: -1,
        };
      } else {
        attachedStyle = { borderRadius: 0, marginInlineStart: -1 };
      }
    } else {
      if (isFirst) {
        attachedStyle = {
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          borderTopLeftRadius: radiusSmall,
          borderTopRightRadius: radiusSmall,
        };
      } else if (isLast) {
        attachedStyle = {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: radiusSmall,
          borderBottomRightRadius: radiusSmall,
          marginBlockStart: -1,
        };
      } else {
        attachedStyle = { borderRadius: 0, marginBlockStart: -1 };
      }
    }
  }

  const recipeProps = groupCtx?.attached
    ? Object.fromEntries(Object.entries(recipeStyles).filter(([k]) => k !== 'borderRadius'))
    : recipeStyles;

  return (
    <Clickable
      as="button"
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      aria-busy={loading || undefined}
      aria-label={accessibilityLabel}
      {...recipeProps}
      style={{ ...attachedStyle, ...style }}
      {...rest}
    >
      {loading && <Spinner size="small" color={spinnerColorByVariant[variant]} label="" />}
      {children}
    </Clickable>
  );
}

Button.displayName = 'Button';
