import { useState, useEffect, type CSSProperties } from 'react';
import { Clickable, Text, Icon } from '../../core';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { usePrefersReducedMotion } from '../../../ecosystem/styled-system/system/hooks/use-prefers-reduced-motion';
import { transition } from '../../../ecosystem/utils/functions/transition';
import type { FloatingActionButtonProps } from '../interfaces/FabProps';

const SIZE_MAP = { small: 44, medium: 56, large: 72 } as const;
const ICON_SIZE_MAP = { small: 16, medium: 20, large: 24 } as const;

/**
 * @platform shared
 *
 * Floating Action Button (FAB) — botão flutuante posicionado por `position`
 * (`bottom-right` default, `bottom-left`, `bottom-center`, `none`) com `offset`
 * customizável. Quando `label` é informado vira FAB extended (ícone + texto).
 * Anima a entrada com `scale`+`opacity` (`animateOnMount`, default `true`) e
 * respeita `prefers-reduced-motion`. `aria-label` é obrigatório quando não há
 * `label` visível — em desenvolvimento, ausência dispara `console.warn`.
 *
 * @see {@link FloatingActionButtonProps}
 */
export function FloatingActionButton({
  icon,
  label,
  size = 'medium',
  variant = 'primary',
  position = 'bottom-right',
  offset,
  disabled = false,
  onPress,
  'aria-label': ariaLabel,
  animateOnMount = true,
}: FloatingActionButtonProps) {
  const theme = useTheme();
  const prefersReduced = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);

  if (process.env.NODE_ENV !== 'production' && !label && !ariaLabel) {
    console.warn('[FloatingActionButton] aria-label is required when label is not provided.');
  }

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const dim = SIZE_MAP[size];
  const iconSize = ICON_SIZE_MAP[size];
  const isExtended = !!label;

  const positionStyle: CSSProperties =
    position === 'none'
      ? {}
      : {
          position: 'fixed',
          bottom: offset?.bottom ?? 16,
          ...(position === 'bottom-left' && { left: offset?.left ?? 16 }),
          ...(position === 'bottom-right' && { right: offset?.right ?? 16 }),
          ...(position === 'bottom-center' && { left: `calc(50% - ${dim / 2}px)` }),
          zIndex: theme.zIndices.fab,
        };

  const variantTokens = {
    primary: { bg: 'interactive.default' as const, fg: 'text.inverse' as const },
    secondary: { bg: 'brand.bgElement' as const, fg: 'text.primary' as const },
    surface: { bg: 'surface.default' as const, fg: 'text.primary' as const },
  };

  const { bg, fg } = variantTokens[variant];

  const animStyle: CSSProperties =
    animateOnMount && !prefersReduced
      ? {
          transform: mounted ? 'scale(1)' : 'scale(0)',
          opacity: mounted ? 1 : 0,
          transition: mounted
            ? `${transition(['transform'], 'normal', 'decelerate')}, ${transition(['opacity'], 'fast')}`
            : 'none',
        }
      : {};

  return (
    <Clickable
      as="button"
      type="button"
      aria-label={label || ariaLabel}
      disabled={disabled}
      onClick={disabled ? undefined : onPress}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="full"
      backgroundColor={bg}
      color={fg}
      cursor={disabled ? 'not-allowed' : 'pointer'}
      opacity={disabled ? 0.5 : 1}
      outline="none"
      borderWidth={variant === 'surface' ? 1 : 0}
      borderStyle={variant === 'surface' ? 'solid' : undefined}
      borderColor={variant === 'surface' ? 'border.default' : undefined}
      boxShadow="xl"
      style={{
        ...positionStyle,
        gap: isExtended ? 8 : 0,
        width: isExtended ? 'auto' : dim,
        height: dim,
        minWidth: dim,
        paddingInline: isExtended ? 16 : 0,
        fontFamily: 'inherit',
        ...animStyle,
      }}
    >
      <Icon name={icon} size={iconSize} decorative />
      {isExtended && (
        <Text
          as="span"
          color={fg}
          whiteSpace="nowrap"
          style={{
            fontSize: 14,
            fontWeight: 500,
            lineHeight: 1,
            transition: transition(['opacity'], 'fast'),
          }}
        >
          {label}
        </Text>
      )}
    </Clickable>
  );
}

FloatingActionButton.displayName = 'FloatingActionButton';
