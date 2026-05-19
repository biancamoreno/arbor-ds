import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Animated, Dimensions, View } from 'react-native';
import { useControllableState, useLayoutId } from '../../../ecosystem/primitives';
import { Box, Clickable, Icon, Text } from '../../core';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { usePrefersReducedMotion } from '../../../ecosystem/styled-system/system/hooks/use-prefers-reduced-motion.native';
import { DrawerContext, useDrawerContext, type DrawerContextValue } from '../context/drawer-context';
import type { DrawerPlacement } from '../context/drawer-context';
import type {
  DrawerProps,
  DrawerRole,
  DrawerRootProps,
  DrawerTriggerProps,
  DrawerContentProps,
  DrawerHeaderProps,
  DrawerBodyProps,
  DrawerFooterProps,
  DrawerTitleProps,
  DrawerDescriptionProps,
  DrawerCloseProps,
} from '../interfaces/DrawerProps';

type DrawerRootInternalProps = DrawerRootProps & {
  role?: DrawerRole;
  initialFocusRef?: React.RefObject<unknown>;
};

type DrawerSlots =
  | 'overlay'
  | 'content'
  | 'header'
  | 'body'
  | 'footer'
  | 'title'
  | 'description'
  | 'close';

type ChildPressProps = { onPress?: () => void };

const TRANSITION_MS = 160;

function DrawerRoot({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  placement = 'right',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  lockBodyScroll: _lockBodyScroll = true,
  onInteractOutside,
  onEscapeKeyDown,
  accessibilityLabel,
  accessibilityHint: _accessibilityHint,
  role = 'dialog',
  initialFocusRef: _initialFocusRef,
  children,
}: DrawerRootInternalProps) {
  const [open, setOpenState] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const contentId = useLayoutId('drawer');
  const titleId = useLayoutId('drawer-title');
  const descriptionId = useLayoutId('drawer-desc');
  const triggerRef = useRef<View | null>(null);

  const setOpen = useCallback((next: boolean) => setOpenState(next), [setOpenState]);

  const value = useMemo<DrawerContextValue>(
    () => ({
      open,
      setOpen,
      placement,
      contentId,
      titleId,
      descriptionId,
      triggerRef: triggerRef as unknown as React.MutableRefObject<HTMLElement | null>,
      accessibilityLabel,
      role,
      // Em native, foco programático fica com o consumer; o ref não é
      // consumido aqui — mantido apenas como paridade de tipo.
      initialFocusRef: undefined,
      closeOnOverlayClick,
      closeOnEscape,
      lockBodyScroll: false, // no-op em native
      onInteractOutside,
      onEscapeKeyDown,
    }),
    [
      open,
      setOpen,
      placement,
      contentId,
      titleId,
      descriptionId,
      accessibilityLabel,
      role,
      closeOnOverlayClick,
      closeOnEscape,
      onInteractOutside,
      onEscapeKeyDown,
    ],
  );

  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
}

DrawerRoot.displayName = 'Drawer.Root';

function DrawerTrigger({ children }: DrawerTriggerProps) {
  const { open, setOpen, contentId } = useDrawerContext();
  return (
    <Clickable
      onClick={() => setOpen(true)}
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      {...({ accessibilityLabelledBy: open ? contentId : undefined } as Record<string, unknown>)}
    >
      {children}
    </Clickable>
  );
}

DrawerTrigger.displayName = 'Drawer.Trigger';

function DrawerOverlay() {
  // Overlay nativo é renderizado dentro do `<Modal>` no `DrawerContent` via
  // scrim Clickable — esse componente existe só por paridade de API e é
  // no-op no native (a árvore visual fica encapsulada no Modal).
  return null;
}

DrawerOverlay.displayName = 'Drawer.Overlay';

/** Dimensão off-screen para `translate` inicial. */
function hiddenOffset(placement: DrawerPlacement): { x: number; y: number } {
  const { width, height } = Dimensions.get('window');
  switch (placement) {
    case 'right':  return { x: width,  y: 0 };
    case 'left':   return { x: -width, y: 0 };
    case 'bottom': return { x: 0,      y: height };
    case 'top':    return { x: 0,      y: -height };
  }
}

/** Posicionamento absoluto + ocupação cross-axis do painel. */
function panelLayout(placement: DrawerPlacement): Record<string, unknown> {
  switch (placement) {
    case 'right':  return { position: 'absolute', top: 0, right: 0, bottom: 0 };
    case 'left':   return { position: 'absolute', top: 0, left: 0, bottom: 0 };
    case 'top':    return { position: 'absolute', top: 0, left: 0, right: 0 };
    case 'bottom': return { position: 'absolute', bottom: 0, left: 0, right: 0 };
  }
}

