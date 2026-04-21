import { useState, useEffect, type CSSProperties } from 'react';
import { Icon } from '../../core';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { usePrefersReducedMotion } from '../../../ecosystem/styled-system/system/hooks/use-prefers-reduced-motion';
import { transition } from '../../../ecosystem/utils/functions/transition';
import type { FloatingActionButtonProps } from '../interfaces/FabProps';

const SIZE_MAP = { sm: 40, md: 56, lg: 72 } as const;
const ICON_SIZE_MAP = { sm: 16, md: 20, lg: 24 } as const;
const FAB_Z_INDEX = 900;

export function FloatingActionButton({
  icon,
  label,
  size = 'md',
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
          zIndex: FAB_Z_INDEX,
        };

  const variantMap = {
    primary: { bg: theme.colors.interactive.default, fg: theme.colors.text.inverse, border: 'none' },
    secondary: { bg: theme.colors.brand.subtle, fg: theme.colors.text.primary, border: 'none' },
    surface: {
      bg: theme.colors.surface.default,
      fg: theme.colors.text.primary,
      border: `1px solid ${theme.colors.border.default}`,
    },
  };

  const { bg, fg, border } = variantMap[variant];

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
    <button
      type="button"
      aria-label={label || ariaLabel}
      disabled={disabled}
      onClick={disabled ? undefined : onPress}
      style={{
        ...positionStyle,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isExtended ? 8 : 0,
        width: isExtended ? 'auto' : dim,
        height: dim,
        minWidth: dim,
        paddingInline: isExtended ? 16 : 0,
        borderRadius: 1000,
        backgroundColor: bg,
        color: fg,
        border,
        boxShadow: '0 8px 32px rgba(0,0,0,0.20)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        outline: 'none',
        fontFamily: 'inherit',
        ...animStyle,
      }}
    >
      <Icon name={icon} size={iconSize} color={fg} decorative />
      {isExtended && (
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            lineHeight: 1,
            color: fg,
            transition: transition(['opacity'], 'fast'),
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
      )}
    </button>
  );
}
