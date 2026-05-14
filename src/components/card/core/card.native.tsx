import { createContext, useContext, useMemo } from 'react';
import { Box, Flex, Clickable } from '../../core';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import type { StyleProps } from '../../../ecosystem/styled-system/system/system.types';
import type { CardRootProps, CardSectionProps } from '../interfaces';

type CardSlots = 'root' | 'header' | 'body' | 'footer' | 'media';

type CardSlotMap = Partial<Record<CardSlots, StyleProps>>;

const CardContext = createContext<CardSlotMap>({});

function useCardSlot(slot: CardSlots): StyleProps {
  const slots = useContext(CardContext);
  return (slots[slot] ?? {}) as StyleProps;
}

function CardRoot(props: CardRootProps) {
  const {
    children,
    variant = 'outlined',
    padding = 'medium',
    className,
    style,
  } = props;
  const interactive = props.interactive === true;

  const slots = useSlotRecipe<CardSlots>('card', {
    variant,
    padding,
    interactive: interactive ? 'true' : 'false',
  });

  const contextValue = useMemo(() => slots, [slots]);

  if (interactive) {
    const { onClick, accessibilityLabel } = props as Extract<CardRootProps, { interactive: true }>;
    return (
      <CardContext.Provider value={contextValue}>
        <Clickable
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          onClick={onClick}
          className={className}
          style={style}
          {...slots.root}
          display="flex"
        >
          {children}
        </Clickable>
      </CardContext.Provider>
    );
  }

  return (
    <CardContext.Provider value={contextValue}>
      <Flex className={className} style={style} {...slots.root}>
        {children}
      </Flex>
    </CardContext.Provider>
  );
}

function CardHeader({ children, className, style }: CardSectionProps) {
  const slot = useCardSlot('header');
  return (
    <Box className={className} style={style} {...slot}>
      {children}
    </Box>
  );
}

function CardBody({ children, className, style }: CardSectionProps) {
  const slot = useCardSlot('body');
  return (
    <Box className={className} style={style} {...slot}>
      {children}
    </Box>
  );
}

function CardFooter({ children, className, style }: CardSectionProps) {
  const slot = useCardSlot('footer');
  return (
    <Box className={className} style={style} {...slot}>
      {children}
    </Box>
  );
}

function CardMedia({ children, className, style }: CardSectionProps) {
  const slot = useCardSlot('media');
  return (
    <Box className={className} style={style} {...slot}>
      {children}
    </Box>
  );
}

CardRoot.displayName = 'Card.Root';
CardHeader.displayName = 'Card.Header';
CardBody.displayName = 'Card.Body';
CardFooter.displayName = 'Card.Footer';
CardMedia.displayName = 'Card.Media';

/**
 * @platform native
 *
 * Card em React Native — paridade com web pós-PCV-26.
 *
 * - **Decorativo (default):** `<Flex>` (View) puramente visual.
 * - **Interativo (`interactive`):** `Clickable.native` com
 *   `accessibilityRole='button'` + `accessibilityLabel` obrigatório.
 *
 * Pseudo-states `_hover`/`_active`/`_focusVisible` da slot recipe são ignorados
 * pelo engine native (não existem em RN); transição também não tem efeito sem
 * `Animated`. Pressable já entrega feedback visual via opacity por construção.
 *
 * `Card.Media` fica edge-to-edge **por construção**: cada slot dona seu padding.
 *
 * @see {@link CardRootProps}
 */
export const Card = Object.assign(CardRoot, {
  Root: CardRoot,
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
  Media: CardMedia,
});
