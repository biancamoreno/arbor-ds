import React from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { transition } from '../../../ecosystem/utils/functions';
import type { CardRootProps, CardSectionProps } from '../interfaces';

const PADDING_MAP = { none: '0', sm: '12px', md: '16px', lg: '24px' } as const;

function CardRoot({ children, variant = 'outlined', padding = 'md', style, className, ...props }: CardRootProps) {
  const theme = useTheme();

  const variantStyle: Record<NonNullable<CardRootProps['variant']>, React.CSSProperties> = {
    outlined: {
      border: `1px solid ${theme.colors.border.subtle}`,
      boxShadow: 'none',
    },
    elevated: {
      border: 'none',
      boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
    },
    flat: {
      border: 'none',
      boxShadow: 'none',
    },
    hoverable: {
      border: `1px solid ${theme.colors.border.subtle}`,
      boxShadow: 'none',
      transition: transition(['transform', 'box-shadow'], 'normal', 'decelerate'),
    },
    clickable: {
      border: `1px solid ${theme.colors.border.subtle}`,
      boxShadow: 'none',
      cursor: 'pointer',
      transition: transition(['transform', 'box-shadow'], 'normal', 'decelerate'),
    },
  };

  const extraClass =
    variant === 'hoverable'
      ? 'arbor-card-hoverable'
      : variant === 'clickable'
        ? 'arbor-card-clickable'
        : undefined;

  return (
    <div
      {...props}
      className={[extraClass, className].filter(Boolean).join(' ') || undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: theme.radii.medium,
        backgroundColor: theme.colors.surface.default,
        overflow: 'hidden',
        ...variantStyle[variant],
        ...style,
      }}
    >
      <div style={{ padding: PADDING_MAP[padding], display: 'flex', flexDirection: 'column', flex: 1 }}>
        {children}
      </div>
    </div>
  );
}

function CardHeader({ children, style, ...props }: CardSectionProps) {
  const theme = useTheme();
  return (
    <div
      {...props}
      style={{
        paddingBottom: theme.space.small,
        borderBottom: `1px solid ${theme.colors.border.subtle}`,
        marginBottom: theme.space.small,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CardBody({ children, style, ...props }: CardSectionProps) {
  return (
    <div {...props} style={{ flex: 1, ...style }}>
      {children}
    </div>
  );
}

function CardFooter({ children, style, ...props }: CardSectionProps) {
  const theme = useTheme();
  return (
    <div
      {...props}
      style={{
        paddingTop: theme.space.small,
        borderTop: `1px solid ${theme.colors.border.subtle}`,
        marginTop: theme.space.small,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CardMedia({ children, style, ...props }: CardSectionProps) {
  return (
    <div
      {...props}
      style={{
        margin: '-16px -16px 16px -16px',
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export const Card = Object.assign(CardRoot, {
  Root: CardRoot,
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
  Media: CardMedia,
});