function DrawerContent({ children, size = 'medium' }: DrawerContentProps) {
  const {
    open,
    setOpen,
    placement,
    contentId,
    accessibilityLabel,
    role,
    closeOnOverlayClick,
    closeOnEscape,
    onInteractOutside,
    onEscapeKeyDown,
  } = useDrawerContext();
  const slots = useSlotRecipe<DrawerSlots>('drawer', { size, placement });
  const reducedMotion = usePrefersReducedMotion();

  const [mounted, setMounted] = useState(open);
  const offset = hiddenOffset(placement);
  const translateX = useRef(new Animated.Value(reducedMotion ? 0 : offset.x)).current;
  const translateY = useRef(new Animated.Value(reducedMotion ? 0 : offset.y)).current;
  const overlayOpacity = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;

  useEffect(() => {
    if (open) {
      setMounted(true);
      if (reducedMotion || process.env.NODE_ENV === 'test') {
        translateX.setValue(0);
        translateY.setValue(0);
        overlayOpacity.setValue(1);
        return;
      }
      Animated.parallel([
        Animated.timing(translateX, { toValue: 0, duration: TRANSITION_MS, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: TRANSITION_MS, useNativeDriver: true }),
        Animated.timing(overlayOpacity, { toValue: 1, duration: TRANSITION_MS, useNativeDriver: true }),
      ]).start();
      return;
    }
    if (reducedMotion || process.env.NODE_ENV === 'test') {
      translateX.setValue(offset.x);
      translateY.setValue(offset.y);
      overlayOpacity.setValue(0);
      setMounted(false);
      return;
    }
    Animated.parallel([
      Animated.timing(translateX, { toValue: offset.x, duration: TRANSITION_MS, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: offset.y, duration: TRANSITION_MS, useNativeDriver: true }),
      Animated.timing(overlayOpacity, { toValue: 0, duration: TRANSITION_MS, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) setMounted(false);
    });
  }, [open, translateX, translateY, overlayOpacity, offset.x, offset.y, reducedMotion]);

  if (!mounted) return null;

  const handleScrimPress = () => {
    if (!closeOnOverlayClick) return;
    const synthetic = {
      defaultPrevented: false,
      preventDefault() {
        this.defaultPrevented = true;
      },
    };
    onInteractOutside?.(synthetic);
    if (synthetic.defaultPrevented) return;
    setOpen(false);
  };

  const handleRequestClose = () => {
    if (!closeOnEscape) return;
    const synthetic = {
      defaultPrevented: false,
      preventDefault() {
        this.defaultPrevented = true;
      },
    };
    onEscapeKeyDown?.(synthetic);
    if (synthetic.defaultPrevented) return;
    setOpen(false);
  };

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent onRequestClose={handleRequestClose}>
      <Clickable
        onClick={handleScrimPress}
        flex={1}
        accessibilityRole="none"
      >
        <Animated.View style={{ flex: 1, opacity: overlayOpacity }}>
          <Box {...(slots.overlay as Record<string, unknown>)} />
        </Animated.View>
        <Animated.View
          accessibilityViewIsModal
          accessibilityRole={(role === 'alertdialog' ? 'alert' : 'none') as never}
          accessibilityLabel={accessibilityLabel}
          nativeID={contentId}
          style={{
            ...panelLayout(placement),
            transform: [{ translateX }, { translateY }],
          }}
        >
          {/* Container interno absorve toques para não fechar quando o
              usuário interage com o conteúdo do drawer. */}
          <Clickable onClick={() => {}} accessibilityRole="none">
            <Box {...(slots.content as Record<string, unknown>)}>{children}</Box>
          </Clickable>
        </Animated.View>
      </Clickable>
    </Modal>
  );
}

DrawerContent.displayName = 'Drawer.Content';

function DrawerHeader({ children }: DrawerHeaderProps) {
  const slots = useSlotRecipe<DrawerSlots>('drawer', {});
  return <Box {...(slots.header as Record<string, unknown>)}>{children}</Box>;
}

DrawerHeader.displayName = 'Drawer.Header';

function DrawerBody({ children }: DrawerBodyProps) {
  const slots = useSlotRecipe<DrawerSlots>('drawer', {});
  return <Box {...(slots.body as Record<string, unknown>)}>{children}</Box>;
}

