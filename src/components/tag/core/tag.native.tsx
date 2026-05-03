import { Clickable, Text } from '../../core';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { getTagColors } from '../internal';
import type { TagProps } from '../interfaces';

/**
 * @platform native-ready
 *
 * Tag nativo: `Clickable.native` com `accessibilityRole="button"` +
 * `accessibilityState={{ selected, disabled }}`. Children sempre envoltos em
 * `<Text>` (View não renderiza strings em RN).
 */

/**
 * @platform native
 *
 * `Tag` em React Native — `Clickable.native` com mesmo modelo visual do web.
 * Aceita o conjunto canônico `FeedbackTone` (RFC-0032) e `selected`
 * (preenchimento sólido vs. outline). `disabled` bloqueia o press e propaga
 * em `accessibilityState`.
 *
 * @see {@link TagProps}
 */
export function Tag({ children, tone = 'neutral', selected = false, disabled, onClick, className, style }: TagProps) {
  const theme = useTheme();
  const colors = getTagColors(theme, selected, tone);

  return (
    <Clickable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected, disabled: !!disabled }}
      disabled={disabled}
      onClick={onClick}
      className={className}
      style={style}
      display="flex"
      alignItems="center"
      justifyContent="center"
      gap="micro"
      paddingX="small"
      paddingY="micro"
      minHeight={44}
      borderRadius="full"
      borderStyle="solid"
      borderWidth="hairline"
      backgroundColor={colors.backgroundColor}
      borderColor={colors.borderColor}
      opacity={disabled ? 0.5 : 1}
    >
      <Text fontSize="xsmall" fontWeight="medium" color={colors.color}>
        {children}
      </Text>
    </Clickable>
  );
}

Tag.displayName = 'Tag';
