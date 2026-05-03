/**
 * @platform shared
 *
 * Implementação web do compound `Toast` + `Toaster`. Estratégia: keyframe
 * `arbor-toast-in` é parte do `GLOBAL_CSS` do provider (mesma pattern do
 * Skeleton). Posicionamento via `position: fixed` controlado por `placement`.
 * A versão native fica em `toast.native.tsx` (Animated.Value + Portal).
 */
import React, { useEffect, useSyncExternalStore } from 'react';
import { Box, Flex, Text, Clickable, Icon } from '../../core';
import { Portal } from '../../../ecosystem/primitives';
import { transition } from '../../../foundations';
import { toastStore } from '../store/toast-store';
import type {
  ToastRootProps,
  ToastTitleProps,
  ToastDescriptionProps,
  ToastCloseProps,
  ToasterProps,
  ToastTone,
  ToastPlacement,
  ToastItem,
} from '../interfaces';

const TONE_BORDER: Record<ToastTone, string> = {
  neutral: 'border.default',
  info: 'feedback.info.base',
  success: 'feedback.success.base',
  warning: 'feedback.warning.base',
  critical: 'feedback.critical.base',
};

type PlacementProps = {
  top?: string | number;
  bottom?: string | number;
  left?: string | number;
  right?: string | number;
  flexDirection: 'column' | 'column-reverse';
  transform?: string;
};

function getPlacementProps(placement: ToastPlacement): PlacementProps {
  const isBottom = placement.startsWith('bottom');
  const flexDirection = isBottom ? 'column-reverse' : 'column';
  const vertical = isBottom ? { bottom: '16px' } : { top: '16px' };

  if (placement.endsWith('center')) {
    return { ...vertical, left: '50%', flexDirection, transform: 'translateX(-50%)' };
  }
  if (placement.endsWith('left')) {
    return { ...vertical, left: '16px', flexDirection };
  }
  return { ...vertical, right: '16px', flexDirection };
}

function ToastRoot({ children, tone = 'neutral', className, style, testID }: ToastRootProps) {
  const borderColor = TONE_BORDER[tone];

  return (
    <Flex
      role="status"
      aria-live={tone === 'critical' ? 'assertive' : 'polite'}
      aria-atomic="true"
      data-testid={testID}
      className={className}
      style={style}
      alignItems="flex-start"
      gap="small"
      padding="small"
      paddingX="medium"
      borderRadius="small"
      backgroundColor="surface.raised"
      borderLeftWidth="thick"
      borderLeftStyle="solid"
      borderLeftColor={borderColor}
      boxShadow="lg"
      animation="arbor-toast-in 0.2s ease forwards"
    >
      {children}
    </Flex>
  );
}

function ToastTitle({ children, className, style, testID }: ToastTitleProps) {
  return (
    <Text
      as="p"
      data-testid={testID}
      className={className}
      style={style}
      fontWeight="medium"
      fontSize="small"
      color="text.primary"
      margin={0}
    >
      {children}
    </Text>
  );
}

function ToastDescription({ children, className, style, testID }: ToastDescriptionProps) {
  return (
    <Text
      as="p"
      data-testid={testID}
      className={className}
      style={style}
      fontSize="small"
      color="text.secondary"
      margin={0}
    >
      {children}
    </Text>
  );
}

function ToastClose({ label = 'Fechar', onClose, className, style, testID }: ToastCloseProps) {
  return (
    <Clickable
      as="button"
      type="button"
      aria-label={label}
      onClick={onClose}
      data-testid={testID}
      className={className}
      style={style}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      minWidth={44}
      minHeight={44}
      width={20}
      height={20}
      flexShrink={0}
      cursor="pointer"
      color="text.secondary"
      borderRadius="nano"
      backgroundColor="transparent"
      borderWidth={0}
      padding={0}
      marginLeft="auto"
      transition={transition(['background-color', 'color'], 'fast')}
      _hover={{ backgroundColor: 'background.interactive', color: 'text.primary' }}
      _focusVisible={{ outlineColor: 'focus.ring', outlineWidth: '2px', outlineStyle: 'solid', outlineOffset: '2px' }}
    >
      <Icon name="X" size="small" />
    </Clickable>
  );
}

function ToastItemRenderer({ item }: { item: ToastItem }) {
  useEffect(() => {
    if (!item.duration) return;
    const t = setTimeout(() => toastStore.remove(item.id), item.duration);
    return () => clearTimeout(t);
  }, [item.id, item.duration]);

  return (
    <ToastRoot tone={item.tone}>
      <Flex flex={1} flexDirection="column" gap="micro">
        {item.title && <ToastTitle>{item.title}</ToastTitle>}
        {item.description && <ToastDescription>{item.description}</ToastDescription>}
      </Flex>
      <ToastClose onClose={() => toastStore.remove(item.id)} />
    </ToastRoot>
  );
}

function Toaster({ placement = 'bottom-right' }: ToasterProps) {
  const items = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getSnapshot,
  );

  if (items.length === 0) return null;

  const placementProps = getPlacementProps(placement);

  return (
    <Portal mode="overlay">
      <Box
        aria-label="Notificações"
        position="fixed"
        zIndex="toast"
        display="flex"
        flexDirection={placementProps.flexDirection}
        gap="small"
        maxWidth={420}
        width="100%"
        top={placementProps.top as React.CSSProperties['top']}
        bottom={placementProps.bottom as React.CSSProperties['bottom']}
        left={placementProps.left as React.CSSProperties['left']}
        right={placementProps.right as React.CSSProperties['right']}
        style={placementProps.transform ? { transform: placementProps.transform } : undefined}
      >
        {items.map((item) => (
          <ToastItemRenderer key={item.id} item={item} />
        ))}
      </Box>
    </Portal>
  );
}

ToastRoot.displayName = 'Toast.Root';
ToastTitle.displayName = 'Toast.Title';
ToastDescription.displayName = 'Toast.Description';
ToastClose.displayName = 'Toast.Close';
Toaster.displayName = 'Toaster';

/**
 * @platform shared
 *
 * Compound de toast — notificação efêmera disparada via store. `Toast` em si
 * raramente é montado direto; o uso canônico é disparar mensagens com
 * `useToast().toast(input)`, e a renderização real fica por conta de um
 * `<Toaster />` montado uma única vez na raiz da aplicação. Os slots
 * (`Toast.Root`/`Title`/`Description`/`Close`) existem para customização do
 * layout dentro da render-prop do `Toaster`.
 *
 * @see {@link ToastRootProps}
 * @see {@link ToasterProps}
 */
export const Toast = Object.assign(ToastRoot, {
  Root: ToastRoot,
  Title: ToastTitle,
  Description: ToastDescription,
  Close: ToastClose,
});

/**
 * @platform shared
 *
 * Container que escuta o `toastStore` e renderiza os toasts ativos via
 * `Portal` (`mode='overlay'` — toques passam pela UI subjacente em áreas
 * transparentes). Monte uma única vez na raiz da aplicação. `placement`
 * controla onde o stack aparece (default `'bottom-right'`).
 */
export { Toaster };
