import { Clickable } from '../../core';
import { transition } from '../../../foundations';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { getTagColors } from '../internal';
import type { TagProps } from '../interfaces';

function TagComponent({ children, tone = 'neutral', selected = false, disabled, onClick, className, style }: TagProps) {
  const theme = useTheme();
  const colors = getTagColors(theme, selected, tone);

  return (
    <Clickable
      as="button"
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={className}
      style={style}
      display="inline-flex"
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
      color={colors.color}
      fontWeight="medium"
      fontSize="xsmall"
      cursor={disabled ? 'not-allowed' : 'pointer'}
      transition={transition(['background-color', 'border-color', 'color'], 'fast')}
      _focusVisible={{ outlineColor: 'focus.ring', outlineWidth: '2px', outlineStyle: 'solid', outlineOffset: '2px' }}
    >
      {children}
    </Clickable>
  );
}

TagComponent.displayName = 'Tag';

/**
 * @platform shared
 *
 * Pílula clicável simples — variante elementar do `Chip`. Aceita o conjunto
 * canônico `FeedbackTone` (RFC-0032) e `selected` (alterna preenchimento
 * sólido vs. outline). Diferente de `Chip`, não é compound: o conteúdo é
 * flat. Use para tags filtráveis em listas, badges de status interativos ou
 * pílulas de seleção simples. Web expõe `aria-pressed={selected}`; native
 * expõe `accessibilityState.selected`.
 *
 * @see {@link TagProps}
 */
export const Tag = TagComponent;
