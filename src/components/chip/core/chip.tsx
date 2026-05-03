import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { Box, Flex, Clickable } from '../../core';
import { Icon } from '../../core';
import { transition, getFeedbackToneColor, type ArborTheme, type FeedbackTone } from '../../../foundations';
import { ChipContext, useChipContext } from '../context/chip-context';
import type { ChipRootProps, ChipLabelProps, ChipIconProps, ChipRemoveProps } from '../interfaces';

type ChipColors = {
  backgroundColor: string;
  color: string;
  borderColor: string;
};

/**
 * Pattern unificado pós-RFC-0032 (Tag-like, ajustado para variants do Chip):
 * - `filled`:   selected → bg=base/text=inverse; default → bg=subtle/text=strong.
 * - `outlined`: selected → border=base/text=base; default → border=border.default/text=text.secondary.
 * - `subtle`:   selected → bg=subtle/text=strong; default → transparente/text=text.secondary.
 *
 * Refactor mais profundo para slot recipe ficará a cargo da RFC-0033/TD-034.
 */
function getChipColors(
  theme: ArborTheme,
  variant: NonNullable<ChipRootProps['variant']>,
  tone: FeedbackTone,
  selected: boolean,
): ChipColors {
  const base = getFeedbackToneColor(theme, tone, 'base');
  const subtle = getFeedbackToneColor(theme, tone, 'subtle');
  const strong = getFeedbackToneColor(theme, tone, 'strong');

  if (variant === 'filled') {
    return selected
      ? { backgroundColor: base, color: theme.colors.text.inverse, borderColor: 'transparent' }
      : { backgroundColor: subtle, color: strong, borderColor: 'transparent' };
  }

  if (variant === 'outlined') {
    return {
      backgroundColor: 'transparent',
      color: selected ? base : theme.colors.text.secondary,
      borderColor: selected ? base : theme.colors.border.default,
    };
  }

  return {
    backgroundColor: selected ? subtle : 'transparent',
    color: selected ? strong : theme.colors.text.secondary,
    borderColor: theme.colors.border.subtle,
  };
}

function ChipRoot({
  children,
  variant = 'subtle',
  size = 'md',
  selected = false,
  disabled = false,
  tone = 'neutral',
  onClick,
  className,
  style,
}: ChipRootProps) {
  const theme = useTheme();
  const colors = getChipColors(theme, variant, tone, selected);
  const paddingX = size === 'sm' ? 'micro' : 'small';
  const paddingY = size === 'sm' ? 'nano' : 'micro';
  const fontSize = size === 'sm' ? 'xsmall' : 'small';

  return (
    <ChipContext.Provider value={{ variant, tone, selected, disabled }}>
      <Flex
        as="span"
        onClick={onClick}
        className={className}
        style={{ whiteSpace: 'nowrap', ...style }}
        display="inline-flex"
        alignItems="center"
        gap="nano"
        paddingX={paddingX}
        paddingY={paddingY}
        borderRadius="full"
        borderWidth="hairline"
        borderStyle="solid"
        backgroundColor={colors.backgroundColor}
        color={colors.color}
        borderColor={colors.borderColor}
        fontWeight="medium"
        fontSize={fontSize}
        cursor={disabled ? 'not-allowed' : 'default'}
        opacity={disabled ? theme.opacity.medium : 1}
      >
        {children}
      </Flex>
    </ChipContext.Provider>
  );
}

function ChipLabel({ children, className, style }: ChipLabelProps) {
  return (
    <Box as="span" className={className} style={style} lineHeight="inherit">
      {children}
    </Box>
  );
}

function ChipIcon({ children, className, style }: ChipIconProps) {
  return (
    <Flex
      as="span"
      aria-hidden="true"
      className={className}
      style={style}
      display="inline-flex"
      alignItems="center"
      flexShrink={0}
    >
      {children}
    </Flex>
  );
}

function ChipRemove({ label = 'Remover', onClick, className, style }: ChipRemoveProps) {
  const { disabled } = useChipContext();

  return (
    <Clickable
      as="button"
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={className}
      style={style}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      minWidth={44}
      minHeight={44}
      width={14}
      height={14}
      flexShrink={0}
      cursor={disabled ? 'not-allowed' : 'pointer'}
      color="inherit"
      borderRadius="full"
      padding={0}
      borderWidth={0}
      backgroundColor="transparent"
      marginLeft="micro"
      transition={transition(['background-color', 'color'], 'fast')}
      _hover={{ backgroundColor: 'background.interactive' }}
      _focusVisible={{ outlineColor: 'focus.ring', outlineWidth: '2px', outlineStyle: 'solid', outlineOffset: '2px' }}
    >
      <Icon name="X" size="xsmall" />
    </Clickable>
  );
}

ChipRoot.displayName = 'Chip.Root';
ChipLabel.displayName = 'Chip.Label';
ChipIcon.displayName = 'Chip.Icon';
ChipRemove.displayName = 'Chip.Remove';

/**
 * @platform shared
 *
 * Compound de chip — pílula compacta para filtros, tags selecionáveis ou
 * pequenas ações. `Chip.Root` controla `tone`, `size`, `selected` e
 * `disabled`; slots `Label`, `Icon` e `Remove` (botão `X` clicável).
 * Diferente de `Tag`, `Chip` é tipicamente interativo (selecionável ou
 * removível) — `selected` é por enquanto somente visual; ver RFC Chip-Interativo
 * para a discussão sobre tornar `Chip.Root` focável quando selectable.
 *
 * @example
 * <Chip selected={isActive} onClick={toggle}>
 *   <Chip.Icon><Icon name="Tag" /></Chip.Icon>
 *   <Chip.Label>Em estoque</Chip.Label>
 *   <Chip.Remove onClick={onRemove} />
 * </Chip>
 *
 * @see {@link ChipRootProps}
 */
export const Chip = Object.assign(ChipRoot, {
  Root: ChipRoot,
  Label: ChipLabel,
  Icon: ChipIcon,
  Remove: ChipRemove,
});
