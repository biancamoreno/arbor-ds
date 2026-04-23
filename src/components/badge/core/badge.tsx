import React from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { Box, Flex } from '../../core';
import type { BadgeProps, BadgeAnchorProps } from '../interfaces';

type ToneKey = NonNullable<BadgeProps['tone']>;

function getBadgeColors(tone: ToneKey, variant: NonNullable<BadgeProps['variant']>, theme: ReturnType<typeof useTheme>) {
  const c = theme.colors;
  const map: Record<ToneKey, { bg: string; text: string; border: string }> = {
    neutral: {
      bg: variant === 'solid' ? c.text.primary : c.background.subtle,
      text: variant === 'solid' ? c.text.inverse : c.text.primary,
      border: variant === 'solid' ? c.text.primary : c.border.subtle,
    },
    brand: {
      bg: variant === 'solid' ? c.brand.base : c.brand.subtle,
      text: variant === 'solid' ? c.text.inverse : c.brand.strong,
      border: variant === 'solid' ? c.brand.base : c.brand.soft,
    },
    success: {
      bg: variant === 'solid' ? c.feedback.success.base : c.feedback.success.subtle,
      text: variant === 'solid' ? c.text.inverse : c.feedback.success.strong,
      border: variant === 'solid' ? c.feedback.success.base : c.feedback.success.subtle,
    },
    warning: {
      bg: variant === 'solid' ? c.feedback.warning.base : c.feedback.warning.subtle,
      text: variant === 'solid' ? c.text.inverse : c.feedback.warning.strong,
      border: variant === 'solid' ? c.feedback.warning.base : c.feedback.warning.subtle,
    },
    critical: {
      bg: variant === 'solid' ? c.feedback.critical.base : c.feedback.critical.subtle,
      text: variant === 'solid' ? c.text.inverse : c.feedback.critical.strong,
      border: variant === 'solid' ? c.feedback.critical.base : c.feedback.critical.subtle,
    },
    info: {
      bg: variant === 'solid' ? c.status.info : 'transparent',
      text: variant === 'solid' ? c.text.inverse : c.status.info,
      border: c.status.info,
    },
  };
  return map[tone];
}

function BadgeRoot({ children, tone = 'neutral', variant = 'subtle', size = 'md', style, ...props }: BadgeProps) {
  const theme = useTheme();
  const colors = getBadgeColors(tone, variant, theme);
  const padding = size === 'sm' ? '2px 6px' : '3px 8px';
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
      fontWeight="medium"
      style={{
        padding,
        fontSize,
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
        backgroundColor: colors.bg,
        color: colors.text,
        borderColor: colors.border,
        ...style,
      }}
    >
      {children}
    </Flex>
  );
}

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

export const Badge = Object.assign(BadgeRoot, {
  Root: BadgeRoot,
  Anchor: BadgeAnchor,
});
