import React from 'react';
import { Box } from '../../core';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import type { BadgeProps, BadgeAnchorProps } from '../interfaces';

type BadgeSlots = 'root' | 'label' | 'icon';

/**
 * @platform shared
 *
 * Indicador denso textual/numérico. Renderiza um `<span>` estilizado pela slot
 * recipe `badge` (`tone × variant × size`). Anatomia e cor resolvidas via
 * tokens (`tokens/components/badge.ts`) — produto consumidor consegue override
 * completo via `createTheme({ recipes: { badge: ... }, components: { badge: ... } })`.
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
  const hasIcon = icon != null;
  const hasChildren = children != null && children !== '';

  return (
    <Box as="span" className={className} style={style} {...slots.root}>
      {hasIcon && <Box as="span" {...slots.icon}>{icon}</Box>}
      {hasChildren && (hasIcon
        ? <Box as="span" {...slots.label}>{children}</Box>
        : children)}
    </Box>
  );
}

BadgeRoot.displayName = 'Badge';

function BadgeAnchor({ children, badge, placement = 'top-right', style, className }: BadgeAnchorProps) {
  const placementStyle: Record<NonNullable<BadgeAnchorProps['placement']>, React.CSSProperties> = {
    'top-right':    { top: 0,    right: 0, transform: 'translate(50%, -50%)' },
    'top-left':     { top: 0,    left: 0,  transform: 'translate(-50%, -50%)' },
    'bottom-right': { bottom: 0, right: 0, transform: 'translate(50%, 50%)' },
    'bottom-left':  { bottom: 0, left: 0,  transform: 'translate(-50%, 50%)' },
  };

  return (
    <Box
      as="span"
      className={className}
      position="relative"
      display="inline-flex"
      style={style}
    >
      {children}
      <Box as="span" position="absolute" style={placementStyle[placement]}>{badge}</Box>
    </Box>
  );
}

BadgeAnchor.displayName = 'Badge.Anchor';

/**
 * Compound de badge.
 *
 * @example
 * // Badge sobre um avatar:
 * <Badge.Anchor badge={<Badge tone="critical" size="small">3</Badge>}>
 *   <Avatar><Avatar.Image src={url} /></Avatar>
 * </Badge.Anchor>
 *
 * @see {@link BadgeProps}
 */
export const Badge = Object.assign(BadgeRoot, {
  Root: BadgeRoot,
  Anchor: BadgeAnchor,
});
