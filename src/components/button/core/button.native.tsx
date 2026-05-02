import type { ViewStyle } from 'react-native';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { Clickable, Text } from '../../core';
import { Spinner } from '../../spinner';
import { useButtonGroup, useButtonGroupItem } from '../../button-group/core/button-group-context';
import type { ButtonProps } from '../interfaces';

const buttonSizeMap = {
  sm: { paddingHorizontal: 12, paddingVertical: 4, fontSize: 14 },
  md: { paddingHorizontal: 16, paddingVertical: 8, fontSize: 14 },
  lg: { paddingHorizontal: 20, paddingVertical: 12, fontSize: 16 },
} as const;

function getVariantColors(variant: NonNullable<ButtonProps['variant']>, theme: ReturnType<typeof useTheme>) {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: theme.colors.interactive.default,
        borderColor: theme.colors.interactive.default,
        color: theme.colors.text.inverse,
      };
    case 'secondary':
      return {
        backgroundColor: theme.colors.brand.subtle,
        borderColor: theme.colors.brand.soft,
        color: theme.colors.text.primary,
      };
    case 'ghost':
      return {
        backgroundColor: 'transparent',
        borderColor: theme.colors.border.default,
        color: theme.colors.text.primary,
      };
    case 'danger':
      return {
        backgroundColor: theme.colors.feedback.critical.base,
        borderColor: theme.colors.feedback.critical.base,
        color: theme.colors.text.inverse,
      };
  }
}

type AttachedSide = 'first' | 'middle' | 'last' | 'only';

function resolveAttachedSide(index: number, total: number): AttachedSide {
  if (total <= 1) return 'only';
  if (index === 0) return 'first';
  if (index === total - 1) return 'last';
  return 'middle';
}

function getAttachedStyle(
  side: AttachedSide,
  orientation: 'horizontal' | 'vertical',
  radiusSmall: number,
): ViewStyle {
  if (side === 'only') {
    return {
      borderTopLeftRadius: radiusSmall,
      borderTopRightRadius: radiusSmall,
      borderBottomLeftRadius: radiusSmall,
      borderBottomRightRadius: radiusSmall,
    };
  }

  if (orientation === 'horizontal') {
    if (side === 'first') {
      return {
        borderTopLeftRadius: radiusSmall,
        borderBottomLeftRadius: radiusSmall,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      };
    }
    if (side === 'last') {
      return {
        borderTopRightRadius: radiusSmall,
        borderBottomRightRadius: radiusSmall,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderLeftWidth: 0,
      };
    }
    return {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      borderLeftWidth: 0,
    };
  }

  if (side === 'first') {
    return {
      borderTopLeftRadius: radiusSmall,
      borderTopRightRadius: radiusSmall,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    };
  }
  if (side === 'last') {
    return {
      borderBottomLeftRadius: radiusSmall,
      borderBottomRightRadius: radiusSmall,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderTopWidth: 0,
    };
  }
  return {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopWidth: 0,
  };
}

/**
 * @platform native
 *
 * `Button` em React Native: `Clickable.native` com
 * `accessibilityRole="button"` + `accessibilityState={{ disabled, busy }}`.
 * Loader via `<Spinner>` (cross-platform). Strings em `children` são
 * envolvidas em `<Text>` (RN não renderiza string solta dentro de View).
 * Props `type`, `aria-*`, `cursor` e `transition` são aceitas pela tipagem
 * cross-platform e ignoradas aqui.
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
  style,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const groupCtx = useButtonGroup();
  const itemCtx = useButtonGroupItem();

  const isDisabled = loading || disabled || (groupCtx?.isDisabled ?? false);
  const sizing = buttonSizeMap[size];
  const colors = getVariantColors(variant, theme);
  const radiusSmall = typeof theme.radii.small === 'number' ? theme.radii.small : 6;

  const attachedStyle: ViewStyle =
    groupCtx?.attached && itemCtx
      ? getAttachedStyle(
          resolveAttachedSide(itemCtx.index, itemCtx.totalItems),
          groupCtx.orientation,
          radiusSmall,
        )
      : {
          borderTopLeftRadius: radiusSmall,
          borderTopRightRadius: radiusSmall,
          borderBottomLeftRadius: radiusSmall,
          borderBottomRightRadius: radiusSmall,
        };

  return (
    <Clickable
      {...(rest as object)}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onClick={isDisabled ? undefined : onClick}
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderStyle="solid"
      borderWidth={1}
      style={{
        flexDirection: 'row',
        gap: 8,
        paddingHorizontal: sizing.paddingHorizontal,
        paddingVertical: sizing.paddingVertical,
        backgroundColor: colors.backgroundColor,
        borderColor: colors.borderColor,
        opacity: isDisabled ? 0.45 : 1,
        ...attachedStyle,
        ...(style as ViewStyle),
      }}
    >
      {loading && <Spinner size="sm" color={colors.color} label="" />}
      {typeof children === 'string' ? (
        <Text
          as="span"
          style={{
            color: colors.color,
            fontSize: sizing.fontSize,
            fontWeight: '500',
            lineHeight: sizing.fontSize,
          }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Clickable>
  );
}

Button.displayName = 'Button';
