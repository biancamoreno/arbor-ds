import type { CSSProperties } from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import type { TagProps } from '../interfaces';

function getTagStyle(selected: boolean, tone: TagProps['tone'], theme: ReturnType<typeof useTheme>): CSSProperties {
  if (tone === 'brand') {
    return selected
      ? {
          backgroundColor: theme.colors.brand.base,
          borderColor: theme.colors.brand.base,
          color: theme.colors.text.inverse,
        }
      : {
          backgroundColor: theme.colors.brand.subtle,
          borderColor: theme.colors.brand.soft,
          color: theme.colors.brand.strong,
        };
  }

  return selected
    ? {
        backgroundColor: theme.colors.text.primary,
        borderColor: theme.colors.text.primary,
        color: theme.colors.text.inverse,
      }
    : {
        backgroundColor: theme.colors.surface.default,
        borderColor: theme.colors.border.default,
        color: theme.colors.text.primary,
      };
}

export function Tag({ children, tone = 'neutral', selected = false, style, ...props }: TagProps) {
  const theme = useTheme();

  return (
    <button
      type="button"
      {...props}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        borderRadius: theme.radii.full,
        borderStyle: 'solid',
        borderWidth: '1px',
        padding: '6px 12px',
        fontSize: theme.fontSizes.xsmall,
        fontWeight: theme.fontWeights.medium,
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        ...getTagStyle(selected, tone, theme),
        ...style,
      }}
    >
      {children}
    </button>
  );
}
