import React from 'react';
import { Box, Flex } from '../../core';
import { transition } from '../../../ecosystem/utils/functions';
import type { CardRootProps, CardSectionProps } from '../interfaces';

const PADDING_MAP = { none: '0', sm: '12px', md: '16px', lg: '24px' } as const;

function CardRoot({ children, variant = 'outlined', padding = 'md', style, className, ...props }: CardRootProps) {
  const extraClass =
    variant === 'hoverable'
      ? 'arbor-card-hoverable'
      : variant === 'clickable'
        ? 'arbor-card-clickable'
        : undefined;

  const variantStyle: React.CSSProperties = variant === 'elevated'
    ? { border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }
    : variant === 'flat'
      ? { border: 'none', boxShadow: 'none' }
      : variant === 'hoverable'
        ? { boxShadow: 'none', transition: transition(['transform', 'box-shadow'], 'normal', 'decelerate') }
        : variant === 'clickable'
          ? { cursor: 'pointer', boxShadow: 'none', transition: transition(['transform', 'box-shadow'], 'normal', 'decelerate') }
          : { boxShadow: 'none' };

  const useBorder = variant !== 'elevated' && variant !== 'flat';

  return (
    <Flex
      {...props}
      className={[extraClass, className].filter(Boolean).join(' ') || undefined}
      flexDirection="column"
      borderRadius="medium"
      backgroundColor="surface.default"
      overflow="hidden"
      borderWidth={useBorder ? 1 : 0}
      borderStyle={useBorder ? 'solid' : undefined}
      borderColor={useBorder ? 'border.subtle' : undefined}
      style={{ ...variantStyle, ...style }}
    >
      <Flex
        flexDirection="column"
        flex={1}
        style={{ padding: PADDING_MAP[padding] }}
      >
        {children}
      </Flex>
    </Flex>
  );
}

function CardHeader({ children, style, ...props }: CardSectionProps) {
  return (
    <Box
      {...props}
      paddingBottom="small"
      borderBottomWidth={1}
      borderBottomStyle="solid"
      borderBottomColor="border.subtle"
      marginBottom="small"
      style={style}
    >
      {children}
    </Box>
  );
}

function CardBody({ children, style, ...props }: CardSectionProps) {
  return (
    <Box {...props} flex={1} style={style}>
      {children}
    </Box>
  );
}

function CardFooter({ children, style, ...props }: CardSectionProps) {
  return (
    <Box
      {...props}
      paddingTop="small"
      borderTopWidth={1}
      borderTopStyle="solid"
      borderTopColor="border.subtle"
      marginTop="small"
      style={style}
    >
      {children}
    </Box>
  );
}

function CardMedia({ children, style, ...props }: CardSectionProps) {
  return (
    <Box
      {...props}
      overflow="hidden"
      style={{ margin: '-16px -16px 16px -16px', ...style }}
    >
      {children}
    </Box>
  );
}

export const Card = Object.assign(CardRoot, {
  Root: CardRoot,
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
  Media: CardMedia,
});
