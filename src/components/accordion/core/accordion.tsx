import React, { createContext, useCallback, useContext, useMemo, useRef } from 'react';
import { Box, Flex, Text, Clickable, Icon } from '../../core';
import { useControllableState, useLayoutId } from '../../../ecosystem/primitives';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { transition } from '../../../foundations/theme/transition';
import type { StyleProps } from '../../../ecosystem/styled-system/system/system.types';
import {
  AccordionContext,
  AccordionItemContext,
  useAccordionContext,
  useAccordionItemContext,
  type AccordionMode,
} from '../context/accordion-context';
import type {
  AccordionRootProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
} from '../interfaces';

type AccordionSlots = 'root' | 'item' | 'trigger' | 'triggerIcon' | 'content' | 'contentInner';
type AccordionSlotMap = Partial<Record<AccordionSlots, StyleProps>>;

const ItemSlotsContext = createContext<AccordionSlotMap>({});

const CONTENT_TRANSITION = transition(['grid-template-rows'], 'normal');
const ICON_TRANSITION = transition(['transform'], 'fast');

function AccordionRoot(props: AccordionRootProps) {
  const { children, className, style } = props;
  const type = props.type ?? 'single';

  const isMultiple = type === 'multiple';
  const collapsible = isMultiple ? true : (props as { collapsible?: boolean }).collapsible ?? true;

  const mode: AccordionMode = useMemo(
    () => (isMultiple ? { type: 'multiple' } : { type: 'single', collapsible }),
    [isMultiple, collapsible],
  );

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

  const triggerRefs = useRef<Map<string, React.RefObject<HTMLButtonElement | null>>>(new Map());

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

  const registerTrigger = useCallback(
    (value: string, ref: React.RefObject<HTMLButtonElement | null>) => {
      triggerRefs.current.set(value, ref);
    },
    [],
  );

  const unregisterTrigger = useCallback((value: string) => {
    triggerRefs.current.delete(value);
  }, []);

  const getSortedKeys = useCallback(() => {
    const keys = Array.from(triggerRefs.current.keys());
    return keys.sort((a, b) => {
      const refA = triggerRefs.current.get(a)?.current;
      const refB = triggerRefs.current.get(b)?.current;
      if (!refA || !refB) return 0;
      const pos = refA.compareDocumentPosition(refB);
      if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
      if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
      return 0;
    });
  }, []);

  const focusAt = useCallback((value: string | undefined) => {
    if (!value) return;
    triggerRefs.current.get(value)?.current?.focus();
  }, []);

  const focusNext = useCallback(
    (fromValue: string) => {
      const keys = getSortedKeys();
      if (keys.length === 0) return;
      const idx = keys.indexOf(fromValue);
      focusAt(keys[(idx + 1) % keys.length]);
    },
    [getSortedKeys, focusAt],
  );

  const focusPrev = useCallback(
    (fromValue: string) => {
      const keys = getSortedKeys();
      if (keys.length === 0) return;
      const idx = keys.indexOf(fromValue);
      focusAt(keys[(idx - 1 + keys.length) % keys.length]);
    },
    [getSortedKeys, focusAt],
  );

  const focusFirst = useCallback(() => {
    const keys = getSortedKeys();
    focusAt(keys[0]);
  }, [getSortedKeys, focusAt]);

  const focusLast = useCallback(() => {
    const keys = getSortedKeys();
    focusAt(keys[keys.length - 1]);
  }, [getSortedKeys, focusAt]);

  const slots = useSlotRecipe<AccordionSlots>('accordion');

  return (
    <AccordionContext.Provider
      value={{
        openValues,
        toggle,
        mode,
        registerTrigger,
        unregisterTrigger,
        focusNext,
        focusPrev,
        focusFirst,
        focusLast,
      }}
    >
      <Flex {...slots.root} className={className} style={style}>
        {children}
      </Flex>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ children, value, disabled = false, className, style }: AccordionItemProps) {
  const { openValues } = useAccordionContext();
  const contentId = useLayoutId(`accordion-content-${value}`);
  const triggerId = useLayoutId(`accordion-trigger-${value}`);
  const open = openValues.includes(value);

  const slots = useSlotRecipe<AccordionSlots>('accordion', { state: open ? 'open' : 'closed' });
  const itemContextValue = useMemo(
    () => ({ value, open, disabled, contentId, triggerId }),
    [value, open, disabled, contentId, triggerId],
  );

  return (
    <AccordionItemContext.Provider value={itemContextValue}>
      <ItemSlotsContext.Provider value={slots}>
        <Box {...slots.item} className={className} style={style}>
          {children}
        </Box>
      </ItemSlotsContext.Provider>
    </AccordionItemContext.Provider>
  );
}

