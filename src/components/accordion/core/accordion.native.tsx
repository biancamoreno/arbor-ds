import { createContext, useCallback, useContext, useId } from 'react';
import { Box, Flex, Text, Clickable, Icon } from '../../core';
import { useControllableState } from '../../../ecosystem/primitives';
import type {
  AccordionRootProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
} from '../interfaces';

/**
 * @platform native-ready
 *
 * Accordion nativo simplificado:
 * - Sem keyboard nav (touch-only).
 * - Sem animação CSS grid (web usa `gridTemplateRows`); native renderiza Content
 *   apenas quando `open === true`. Animated pode ser adicionado depois sem quebra de API.
 * - Trigger via `Clickable.native` com `accessibilityRole="button"` +
 *   `accessibilityState={{ expanded, disabled }}`.
 * - Chevron alterna entre `ChevronDown` (fechado) e `ChevronUp` (aberto) — sem rotate CSS.
 */

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

const useAccordionNativeContext = () => useContext(AccordionNativeContext);
const useAccordionItemNativeContext = () => useContext(AccordionItemNativeContext);

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

  const toggle = useCallback(
    (value: string) => {
      const isCurrentlyOpen = openValues.includes(value);
      if (type === 'single') {
        setOpenValues(isCurrentlyOpen ? [] : [value]);
      } else {
        setOpenValues(isCurrentlyOpen ? openValues.filter((v) => v !== value) : [...openValues, value]);
      }
    },
    [type, setOpenValues, openValues],
  );

  return (
    <AccordionNativeContext.Provider value={{ openValues, toggle }}>
      <Flex
        {...(props as object)}
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
    </AccordionNativeContext.Provider>
  );
}

function AccordionItem({ children, value, disabled = false, style, ...props }: AccordionItemProps) {
  const { openValues } = useAccordionNativeContext();
  const baseId = useId();
  const open = openValues.includes(value);
  const triggerId = `${baseId}-trigger-${value}`;

  return (
    <AccordionItemNativeContext.Provider value={{ value, open, disabled, triggerId }}>
      <Box
        {...(props as object)}
        borderBottomColor="border.subtle"
        borderBottomWidth={1}
        borderBottomStyle="solid"
        style={style}
      >
        {children}
      </Box>
    </AccordionItemNativeContext.Provider>
  );
}

function AccordionTrigger({ children, onClick, style, ...props }: AccordionTriggerProps) {
  const { toggle } = useAccordionNativeContext();
  const { value, open, disabled, triggerId } = useAccordionItemNativeContext();

  const handleClick: React.MouseEventHandler<HTMLElement> = (e) => {
    if (disabled) return;
    toggle(value);
    onClick?.(e as React.MouseEvent<HTMLButtonElement>);
  };

  return (
    <Clickable
      {...(props as object)}
      nativeID={triggerId}
      accessibilityRole="button"
      accessibilityState={{ expanded: open, disabled: !!disabled }}
      onClick={handleClick}
      disabled={disabled}
      width="100%"
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      paddingX="medium"
      paddingY="small"
      style={style}
    >
      <Text
        as="span"
        style={{
          color: disabled ? '#9CA3AF' : '#1A1A1A',
          fontSize: 14,
          fontWeight: '500',
        }}
      >
        {children}
      </Text>
      <Icon name={open ? 'ChevronUp' : 'ChevronDown'} size="sm" decorative />
    </Clickable>
  );
}

function AccordionContent({ children, style, ...props }: AccordionContentProps) {
  const { open, triggerId } = useAccordionItemNativeContext();
  if (!open) return null;

  return (
    <Box
      {...(props as object)}
      accessibilityLabelledBy={triggerId}
      padding="medium"
      style={{ paddingTop: 0, ...style }}
    >
      {children}
    </Box>
  );
}

AccordionRoot.displayName = 'Accordion.Root';
AccordionItem.displayName = 'Accordion.Item';
AccordionTrigger.displayName = 'Accordion.Trigger';
AccordionContent.displayName = 'Accordion.Content';

export const Accordion = Object.assign(AccordionRoot, {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});
