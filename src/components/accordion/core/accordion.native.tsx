import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { Box, Flex, Text, Clickable, Icon } from '../../core';
import { useControllableState } from '../../../ecosystem/primitives';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
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
  const isMultiple = props.type === 'multiple';
  const collapsible = props.type !== 'multiple' ? (props.collapsible ?? true) : true;

  const normalize = (v: string | string[] | undefined): string[] => {
    if (v === undefined) return [];
    return Array.isArray(v) ? v : v === '' ? [] : [v];
  };

  const valueProp: string | string[] | undefined = props.value;
  const defaultValueProp: string | string[] | undefined = props.defaultValue;
  const onValueChangeRaw = props.onValueChange as ((value: string | string[]) => void) | undefined;

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

  const slots = useSlotRecipe<AccordionSlots>('accordion', {
    disabled: disabled ? 'true' : 'false',
  });
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

function AccordionTrigger({ children, startIcon, className, style }: AccordionTriggerProps) {
  const { toggle } = useAccordionNativeContext();
  const { value, open, disabled, triggerId } = useAccordionItemNativeContext();
  const slots = useContext(ItemSlotsContext);
  const theme = useTheme();

  const rotateAnim = useRef(new Animated.Value(open ? 1 : 0)).current;
  useEffect(() => {
    if (process.env.NODE_ENV === 'test') {
      rotateAnim.setValue(open ? 1 : 0);
      return;
    }
    Animated.timing(rotateAnim, {
      toValue: open ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [open, rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const handleClick: React.MouseEventHandler<HTMLElement> = () => {
    if (disabled) return;
    toggle(value);
  };

  const iconColor = theme.colors.text.primary;

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
      <Flex alignItems="center" gap="micro" flex="1" minWidth="0">
        {startIcon ? <Box display="inline-flex" flexShrink="0">{startIcon}</Box> : null}
        <Text as="span" variant="bodyMedium">{children}</Text>
      </Flex>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Icon name="ChevronDown" size="medium" color={iconColor} decorative />
      </Animated.View>
    </Clickable>
  );
}

function AccordionContent({ children, className, style }: AccordionContentProps) {
  const { open, triggerId } = useAccordionItemNativeContext();
  const slots = useContext(ItemSlotsContext);

  const heightAnim = useRef(new Animated.Value(open ? 1 : 0)).current;
  const [innerHeight, setInnerHeight] = useState(0);

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') {
      heightAnim.setValue(open ? 1 : 0);
      return;
    }
    Animated.timing(heightAnim, {
      toValue: open ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [open, heightAnim]);

  const animatedHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, innerHeight],
  });

  return (
    <Animated.View
      accessibilityLabelledBy={triggerId}
      accessibilityElementsHidden={!open}
      importantForAccessibility={open ? 'auto' : 'no-hide-descendants'}
      style={{ height: animatedHeight, overflow: 'hidden' }}
    >
      <Box
        onLayout={(e: { nativeEvent: { layout: { height: number } } }) => {
          const h = e.nativeEvent.layout.height;
          if (h > 0 && h !== innerHeight) setInnerHeight(h);
        }}
      >
        <Box {...slots.contentInner} className={className} style={style}>
          {children}
        </Box>
      </Box>
    </Animated.View>
  );
}

AccordionRoot.displayName = 'Accordion.Root';
AccordionItem.displayName = 'Accordion.Item';
AccordionTrigger.displayName = 'Accordion.Trigger';
AccordionContent.displayName = 'Accordion.Content';

/**
 * @platform native
 *
 * Accordion em React Native — paridade com web pós-RFC-0037 + PCV-27 + polish.
 *
 * - Discriminated union por `type` (single/multiple) + `collapsible` em single.
 * - Trigger via `Clickable.native` com `accessibilityRole='button'` +
 *   `accessibilityState={{ expanded, disabled }}`.
 * - Tipografia via `<Text variant="subheading">` — fonte única cross-platform.
 * - `startIcon?: ReactNode` opcional à esquerda do label.
 * - Chevron `medium` com `Animated.timing` rotacionando 0deg↔180deg
 *   (paridade microfeedback web↔native).
 * - `Content` animado via `Animated.Value` interpolado em `height`
 *   (medido pelo `onLayout` do inner) — sem flick.
 * - Item desabilitado fica com `opacity.disabled` via recipe.
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
