import React from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { Box, Flex } from '../../core';
import { getFeedbackToneColor, type FeedbackTone } from '../../../foundations';
import type { BadgeProps, BadgeAnchorProps } from '../interfaces';

function getBadgeColors(
  tone: FeedbackTone,
  variant: NonNullable<BadgeProps['variant']>,
  theme: ReturnType<typeof useTheme>,
) {
  const isSolid = variant === 'solid';
  const bg = getFeedbackToneColor(theme, tone, isSolid ? 'base' : 'subtle');
  const text = isSolid ? theme.colors.text.inverse : getFeedbackToneColor(theme, tone, 'strong');
  const border = bg;
  return { bg, text, border };
}

function BadgeRoot({ children, tone = 'neutral', variant = 'subtle', size = 'medium', style, ...props }: BadgeProps) {
  const theme = useTheme();
  const colors = getBadgeColors(tone, variant, theme);
  const padding = size === 'small' ? '2px 6px' : '3px 8px';
  const fontSize = theme.fontSizes.xsmall;

  return (
    <Flex
      as="span"
      {...props}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      gap="4px"
      borderRadius="full"
      borderWidth={1}
      borderStyle="solid"
      backgroundColor={colors.bg}
      color={colors.text}
      borderColor={colors.border}
      fontWeight="medium"
      style={{
        padding,
        fontSize,
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </Flex>
  );
}

BadgeRoot.displayName = 'Badge';

function BadgeAnchor({ children, badge, placement = 'top-right', style, ...props }: BadgeAnchorProps) {
  const placementStyle: Record<NonNullable<BadgeAnchorProps['placement']>, React.CSSProperties> = {
    'top-right': { top: 0, right: 0, transform: 'translate(50%, -50%)' },
    'top-left': { top: 0, left: 0, transform: 'translate(-50%, -50%)' },
    'bottom-right': { bottom: 0, right: 0, transform: 'translate(50%, 50%)' },
    'bottom-left': { bottom: 0, left: 0, transform: 'translate(-50%, 50%)' },
  };

  return (
    <Box
      as="span"
      {...props}
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
 * @platform shared
 *
 * Compound de badge — pequeno indicador numérico/textual. Standalone exibe
 * apenas o conteúdo; junto com `Badge.Anchor` posiciona-se sobreposto a um
 * elemento âncora (ícone, avatar). `Badge.Root` controla `tone`, `variant`
 * (`solid`/`subtle`) e `size`.
 *
 * @example
 * // Badge sobre um avatar:
 * <Badge.Anchor>
 *   <Avatar><Avatar.Image src={url} /></Avatar>
 *   <Badge tone="critical">3</Badge>
 * </Badge.Anchor>
 *
 * @see {@link BadgeRootProps}
 */
export const Badge = Object.assign(BadgeRoot, {
  Root: BadgeRoot,
  Anchor: BadgeAnchor,
});
