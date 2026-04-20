import React, { useCallback, useRef } from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useControllableState, useLayoutId } from '../../../ecosystem/primitives';
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
  const theme = useTheme();

  // Normaliza tudo para array internamente
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
      const isOpen = openValues.includes(value);
      if (type === 'single') {
        setOpenValues(isOpen ? [] : [value]);
      } else {
        setOpenValues(isOpen ? openValues.filter((v) => v !== value) : [...openValues, value]);
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
      <div
        {...props}
        style={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: theme.radii.small,
          border: `1px solid ${theme.colors.border.subtle}`,
          overflow: 'hidden',
          ...style,
        }}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ children, value, disabled = false, style, ...props }: AccordionItemProps) {
  const { openValues } = useAccordionContext();
  const theme = useTheme();
  const contentId = useLayoutId(`accordion-content-${value}`);
  const triggerId = useLayoutId(`accordion-trigger-${value}`);
  const isOpen = openValues.includes(value);

  return (
    <AccordionItemContext.Provider value={{ value, isOpen, disabled, contentId, triggerId }}>
      <div
        {...props}
        style={{
          borderBottom: `1px solid ${theme.colors.border.subtle}`,
          ...style,
        }}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

function AccordionTrigger({ children, style, ...props }: AccordionTriggerProps) {
  const theme = useTheme();
  const { toggle, registerTrigger, unregisterTrigger, focusNext, focusPrev } = useAccordionContext();
  const { value, isOpen, disabled, contentId, triggerId } = useAccordionItemContext();
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
    <button
      ref={ref}
      id={triggerId}
      type="button"
      aria-expanded={isOpen}
      aria-controls={contentId}
      disabled={disabled}
      onClick={() => toggle(value)}
      onKeyDown={handleKeyDown}
      {...props}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `${theme.space.small} ${theme.space.medium}`,
        background: 'none',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        textAlign: 'left',
        fontWeight: theme.fontWeights.medium,
        fontSize: theme.fontSizes.small,
        color: disabled ? theme.colors.text.disabled : theme.colors.text.primary,
        ...style,
      }}
    >
      <span>{children}</span>
      <span
        aria-hidden="true"
        style={{
          transition: 'transform 0.2s ease',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          display: 'inline-flex',
        }}
      >
        ▾
      </span>
    </button>
  );
}

function AccordionContent({ children, style, ...props }: AccordionContentProps) {
  const theme = useTheme();
  const { isOpen, contentId, triggerId } = useAccordionItemContext();

  if (!isOpen) return null;

  return (
    <div
      id={contentId}
      role="region"
      aria-labelledby={triggerId}
      {...props}
      style={{
        padding: `0 ${theme.space.medium} ${theme.space.medium}`,
        fontSize: theme.fontSizes.small,
        color: theme.colors.text.secondary,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export const Accordion = Object.assign(AccordionRoot, {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});
