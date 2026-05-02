import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { Clickable, Text } from '../../core';
import type { TagProps } from '../interfaces';

/**
 * @platform native-ready
 *
 * Tag nativo: `Clickable.native` com `accessibilityRole="button"` +
 * `accessibilityState={{ selected, disabled }}`. Children sempre envoltos em `<Text>`
 * (View não renderiza strings em RN).
 */

function getTagColors(selected: boolean, tone: TagProps['tone'], theme: ReturnType<typeof useTheme>) {
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

/**
 * @platform native
 *
 * `Tag` em React Native — `Clickable.native` com mesmo modelo visual do web.
 * Suporta `tone` (`neutral`/`brand`) e `selected` (preenchimento sólido vs.
 * outline). `disabled` bloqueia o press e propaga em `accessibilityState`.
 *
 * @see {@link TagProps}
 */
export function Tag({ children, tone = 'neutral', selected = false, disabled, style, ...props }: TagProps) {
  const theme = useTheme();
  const colors = getTagColors(selected, tone, theme);

  return (
    <Clickable
      {...(props as object)}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected, disabled: !!disabled }}
      disabled={disabled}
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="full"
      borderStyle="solid"
      borderWidth={1}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: colors.backgroundColor,
        borderColor: colors.borderColor,
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      <Text
        as="span"
        style={{
          color: colors.color,
          fontSize: 12,
          fontWeight: '500',
        }}
      >
        {children}
      </Text>
    </Clickable>
  );
}

Tag.displayName = 'Tag';
