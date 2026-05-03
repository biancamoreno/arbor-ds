import type { CSSProperties } from 'react';
import { Clickable } from '../../core';
import { Spinner } from '../../spinner';
import type { ButtonProps } from '../interfaces';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useButtonGroup, useButtonGroupItem } from '../../button-group/core/button-group-context';
import { transition } from '../../../ecosystem/utils/functions';

const buttonSizeMap = {
  sm: { paddingInline: '12px', paddingBlock: '4px' },
  md: { paddingInline: '16px', paddingBlock: '8px' },
  lg: { paddingInline: '20px', paddingBlock: '12px' },
} as const;

/**
 * @platform shared
 *
 * Botão primário do DS. Quatro variantes (`primary`/`secondary`/`ghost`/`danger`)
 * e três tamanhos (`sm`/`md`/`lg`); `loading` exibe `Spinner` à esquerda do
 * texto e desabilita interação. Quando renderizado dentro de `ButtonGroup`,
 * detecta `attached` e colapsa os raios do canto interno automaticamente para
 * formar um conjunto contíguo.
 *
 * @see {@link ButtonProps}
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  style,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const groupCtx = useButtonGroup();
  const itemCtx = useButtonGroupItem();
  const radiusSmall = theme.radii.small;

  const isDisabled = loading || disabled || (groupCtx?.disabled ?? false);

  // Radii colapsados quando dentro de ButtonGroup attached
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

  // em attached mode, borderRadius é controlado via style (individual corners)
  const borderRadiusProps = groupCtx?.attached ? {} : { borderRadius: 'small' as const };

  const variantStyles = {
    primary: {
      backgroundColor: theme.colors.interactive.default,
      borderColor: theme.colors.interactive.default,
      color: theme.colors.text.inverse,
    },
    secondary: {
      backgroundColor: theme.colors.brand.subtle,
      borderColor: theme.colors.brand.soft,
      color: theme.colors.text.primary,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: theme.colors.border.default,
      color: theme.colors.text.primary,
    },
    danger: {
      backgroundColor: theme.colors.feedback.critical.base,
      borderColor: theme.colors.feedback.critical.base,
      color: theme.colors.text.inverse,
    },
  } as const;

  return (
    <Clickable
      as="button"
      type={type}
      disabled={isDisabled}
      alignItems="center"
      display="inline-flex"
      gap="8px"
      justifyContent="center"
      {...borderRadiusProps}
      borderStyle="solid"
      borderWidth="hairline"
      cursor={isDisabled ? 'not-allowed' : 'pointer'}
      opacity={isDisabled ? 0.45 : 1}
      pointerEvents={isDisabled ? 'none' : 'auto'}
      onClick={isDisabled ? undefined : onClick}
      aria-busy={loading || undefined}
      data-arbor-focusable=""
      style={{
        ...buttonSizeMap[size],
        fontSize: size === 'lg' ? theme.fontSizes.medium : theme.fontSizes.small,
        fontWeight: theme.fontWeights.medium,
        lineHeight: 1,
        transition: transition(['background-color', 'border-color', 'opacity', 'filter', 'transform'], 'fast'),
        ...variantStyles[variant],
        ...attachedStyle,
        ...style,
      }}
      {...variantStyles[variant]}
      {...rest}
    >
      {loading && <Spinner size="sm" color={variantStyles[variant].color} label="" />}
      {children}
    </Clickable>
  );
}

Button.displayName = 'Button';
