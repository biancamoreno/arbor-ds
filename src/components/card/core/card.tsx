import React from 'react';
import { Box, Flex } from '../../core';
import { transition } from '../../../ecosystem/utils/functions';
import type { CardRootProps, CardSectionProps } from '../interfaces';

const PADDING_TOKEN_MAP = { none: 'none', small: 'tiny', medium: 'small', large: 'large' } as const;

function CardRoot({ children, variant = 'outlined', padding = 'medium', style, className, ...props }: CardRootProps) {
  const extraClass =
    variant === 'hoverable'
      ? 'arbor-card-hoverable'
      : variant === 'clickable'
        ? 'arbor-card-clickable'
        : undefined;

  const shadowToken = variant === 'elevated' ? 'md' : 'none';
  const variantStyle: React.CSSProperties =
    variant === 'hoverable'
      ? { transition: transition(['transform', 'box-shadow'], 'normal', 'decelerate') }
      : variant === 'clickable'
        ? { cursor: 'pointer', transition: transition(['transform', 'box-shadow'], 'normal', 'decelerate') }
        : {};

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
      boxShadow={shadowToken}
      style={{ ...variantStyle, ...style }}
    >
      <Flex
        flexDirection="column"
        flex={1}
        padding={PADDING_TOKEN_MAP[padding]}
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
      borderStyle="solid"
      borderBottomWidth={1}
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
      borderStyle="solid"
      borderTopWidth={1}
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

/**
 * @platform shared
 *
 * Compound de cartão. `Card.Root` aceita `variant` para controlar a aparência
 * (`outlined`/`elevated`/`flat`/`hoverable`/`clickable`). Slots disponíveis:
 * `Header`, `Body`, `Footer`, `Media`. Use `variant="clickable"` apenas com
 * `onClick` + `aria-label` definidos.
 *
 * @example
 * <Card variant="elevated">
 *   <Card.Media><Image src={url} alt="" /></Card.Media>
 *   <Card.Header>Plano Plus</Card.Header>
 *   <Card.Body>Recursos avançados…</Card.Body>
 *   <Card.Footer><Button>Assinar</Button></Card.Footer>
 * </Card>
 *
 * @see {@link CardRootProps}
 */
export const Card = Object.assign(CardRoot, {
  Root: CardRoot,
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
  Media: CardMedia,
});
