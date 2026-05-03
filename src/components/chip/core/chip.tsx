import { useCallback, type KeyboardEvent } from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useControllableState } from '../../../ecosystem/primitives';
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
 * Refactor mais profundo para slot recipe ficará a cargo da TD-034.
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

function ChipRoot(props: ChipRootProps) {
  const {
    children,
    variant = 'subtle',
    size = 'medium',
    disabled = false,
    tone = 'neutral',
    className,
    style,
  } = props;
  const selectable = props.selectable === true;

  const [selected, setSelected] = useControllableState({
    value: selectable ? props.selected : false,
    defaultValue: selectable ? props.defaultSelected ?? false : false,
    onChange: selectable ? props.onSelectedChange : undefined,
  });

  const theme = useTheme();
  const colors = getChipColors(theme, variant, tone, selected);
  const paddingX = size === 'small' ? 'micro' : 'small';
  const paddingY = size === 'small' ? 'nano' : 'micro';
  const fontSize = size === 'small' ? 'xsmall' : 'small';

  const handleToggle = useCallback(() => {
    if (disabled) return;
    setSelected(!selected);
  }, [disabled, selected, setSelected]);

  const contextValue = {
    variant,
    tone,
    selected,
    disabled,
    selectable,
  };

  if (selectable) {
    return (
      <ChipContext.Provider value={contextValue}>
        <Clickable
          as="button"
          type="button"
          aria-pressed={selected}
          disabled={disabled}
          onClick={handleToggle}
          className={className}
          style={{ whiteSpace: 'nowrap', ...style }}
          display="inline-flex"
          alignItems="center"
          gap="nano"
          paddingX={paddingX}
          paddingY={paddingY}
          minHeight={32}
          borderRadius="full"
          borderWidth="hairline"
          borderStyle="solid"
          backgroundColor={colors.backgroundColor}
          color={colors.color}
          borderColor={colors.borderColor}
          fontWeight="medium"
          fontSize={fontSize}
          cursor={disabled ? 'not-allowed' : 'pointer'}
          opacity={disabled ? theme.opacity.medium : 1}
          transition={transition(['background-color', 'border-color', 'color'], 'fast')}
          _focusVisible={{ outlineColor: 'focus.ring', outlineWidth: '2px', outlineStyle: 'solid', outlineOffset: '2px' }}
        >
          {children}
        </Clickable>
      </ChipContext.Provider>
    );
  }

  return (
    <ChipContext.Provider value={contextValue}>
      <Flex
        as="span"
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
  const { disabled, selectable } = useChipContext();

  // Em modo selectable, o Root é <button>. Para evitar nested-button (HTML
  // inválido), Remove vira <span role="button"> com listener Space/Enter próprio.
  if (selectable) {
    const handleClick = (event: React.MouseEvent | React.KeyboardEvent) => {
      event.stopPropagation();
      if (disabled) return;
      onClick?.();
    };
    const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
      if (disabled) return;
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        handleClick(event);
      }
    };
    return (
      <Box
        as="span"
        role="button"
        aria-label={label}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        onClick={(event: React.MouseEvent<HTMLSpanElement>) => handleClick(event)}
        onKeyDown={handleKeyDown}
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
        backgroundColor="transparent"
        marginLeft="micro"
        transition={transition(['background-color', 'color'], 'fast')}
        _hover={{ backgroundColor: 'background.interactive' }}
        _focusVisible={{ outlineColor: 'focus.ring', outlineWidth: '2px', outlineStyle: 'solid', outlineOffset: '2px' }}
      >
        <Icon name="X" size="xsmall" decorative />
      </Box>
    );
  }

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
      <Icon name="X" size="xsmall" decorative />
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
 * pequenas ações. **Discriminated union** controla o contrato:
 *
 * - **Decorativo (default):** `<Chip>` renderiza `<span>` puramente visual.
 *   Sem foco, sem teclado, sem ARIA de interação.
 *
 *   ```tsx
 *   <Chip variant="filled" tone="warning">
 *     <Chip.Icon><Icon name="Bell" /></Chip.Icon>
 *     <Chip.Label>Pendente</Chip.Label>
 *   </Chip>
 *   ```
 *
 * - **Interativo:** `<Chip selectable selected onSelectedChange={...}>`
 *   vira botão focável (`<button>`) com `aria-pressed` + ativação por
 *   Space/Enter. Cobre filtros toggleable e seleção múltipla.
 *
 *   ```tsx
 *   <Chip selectable selected={isActive} onSelectedChange={setIsActive}>
 *     <Chip.Label>Em estoque</Chip.Label>
 *     <Chip.Remove onClick={onRemove} />
 *   </Chip>
 *   ```
 *
 * `Chip.Remove` ramifica anatomia automaticamente: em modo decorativo é
 * `<button>`; em modo selectable vira `<span role="button">` para evitar
 * nested-button no DOM.
 *
 * @see {@link ChipRootProps}
 */
export const Chip = Object.assign(ChipRoot, {
  Root: ChipRoot,
  Label: ChipLabel,
  Icon: ChipIcon,
  Remove: ChipRemove,
});
