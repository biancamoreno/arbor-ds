import type { CSSProperties } from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { Clickable } from '../../core';
import type { TagProps } from '../interfaces';

function getTagStyle(selected: boolean, tone: TagProps['tone'], theme: ReturnType<typeof useTheme>): CSSProperties {
  if (tone === 'brand') {
    return selected
      ? { backgroundColor: theme.colors.brand.base, borderColor: theme.colors.brand.base, color: theme.colors.text.inverse }
      : { backgroundColor: theme.colors.brand.subtle, borderColor: theme.colors.brand.soft, color: theme.colors.brand.strong };
  }

  return selected
    ? { backgroundColor: theme.colors.text.primary, borderColor: theme.colors.text.primary, color: theme.colors.text.inverse }
    : { backgroundColor: theme.colors.surface.default, borderColor: theme.colors.border.default, color: theme.colors.text.primary };
}

function TagComponent({ children, tone = 'neutral', selected = false, style, ...props }: TagProps) {
  const theme = useTheme();

  return (
    <Clickable
      as="button"
      type="button"
      {...props}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      gap="6px"
      borderRadius="full"
      borderStyle="solid"
      borderWidth={1}
      fontWeight="medium"
      cursor={props.disabled ? 'not-allowed' : 'pointer'}
      style={{
        padding: '6px 12px',
        fontSize: theme.fontSizes.xsmall,
        ...getTagStyle(selected, tone, theme),
        ...style,
      }}
    >
      {children}
    </Clickable>
  );
}

TagComponent.displayName = 'Tag';
export const Tag = TagComponent;
