import React from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { Icon } from '../../core';
import { ChipContext, useChipContext } from '../context/chip-context';
import type { ChipRootProps, ChipLabelProps, ChipIconProps, ChipRemoveProps } from '../interfaces';

function getChipStyle(
  variant: ChipRootProps['variant'],
  tone: ChipRootProps['tone'],
  selected: boolean,
  theme: ReturnType<typeof useTheme>
): React.CSSProperties {
  const c = theme.colors;
  const isBrand = tone === 'brand';

  if (variant === 'filled') {
    return selected
      ? {
          backgroundColor: isBrand ? c.brand.base : c.text.primary,
          color: c.text.inverse,
          borderColor: 'transparent',
        }
      : {
          backgroundColor: isBrand ? c.brand.subtle : c.background.subtle,
          color: isBrand ? c.brand.strong : c.text.primary,
          borderColor: 'transparent',
        };
  }

  if (variant === 'outlined') {
    return {
      backgroundColor: 'transparent',
      color: selected ? (isBrand ? c.brand.base : c.text.primary) : c.text.secondary,
      borderColor: selected ? (isBrand ? c.brand.base : c.text.primary) : c.border.default,
    };
  }

  // subtle (default)
  return {
    backgroundColor: selected ? (isBrand ? c.brand.subtle : c.background.interactive) : 'transparent',
    color: selected ? (isBrand ? c.brand.strong : c.text.primary) : c.text.secondary,
    borderColor: c.border.subtle,
  };
}

function ChipRoot({
  children,
  variant = 'subtle',
  size = 'md',
  selected = false,
  disabled = false,
  tone = 'neutral',
  style,
  ...props
}: ChipRootProps) {
  const theme = useTheme();
  const chipStyle = getChipStyle(variant, tone, selected, theme);
  const padding = size === 'sm' ? '3px 8px' : '5px 12px';
  const fontSize = size === 'sm' ? theme.fontSizes.xsmall : theme.fontSizes.sm;

  return (
    <ChipContext.Provider value={{ variant, tone, selected, disabled }}>
      <span
        {...props}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          borderRadius: theme.radii.full,
          borderWidth: '1px',
          borderStyle: 'solid',
          padding,
          fontSize,
          fontWeight: theme.fontWeights.medium,
          lineHeight: 1.4,
          whiteSpace: 'nowrap',
          cursor: disabled ? 'not-allowed' : 'default',
          opacity: disabled ? Number(theme.opacity.medium) : 1,
          ...chipStyle,
          ...style,
        }}
      >
        {children}
      </span>
    </ChipContext.Provider>
  );
}

function ChipLabel({ children, style, ...props }: ChipLabelProps) {
  return (
    <span {...props} style={{ lineHeight: 'inherit', ...style }}>
      {children}
    </span>
  );
}

function ChipIcon({ children, style, ...props }: ChipIconProps) {
  return (
    <span
      aria-hidden="true"
      {...props}
      style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0, ...style }}
    >
      {children}
    </span>
  );
}

function ChipRemove({ label = 'Remover', style, ...props }: ChipRemoveProps) {
  const theme = useTheme();
  const { disabled } = useChipContext();

  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      {...props}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '14px',
        height: '14px',
        padding: 0,
        border: 'none',
        background: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: 'inherit',
        borderRadius: theme.radii.full,
        flexShrink: 0,
        ...style,
      }}
    >
      <Icon name="X" size={12} aria-hidden="true" />
    </button>
  );
}

export const Chip = Object.assign(ChipRoot, {
  Root: ChipRoot,
  Label: ChipLabel,
  Icon: ChipIcon,
  Remove: ChipRemove,
});
