import React, { useCallback, useRef } from 'react';
import { Box, Flex, Text, Clickable } from '../../core';
import { useControllableState, useLayoutId } from '../../../ecosystem/primitives';
import { Icon } from '../../core';
import { transition } from '../../../ecosystem/utils/functions';
import {
  AccordionContext,
  AccordionItemContext,
  useAccordionContext,
  useAccordionItemContext,
} from '../context/accordion-context';
import type {
  AccordionRootProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
} from '../interfaces';

function AccordionRoot({
  children,
  type = 'single',
  value: valueProp,
  defaultValue,
  onValueChange,
  style,
  ...props
}: AccordionRootProps) {
  const normalize = (v: string | string[] | undefined): string[] => {
    if (v === undefined) return [];
    return Array.isArray(v) ? v : [v];
  };

  const [openValues, setOpenValues] = useControllableState<string[]>({
    value: valueProp !== undefined ? normalize(valueProp) : undefined,
    defaultValue: normalize(defaultValue),
    onChange: (next) => {
      if (!onValueChange) return;
      onValueChange(type === 'single' ? (next[0] ?? '') : next);
    },
  });

  const triggerRefs = useRef<Map<string, React.RefObject<HTMLButtonElement | null>>>(new Map());

  const toggle = useCallback(
    (value: string) => {
      const isCurrentlyOpen = openValues.includes(value);
      if (type === 'single') {
        setOpenValues(isCurrentlyOpen ? [] : [value]);
      } else {
        setOpenValues(isCurrentlyOpen ? openValues.filter((v) => v !== value) : [...openValues, value]);
      }
    },
    [type, setOpenValues, openValues]
  );

  const registerTrigger = useCallback((value: string, ref: React.RefObject<HTMLButtonElement | null>) => {
    triggerRefs.current.set(value, ref);
  }, []);

  const unregisterTrigger = useCallback((value: string) => {
    triggerRefs.current.delete(value);
  }, []);

  const getSortedKeys = () => Array.from(triggerRefs.current.keys());

  const focusNext = useCallback((fromValue: string) => {
    const keys = getSortedKeys();
    const idx = keys.indexOf(fromValue);
    const next = keys[(idx + 1) % keys.length];
    triggerRefs.current.get(next)?.current?.focus();
  }, []);

  const focusPrev = useCallback((fromValue: string) => {
    const keys = getSortedKeys();
    const idx = keys.indexOf(fromValue);
    const prev = keys[(idx - 1 + keys.length) % keys.length];
    triggerRefs.current.get(prev)?.current?.focus();
  }, []);

  return (
    <AccordionContext.Provider value={{ openValues, toggle, type, registerTrigger, unregisterTrigger, focusNext, focusPrev }}>
      <Flex
        {...props}
        flexDirection="column"
        borderRadius="small"
        borderColor="border.subtle"
        borderWidth={1}
        borderStyle="solid"
        overflow="hidden"
        style={style}
      >
        {children}
      </Flex>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ children, value, disabled = false, style, ...props }: AccordionItemProps) {
  const { openValues } = useAccordionContext();
  const contentId = useLayoutId(`accordion-content-${value}`);
  const triggerId = useLayoutId(`accordion-trigger-${value}`);
  const open = openValues.includes(value);

  return (
    <AccordionItemContext.Provider value={{ value, open, disabled, contentId, triggerId }}>
      <Box
        {...props}
        borderBottomColor="border.subtle"
        borderBottomWidth={1}
        borderBottomStyle="solid"
        style={style}
      >
        {children}
      </Box>
    </AccordionItemContext.Provider>
  );
}

function AccordionTrigger({ children, style, ...props }: AccordionTriggerProps) {
  const { toggle, registerTrigger, unregisterTrigger, focusNext, focusPrev } = useAccordionContext();
  const { value, open, disabled, contentId, triggerId } = useAccordionItemContext();
  const ref = useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    registerTrigger(value, ref);
    return () => unregisterTrigger(value);
  }, [value, registerTrigger, unregisterTrigger]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); focusNext(value); }
    if (e.key === 'ArrowUp') { e.preventDefault(); focusPrev(value); }
  };

  return (
    <Clickable
      as="button"
      innerRef={ref}
      id={triggerId}
      type="button"
      aria-expanded={open}
      aria-controls={contentId}
      disabled={disabled}
      onClick={() => toggle(value)}
      onKeyDown={handleKeyDown}
      data-arbor-focusable=""
      {...props}
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding="small"
      paddingX="medium"
      cursor={disabled ? 'not-allowed' : 'pointer'}
      fontWeight="medium"
      fontSize="small"
      color={disabled ? 'text.disabled' : 'text.primary'}
      style={{
        background: 'none',
        border: 'none',
        textAlign: 'left',
        ...style,
      }}
    >
      <Text as="span">{children}</Text>
      <Icon
        name="ChevronDown"
        size="small"
        style={{
          transition: transition(['transform'], 'fast'),
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          flexShrink: 0,
        }}
      />
    </Clickable>
  );
}

function AccordionContent({ children, style, ...props }: AccordionContentProps) {
  const { open, contentId, triggerId } = useAccordionItemContext();

  return (
    <Box
      id={contentId}
      role="region"
      aria-labelledby={triggerId}
      data-state={open ? 'open' : 'closed'}
      {...props}
      display="grid"
      overflow="hidden"
      style={{
        gridTemplateRows: open ? '1fr' : '0fr',
        transition: transition(['grid-template-rows'], 'normal'),
        ...style,
      }}
    >
      <Box minHeight={0} overflow="hidden">
        <Box padding="medium" style={{ paddingTop: 0 }}>
          {children}
        </Box>
      </Box>
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
 * Compound de accordion (sanfona expansível). `Accordion.Root` aceita
 * `type='single'` (apenas um item aberto por vez; `value: string`) ou
 * `type='multiple'` (vários abertos; `value: string[]`). Cada `Accordion.Item`
 * tem `value` único; `Accordion.Trigger` é o botão que toggle, e
 * `Accordion.Content` é o painel revelado (com transição de altura em web e
 * render-condicional + chevron rotativo em native).
 *
 * @example
 * <Accordion type="single" defaultValue="faq-1">
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
