import { useCallback, type KeyboardEvent } from 'react';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { useControllableState } from '../../../ecosystem/primitives';
import { Box, Flex, Clickable } from '../../core';
import { Icon } from '../../core';
import { ChipContext, useChipContext } from '../context/chip-context';
import type { ChipRootProps, ChipLabelProps, ChipIconProps, ChipRemoveProps } from '../interfaces';

type ChipSlots = 'root' | 'label' | 'icon' | 'remove';

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

  const slots = useSlotRecipe<ChipSlots>('chip', {
    size,
    selectable: selectable ? 'true' : 'false',
    variant,
    tone,
    selected: selected ? 'true' : 'false',
    disabled: disabled ? 'true' : 'false',
  });

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
          {...slots.root}
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
        {...slots.root}
      >
        {children}
      </Flex>
    </ChipContext.Provider>
  );
}

function ChipLabel({ children, className, style }: ChipLabelProps) {
  const slots = useSlotRecipe<ChipSlots>('chip');
  return (
    <Box as="span" className={className} style={style} {...slots.label}>
      {children}
    </Box>
  );
}

function ChipIcon({ children, className, style }: ChipIconProps) {
  const slots = useSlotRecipe<ChipSlots>('chip');
  return (
    <Flex
      as="span"
      aria-hidden="true"
      className={className}
      style={style}
      {...slots.icon}
    >
      {children}
    </Flex>
  );
}

function ChipRemove({ label = 'Remover', onClick, className, style }: ChipRemoveProps) {
  const { disabled, selectable } = useChipContext();
  const slots = useSlotRecipe<ChipSlots>('chip', {
    selectable: selectable ? 'true' : 'false',
    disabled: disabled ? 'true' : 'false',
  });

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
        {...slots.remove}
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
      {...slots.remove}
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
 * - **Interativo:** `<Chip selectable selected onSelectedChange={...}>`
 *   vira botão focável (`<button>`) com `aria-pressed` + ativação por
 *   Space/Enter. Cobre filtros toggleable e seleção múltipla.
 *
 * `Chip.Remove` ramifica anatomia automaticamente: em modo decorativo é
 * `<button>`; em modo selectable vira `<span role="button">` para evitar
 * nested-button no DOM.
 *
 * Anatomia, cor e estados (`variant × tone × selected × disabled`)
 * resolvidos pela slot recipe `chip` (RFC-0033 / TD-034) — override completo
 * via `createTheme({ recipes: { chip: ... }, components: { chip: ... } })`.
 *
 * @see {@link ChipRootProps}
 */
export const Chip = Object.assign(ChipRoot, {
  Root: ChipRoot,
  Label: ChipLabel,
  Icon: ChipIcon,
  Remove: ChipRemove,
});
