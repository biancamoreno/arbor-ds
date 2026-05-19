import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Animated, View } from 'react-native';
import { useControllableState, useLayoutId } from '../../../ecosystem/primitives';
import { Box, Clickable, Icon, Text } from '../../core';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { usePrefersReducedMotion } from '../../../ecosystem/styled-system/system/hooks/use-prefers-reduced-motion.native';
import { DialogContext, useDialogContext, type DialogContextValue } from '../context/dialog-context';
import type {
  DialogRootProps,
  DialogTriggerProps,
  DialogContentProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogCloseProps,
} from '../interfaces/DialogProps';

type DialogSlots = 'overlay' | 'content' | 'title' | 'description' | 'close';
type ChildPressProps = { onPress?: () => void };

const TRANSITION_MS = 160;

function DialogRoot({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  lockBodyScroll: _lockBodyScroll = true,
  onInteractOutside,
  onEscapeKeyDown,
  accessibilityLabel,
  accessibilityHint: _accessibilityHint,
  children,
}: DialogRootProps) {
  const [open, setOpenState] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const contentId = useLayoutId('dialog');
  const titleId = useLayoutId('dialog-title');
  const descriptionId = useLayoutId('dialog-desc');
  const triggerRef = useRef<View | null>(null);

  const setOpen = useCallback((next: boolean) => setOpenState(next), [setOpenState]);

  const value = useMemo<DialogContextValue>(
    () => ({
      open,
      setOpen,
      contentId,
      titleId,
      descriptionId,
      triggerRef: triggerRef as unknown as React.MutableRefObject<HTMLElement | null>,
      accessibilityLabel,
      closeOnOverlayClick,
      closeOnEscape,
      lockBodyScroll: false, // no-op em native
      onInteractOutside,
      onEscapeKeyDown,
    }),
    [
      open,
      setOpen,
      contentId,
      titleId,
      descriptionId,
      accessibilityLabel,
      closeOnOverlayClick,
      closeOnEscape,
      onInteractOutside,
      onEscapeKeyDown,
    ],
  );

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
}

DialogRoot.displayName = 'Dialog.Root';

function DialogTrigger({ children }: DialogTriggerProps) {
  const { open, setOpen, contentId } = useDialogContext();
  return (
    <Clickable
      onClick={() => setOpen(true)}
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      // `accessibilityLabelledBy` é uma prop específica do Pressable nativo;
      // passamos via spread para preservar quando o `Clickable` propaga.
      {...({ accessibilityLabelledBy: open ? contentId : undefined } as Record<string, unknown>)}
    >
      {children}
    </Clickable>
  );
}

DialogTrigger.displayName = 'Dialog.Trigger';

function DialogOverlay() {
  // Overlay nativo é renderizado dentro de `<Modal>` no `DialogContent` via
  // backdrop Clickable — esse componente existe só por paridade de API e é
  // no-op no native (a árvore visual fica encapsulada no Modal).
  return null;
}

DialogOverlay.displayName = 'Dialog.Overlay';

