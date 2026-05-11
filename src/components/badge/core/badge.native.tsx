import { Box, Text } from '../../core';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import type { BadgeProps, BadgeAnchorProps } from '../interfaces';

type BadgeSlots = 'root' | 'label' | 'icon';

/**
 * @platform native
 *
 * Indicador denso textual/numérico em React Native. `Box` consome a slot
 * recipe `badge` (`tone × variant × size`) e envolve um `<Text>` cuja cor é
 * herdada do `rootStyles.color` aplicado pela recipe. Sem `Clickable`, sem
 * `accessibilityRole='button'`.
 *
 * Para indicador clicável/selecionável, use `Chip` (RFC-0033).
 *
 * @see {@link BadgeProps}
 */
function BadgeRoot({
  children,
  icon,
  tone = 'neutral',
  variant = 'solid',
  size = 'medium',
  className,
  style,
}: BadgeProps) {
  const slots = useSlotRecipe<BadgeSlots>('badge', { tone, variant, size });
  const rootStyles = (slots.root ?? {}) as Record<string, unknown>;
  const textColor = rootStyles.color as string | undefined;
  const hasIcon = icon != null;
  const hasChildren = children != null && children !== '';

  return (
    <Box className={className} style={style} {...slots.root}>
      {hasIcon && <Box {...slots.icon}>{icon}</Box>}
      {hasChildren && <Text color={textColor}>{children}</Text>}
    </Box>
  );
}

BadgeRoot.displayName = 'Badge';

function BadgeAnchor({ children, badge, placement = 'top-right', style, className }: BadgeAnchorProps) {
  const placementStyle: Record<NonNullable<BadgeAnchorProps['placement']>, Record<string, unknown>> = {
    'top-right':    { top: -8, right: -8 },
    'top-left':     { top: -8, left: -8 },
    'bottom-right': { bottom: -8, right: -8 },
    'bottom-left':  { bottom: -8, left: -8 },
  };

  return (
    <Box className={className} position="relative" display="flex" style={style}>
      {children}
      <Box position="absolute" style={placementStyle[placement]}>{badge}</Box>
    </Box>
  );
}

BadgeAnchor.displayName = 'Badge.Anchor';

export const Badge = Object.assign(BadgeRoot, {
  Root: BadgeRoot,
  Anchor: BadgeAnchor,
});
