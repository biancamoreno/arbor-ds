import { createContext, useCallback, useContext, useId, useMemo } from 'react';
import { Box, Flex, Text, Clickable, Icon } from '../../core';
import { useControllableState } from '../../../ecosystem/primitives';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import type { StyleProps } from '../../../ecosystem/styled-system/system/system.types';
import type {
  AccordionRootProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
} from '../interfaces';

type AccordionSlots = 'root' | 'item' | 'trigger' | 'triggerIcon' | 'content' | 'contentInner';
type AccordionSlotMap = Partial<Record<AccordionSlots, StyleProps>>;

interface AccordionNativeContextValue {
  openValues: string[];
  toggle: (value: string) => void;
}

interface AccordionItemNativeContextValue {
  value: string;
  open: boolean;
  disabled: boolean;
  triggerId: string;
}

const AccordionNativeContext = createContext<AccordionNativeContextValue>({
  openValues: [],
  toggle: () => {},
});

const AccordionItemNativeContext = createContext<AccordionItemNativeContextValue>({
  value: '',
  open: false,
  disabled: false,
  triggerId: '',
});

const ItemSlotsContext = createContext<AccordionSlotMap>({});

const useAccordionNativeContext = () => useContext(AccordionNativeContext);
const useAccordionItemNativeContext = () => useContext(AccordionItemNativeContext);

function AccordionRoot(props: AccordionRootProps) {
  const { children, className, style } = props;
  const type = props.type ?? 'single';
  const isMultiple = type === 'multiple';
  const collapsible = isMultiple ? true : (props as { collapsible?: boolean }).collapsible ?? true;

  const valueProp = (props as { value?: string | string[] }).value;
  const defaultValueProp = (props as { defaultValue?: string | string[] }).defaultValue;

  const normalize = (v: string | string[] | undefined): string[] => {
    if (v === undefined) return [];
    return Array.isArray(v) ? v : v === '' ? [] : [v];
  };

  const onValueChangeRaw = (
    props as { onValueChange?: (value: string | string[]) => void }
  ).onValueChange;

  const [openValues, setOpenValues] = useControllableState<string[]>({
    value: valueProp !== undefined ? normalize(valueProp) : undefined,
    defaultValue: normalize(defaultValueProp),
    onChange: (next) => {
      if (!onValueChangeRaw) return;
      onValueChangeRaw(isMultiple ? next : (next[0] ?? ''));
    },
  });

  const toggle = useCallback(
    (value: string) => {
      const isCurrentlyOpen = openValues.includes(value);
      if (isMultiple) {
        setOpenValues(isCurrentlyOpen ? openValues.filter((v) => v !== value) : [...openValues, value]);
        return;
      }
      if (isCurrentlyOpen) {
        if (collapsible) setOpenValues([]);
        return;
      }
      setOpenValues([value]);
    },
    [isMultiple, collapsible, setOpenValues, openValues],
  );

  const slots = useSlotRecipe<AccordionSlots>('accordion');
  const ctxValue = useMemo(() => ({ openValues, toggle }), [openValues, toggle]);

  return (
    <AccordionNativeContext.Provider value={ctxValue}>
      <Flex {...slots.root} className={className} style={style}>
        {children}
      </Flex>
    </AccordionNativeContext.Provider>
  );
}

function AccordionItem({ children, value, disabled = false, className, style }: AccordionItemProps) {
  const { openValues } = useAccordionNativeContext();
  const baseId = useId();
  const open = openValues.includes(value);
  const triggerId = `${baseId}-trigger-${value}`;

  const slots = useSlotRecipe<AccordionSlots>('accordion', { state: open ? 'open' : 'closed' });
  const itemContextValue = useMemo(
    () => ({ value, open, disabled, triggerId }),
    [value, open, disabled, triggerId],
  );

  return (
    <AccordionItemNativeContext.Provider value={itemContextValue}>
      <ItemSlotsContext.Provider value={slots}>
        <Box {...slots.item} className={className} style={style}>
          {children}
        </Box>
      </ItemSlotsContext.Provider>
    </AccordionItemNativeContext.Provider>
  );
}

function AccordionTrigger({ children, className, style }: AccordionTriggerProps) {
  const { toggle } = useAccordionNativeContext();
  const { value, open, disabled, triggerId } = useAccordionItemNativeContext();
  const slots = useContext(ItemSlotsContext);

  const handleClick: React.MouseEventHandler<HTMLElement> = () => {
    if (disabled) return;
    toggle(value);
  };

  return (
    <Clickable
      nativeID={triggerId}
      accessibilityRole="button"
      accessibilityState={{ expanded: open, disabled: !!disabled }}
      onClick={handleClick}
      disabled={disabled}
      {...slots.trigger}
      className={className}
      style={style}
    >
      <Text as="span" color={disabled ? 'text.disabled' : 'text.primary'} fontSize="small" fontWeight="medium">
        {children}
      </Text>
      <Icon name={open ? 'ChevronUp' : 'ChevronDown'} size="small" decorative />
    </Clickable>
  );
}

function AccordionContent({ children, className, style }: AccordionContentProps) {
  const { open, triggerId } = useAccordionItemNativeContext();
  const slots = useContext(ItemSlotsContext);
  if (!open) return null;

  return (
    <Box {...slots.contentInner} accessibilityLabelledBy={triggerId} className={className} style={style}>
      {children}
    </Box>
  );
}

AccordionRoot.displayName = 'Accordion.Root';
AccordionItem.displayName = 'Accordion.Item';
AccordionTrigger.displayName = 'Accordion.Trigger';
AccordionContent.displayName = 'Accordion.Content';

/**
 * @platform native
 *
 * Accordion em React Native — paridade com web pós-RFC-0037.
 *
 * - Discriminated union por `type` (single/multiple) + `collapsible` em single.
 * - Trigger via `Clickable.native` com `accessibilityRole='button'` +
 *   `accessibilityState={{ expanded, disabled }}`.
 * - Sem CSS grid; `Content` renderiza apenas quando `open === true`.
 * - Chevron alterna entre `ChevronDown` (fechado) e `ChevronUp` (aberto) —
 *   sem rotate (slot recipe `triggerIcon.transform` é ignorado pelo engine
 *   native).
 * - Sem keyboard nav (touch-only).
 *
 * Anatomia consumida via slot recipe `accordion` — mesma fonte themable do web.
 *
 * @see {@link AccordionRootProps}
 * @see RFC-0037
 */
export const Accordion = Object.assign(AccordionRoot, {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});