DrawerBody.displayName = 'Drawer.Body';

function DrawerFooter({ children }: DrawerFooterProps) {
  const slots = useSlotRecipe<DrawerSlots>('drawer', {});
  return <Box {...(slots.footer as Record<string, unknown>)}>{children}</Box>;
}

DrawerFooter.displayName = 'Drawer.Footer';

function DrawerTitle({ children }: DrawerTitleProps) {
  const { titleId } = useDrawerContext();
  const slots = useSlotRecipe<DrawerSlots>('drawer', {});
  return (
    <Text as="span" nativeID={titleId} {...(slots.title as Record<string, unknown>)}>
      {children}
    </Text>
  );
}

DrawerTitle.displayName = 'Drawer.Title';

function DrawerDescription({ children }: DrawerDescriptionProps) {
  const { descriptionId } = useDrawerContext();
  const slots = useSlotRecipe<DrawerSlots>('drawer', {});
  return (
    <Text as="span" nativeID={descriptionId} {...(slots.description as Record<string, unknown>)}>
      {children}
    </Text>
  );
}

DrawerDescription.displayName = 'Drawer.Description';

function DrawerClose({ children, accessibilityLabel = 'Fechar' }: DrawerCloseProps) {
  const { setOpen } = useDrawerContext();
  const slots = useSlotRecipe<DrawerSlots>('drawer', {});

  if (children) {
    const child = children as React.ReactElement<ChildPressProps>;
    const childOnPress = child.props.onPress;
    return React.cloneElement(child, {
      onPress: () => {
        childOnPress?.();
        setOpen(false);
      },
    });
  }

  return (
    <Clickable
      onClick={() => setOpen(false)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      {...(slots.close as Record<string, unknown>)}
    >
      <Icon name="X" size="small" decorative />
    </Clickable>
  );
}

DrawerClose.displayName = 'Drawer.Close';

/**
 * @platform native
 *
 * Drawer nativo — `Modal transparent` + scrim `Clickable` + `Animated` slide
 * placement-aware (160ms régua sóbria). Toque no scrim fecha (respeita
 * `closeOnOverlayClick` + `onInteractOutside`); toque no conteúdo é absorvido
 * pelo Clickable interno. Botão hardware Back/Escape dispara `onRequestClose`
 * (respeita `closeOnEscape` + `onEscapeKeyDown`). `accessibilityViewIsModal`
 * impede que screen reader navegue para a UI subjacente. `role='alertdialog'`
 * mapeia para `accessibilityRole='alert'`.
 *
 * API plana sob RFC-0043 — top-level aceita `title`/`description`/`footer`/
 * `trigger`/`role` e monta a anatomia automaticamente.
 *
 * @see {@link DrawerProps}
 */
function DrawerFlat({
  title,
  description,
  footer,
  trigger,
  role,
  initialFocusRef,
  size = 'medium',
  children,
  ...rootProps
}: DrawerProps) {
  const usesFlatApi =
    title !== undefined ||
    description !== undefined ||
    footer !== undefined ||
    trigger !== undefined ||
    children === undefined;

  if (!usesFlatApi) {
    return <DrawerRoot {...rootProps}>{children}</DrawerRoot>;
  }

  return (
    <DrawerRoot {...rootProps} role={role} initialFocusRef={initialFocusRef}>
      {trigger && React.isValidElement(trigger) ? <DrawerTrigger>{trigger}</DrawerTrigger> : null}
      <DrawerOverlay />
      <DrawerContent size={size}>
        {(title !== undefined || description !== undefined) && (
          <DrawerHeader>
            {title !== undefined ? <DrawerTitle>{title}</DrawerTitle> : null}
            {description !== undefined ? <DrawerDescription>{description}</DrawerDescription> : null}
          </DrawerHeader>
        )}
        {children !== undefined ? <DrawerBody>{children}</DrawerBody> : null}
        {footer !== undefined ? <DrawerFooter>{footer}</DrawerFooter> : null}
        <DrawerClose />
      </DrawerContent>
    </DrawerRoot>
  );
}

DrawerFlat.displayName = 'Drawer';

export const Drawer = Object.assign(DrawerFlat, {
  Root: DrawerRoot,
  Trigger: DrawerTrigger,
  Overlay: DrawerOverlay,
  Content: DrawerContent,
  Header: DrawerHeader,
  Body: DrawerBody,
  Footer: DrawerFooter,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Close: DrawerClose,
});
