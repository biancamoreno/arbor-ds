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
import type { IconName } from '../../core';
import { Portal } from '../../../ecosystem/primitives';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { ToastContext, useToastContext } from '../context/toast-context';
import { toastStore } from '../store/toast-store';
import type { FeedbackTone } from '../../../foundations';
import type {
  ToastRootProps,
  ToastIconProps,
  ToastTitleProps,
  ToastDescriptionProps,
  ToastCloseProps,
  ToasterProps,
  ToastPlacement,
  ToastItem,
} from '../interfaces';

type ToastSlots = 'root' | 'icon' | 'title' | 'description' | 'close';

const TONE_ICON: Record<FeedbackTone, IconName> = {
  neutral: 'Bell',
  brand: 'Megaphone',
  info: 'Info',
  success: 'CircleCheck',
  warning: 'TriangleAlert',
  critical: 'CircleAlert',
};

const ASSERTIVE_TONES = new Set<FeedbackTone>(['critical', 'warning']);

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
  const slots = useSlotRecipe<ToastSlots>('toast', { tone });
  const isAssertive = ASSERTIVE_TONES.has(tone);

  return (
    <ToastContext.Provider value={{ tone }}>
      <Flex
        role="status"
        aria-live={isAssertive ? 'assertive' : 'polite'}
        aria-atomic="true"
        data-testid={testID}
        className={className}
        style={style}
        animation="arbor-toast-in 0.2s ease forwards"
        {...slots.root}
      >
        {children}
      </Flex>
    </ToastContext.Provider>
  );
}

function ToastIcon({ children, className, style, testID }: ToastIconProps) {
  const { tone } = useToastContext();
  const slots = useSlotRecipe<ToastSlots>('toast', { tone });

  return (
    <Box
      as="span"
      aria-hidden="true"
      data-testid={testID}
      className={className}
      style={style}
      {...slots.icon}
    >
      {children ?? <Icon name={TONE_ICON[tone]} size="medium" />}
    </Box>
  );
}

function ToastTitle({ children, className, style, testID }: ToastTitleProps) {
  const { tone } = useToastContext();
  const slots = useSlotRecipe<ToastSlots>('toast', { tone });

  return (
    <Text as="p" data-testid={testID} className={className} style={style} {...slots.title}>
      {children}
    </Text>
  );
}

function ToastDescription({ children, className, style, testID }: ToastDescriptionProps) {
  const { tone } = useToastContext();
  const slots = useSlotRecipe<ToastSlots>('toast', { tone });

  return (
    <Text as="p" data-testid={testID} className={className} style={style} {...slots.description}>
      {children}
    </Text>
  );
}

function ToastClose({ accessibilityLabel = 'Fechar', onClose, className, style, testID }: ToastCloseProps) {
  const { tone } = useToastContext();
  const slots = useSlotRecipe<ToastSlots>('toast', { tone });

  return (
    <Clickable
      as="button"
      type="button"
      aria-label={accessibilityLabel}
      onClick={onClose}
      data-testid={testID}
      className={className}
      style={style}
      {...slots.close}
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
      <ToastIcon>{item.icon}</ToastIcon>
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
ToastIcon.displayName = 'Toast.Icon';
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
 * (`Toast.Root`/`Icon`/`Title`/`Description`/`Close`) existem para
 * customização do layout dentro da render-prop do `Toaster`.
 *
 * @see {@link ToastRootProps}
 * @see {@link ToasterProps}
 */
export const Toast = Object.assign(ToastRoot, {
  Root: ToastRoot,
  Icon: ToastIcon,
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