function AccordionTrigger({ children, className, style }: AccordionTriggerProps) {
  const { toggle, registerTrigger, unregisterTrigger, focusNext, focusPrev, focusFirst, focusLast } =
    useAccordionContext();
  const { value, open, disabled, contentId, triggerId } = useAccordionItemContext();
  const slots = useContext(ItemSlotsContext);
  const ref = useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    registerTrigger(value, ref);
    return () => unregisterTrigger(value);
  }, [value, registerTrigger, unregisterTrigger]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); focusNext(value); return; }
    if (e.key === 'ArrowUp')   { e.preventDefault(); focusPrev(value); return; }
    if (e.key === 'Home')      { e.preventDefault(); focusFirst(); return; }
    if (e.key === 'End')       { e.preventDefault(); focusLast(); return; }
  };

  return (
    <Clickable
      as="button"
      innerRef={ref}
      id={triggerId}
      type="button"
      aria-expanded={open}
      aria-controls={contentId}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={() => toggle(value)}
      onKeyDown={handleKeyDown}
      data-arbor-focusable=""
      {...slots.trigger}
      className={className}
      style={style}
    >
      <Text as="span">{children}</Text>
      <Box as="span" {...slots.triggerIcon} style={{ transition: ICON_TRANSITION }}>
        <Icon name="ChevronDown" size="small" decorative />
      </Box>
    </Clickable>
  );
}

function AccordionContent({ children, className, style }: AccordionContentProps) {
  const { open, contentId, triggerId } = useAccordionItemContext();
  const slots = useContext(ItemSlotsContext);

  return (
    <Box
      id={contentId}
      role="region"
      aria-labelledby={triggerId}
      data-state={open ? 'open' : 'closed'}
      {...slots.content}
      className={className}
      style={{
        gridTemplateRows: open ? '1fr' : '0fr',
        transition: CONTENT_TRANSITION,
        ...style,
      }}
    >
      <Box {...slots.contentInner}>{children}</Box>
    </Box>
  );
}

AccordionRoot.displayName = 'Accordion.Root';
AccordionItem.displayName = 'Accordion.Item';
AccordionTrigger.displayName = 'Accordion.Trigger';
AccordionContent.displayName = 'Accordion.Content';

/**
 * @platform shared
 *
 * Compound de accordion (sanfona expansível).
 *
 * Discriminated union por `type`:
 * - `'single'` (default): apenas um item aberto. `value: string`.
 *   `collapsible` (default `true`) controla se clicar no item ativo o fecha.
 * - `'multiple'`: vários itens podem coexistir. `value: string[]`.
 *
 * Anatomia (root, item, trigger, triggerIcon, content, contentInner) +
 * estado (`open`/`closed` para o ícone) resolvidos pela slot recipe `accordion`
 * — override completo via `createTheme`.
 *
 * Web: keyboard nav `ArrowUp`/`ArrowDown`/`Home`/`End` (DOM-order via
 * `compareDocumentPosition`, robusto a items condicionais), foco visível WCAG
 * 2.4.7, `aria-disabled` em items desabilitados, transição CSS-grid
 * (`gridTemplateRows: 0fr → 1fr`).
 *
 * @example
 * <Accordion type="single" collapsible defaultValue="faq-1">
 *   <Accordion.Item value="faq-1">
 *     <Accordion.Trigger>Como cancelar?</Accordion.Trigger>
 *     <Accordion.Content>Acesse Configurações…</Accordion.Content>
 *   </Accordion.Item>
 * </Accordion>
 *
 * @see {@link AccordionRootProps}
 */
export const Accordion = Object.assign(AccordionRoot, {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});