function DialogContent({ children, size = 'medium' }: DialogContentProps) {
  const {
    open,
    setOpen,
    contentId,
    accessibilityLabel,
    closeOnOverlayClick,
    closeOnEscape,
    onInteractOutside,
    onEscapeKeyDown,
  } = useDialogContext();
  const slots = useSlotRecipe<DialogSlots>('dialog', { size });
  const reducedMotion = usePrefersReducedMotion();

  const [mounted, setMounted] = useState(open);
  const opacity = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;
  const scale = useRef(new Animated.Value(reducedMotion ? 1 : 0.98)).current;

  useEffect(() => {
    if (open) {
      setMounted(true);
      if (reducedMotion || process.env.NODE_ENV === 'test') {
        opacity.setValue(1);
        scale.setValue(1);
        return;
      }
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: TRANSITION_MS, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: TRANSITION_MS, useNativeDriver: true }),
      ]).start();
      return;
    }
    if (reducedMotion || process.env.NODE_ENV === 'test') {
      opacity.setValue(0);
      scale.setValue(0.98);
      setMounted(false);
      return;
    }
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: TRANSITION_MS, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 0.98, duration: TRANSITION_MS, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) setMounted(false);
    });
  }, [open, opacity, scale, reducedMotion]);

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
    // `onRequestClose` cobre back hardware Android. Honra `closeOnEscape` +
    // `onEscapeKeyDown` com `preventDefault`.
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
        justifyContent="center"
        alignItems="center"
        // Scrim é gesto, não botão semântico — desabilita role default.
        accessibilityRole="none"
      >
        {/* Backdrop pintada via slot overlay para usar token de cor themable. */}
        <Box {...(slots.overlay as Record<string, unknown>)} />
        <Animated.View
          accessibilityViewIsModal
          accessibilityRole={'none' as never}
          accessibilityLabel={accessibilityLabel}
          nativeID={contentId}
          style={{
            opacity,
            transform: [{ scale }],
            position: 'absolute',
            maxWidth: '90%',
          }}
        >
          {/* Container interno absorve toques para não fechar quando o
              usuário interage com o conteúdo do dialog. */}
          <Clickable onClick={() => {}} accessibilityRole="none">
            <Box {...(slots.content as Record<string, unknown>)}>{children}</Box>
          </Clickable>
        </Animated.View>
      </Clickable>
    </Modal>
  );
}

DialogContent.displayName = 'Dialog.Content';

function DialogTitle({ children }: DialogTitleProps) {
  const { titleId } = useDialogContext();
  const slots = useSlotRecipe<DialogSlots>('dialog', {});
  // Native consome o spread da slot recipe direto no `<Text>` (paridade com
  // web). A slot carrega fontSize/fontWeight/lineHeight/letterSpacing/color
  // como tokens themables — sem reaplicação manual ou cast unsafe.
  return (
    <Text as="span" nativeID={titleId} {...(slots.title as Record<string, unknown>)}>
      {children}
    </Text>
  );
}

DialogTitle.displayName = 'Dialog.Title';

function DialogDescription({ children }: DialogDescriptionProps) {
  const { descriptionId } = useDialogContext();
  const slots = useSlotRecipe<DialogSlots>('dialog', {});
  return (
    <Text as="span" nativeID={descriptionId} {...(slots.description as Record<string, unknown>)}>
      {children}
    </Text>
  );
}

DialogDescription.displayName = 'Dialog.Description';

function DialogClose({ children, accessibilityLabel = 'Fechar' }: DialogCloseProps) {
  const { setOpen } = useDialogContext();
  const slots = useSlotRecipe<DialogSlots>('dialog', {});

  if (children) {
    const child = children as React.ReactElement<ChildPressProps>;
    const childOnPress = child.props.onPress;
    return React.cloneElement(child, {
      onPress: () => {
        // Compor: chama o handler original do filho ANTES de fechar.
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

DialogClose.displayName = 'Dialog.Close';

/**
 * @platform native
 *
 * Dialog nativo — `Modal transparent` + scrim `Clickable` + `Animated` fade+scale
 * (160ms régua sóbria). `Modal` é o caminho confiável para sobrepor a tela em RN
 * (analogous ao bloqueio modal do dialog web). Toque no scrim fecha (respeita
 * `closeOnOverlayClick` + `onInteractOutside`); toque no conteúdo é absorvido
 * pelo Clickable interno. Botão hardware Back/Escape dispara `onRequestClose`
 * (respeita `closeOnEscape` + `onEscapeKeyDown`). `accessibilityViewIsModal`
 * impede que screen reader navegue para a UI subjacente enquanto o dialog está
 * aberto.
 *
 * @see {@link DialogRootProps}
 */
export const Dialog = Object.assign(DialogRoot, {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
});
