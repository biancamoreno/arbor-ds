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
          as="button"
          type="button"
          onClick={onClick}
          aria-label={accessibilityLabel}
          className={className}
          style={style}
          {...slots.root}
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
 * @platform shared
 *
 * Compound de cartão. **Discriminated union** controla o contrato:
 *
 * - **Decorativo (default):** `<Card>` renderiza `<div>` puramente visual.
 *
 *   ```tsx
 *   <Card variant="elevated" padding="medium">
 *     <Card.Media><Image src={url} alt="" /></Card.Media>
 *     <Card.Header>Plano Plus</Card.Header>
 *     <Card.Body>Recursos avançados…</Card.Body>
 *     <Card.Footer><Button>Assinar</Button></Card.Footer>
 *   </Card>
 *   ```
 *
 * - **Interativo:** `<Card interactive onClick={...} accessibilityLabel="...">`
 *   vira `<button>` (web) / `<Pressable>` (native) com hover/active themable
 *   (via `card.opacity.{hover,active}`) e foco visível WCAG.
 *
 *   ```tsx
 *   <Card interactive onClick={openProduct} accessibilityLabel="Abrir produto X">
 *     <Card.Body>...</Card.Body>
 *   </Card>
 *   ```
 *
 * Anatomia (variant × padding × interactive) resolvida pela slot recipe
 * `card` — override completo via `createTheme`.
 *
 * `Card.Media` fica edge-to-edge **por construção**: cada slot dona seu
 * padding; `media` não tem padding, então renderiza encostado nas bordas
 * do `root` (graças a `overflow: 'hidden'` no root).
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
