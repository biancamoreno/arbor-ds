import React, { useEffect, useSyncExternalStore } from 'react';
import { Box, Flex, Text, Clickable } from '../../core';
import { Portal } from '../../../ecosystem/primitives';
import { Icon } from '../../core';
import { toastStore } from '../store/toast-store';
import type {
  ToastRootProps,
  ToastTitleProps,
  ToastDescriptionProps,
  ToastCloseProps,
  ToasterProps,
  ToastTone,
  ToastPlacement,
} from '../interfaces';

const KEYFRAMES_ID = 'arbor-toast-keyframes';

function injectKeyframes() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(KEYFRAMES_ID)) return;
  const style = document.createElement('style');
  style.id = KEYFRAMES_ID;
  style.textContent = `
    @keyframes arbor-toast-in {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
}

const TONE_BORDER: Record<ToastTone, string> = {
  neutral: 'border.default',
  info: 'status.info',
  success: 'feedback.success.base',
  warning: 'feedback.warning.base',
  critical: 'feedback.critical.base',
};

function getPlacementStyle(placement: ToastPlacement): React.CSSProperties {
  const base: React.CSSProperties = { position: 'fixed', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '420px', width: '100%' };
  const map: Record<ToastPlacement, React.CSSProperties> = {
    'top-left': { ...base, top: '16px', left: '16px' },
    'top-center': { ...base, top: '16px', left: '50%', transform: 'translateX(-50%)' },
    'top-right': { ...base, top: '16px', right: '16px' },
    'bottom-left': { ...base, bottom: '16px', left: '16px', flexDirection: 'column-reverse' },
    'bottom-center': { ...base, bottom: '16px', left: '50%', transform: 'translateX(-50%)', flexDirection: 'column-reverse' },
    'bottom-right': { ...base, bottom: '16px', right: '16px', flexDirection: 'column-reverse' },
  };
  return map[placement];
}

function ToastRoot({ children, tone = 'neutral', style, ...props }: ToastRootProps) {
  injectKeyframes();
  const borderColor = TONE_BORDER[tone];

  return (
    <Flex
      role="status"
      aria-live={tone === 'critical' ? 'assertive' : 'polite'}
      aria-atomic="true"
      {...props}
      alignItems="flex-start"
      gap="small"
      padding="small"
      paddingX="medium"
      borderRadius="small"
      backgroundColor="surface.raised"
      borderLeftWidth={4}
      borderLeftStyle="solid"
      borderLeftColor={borderColor as never}
      style={{
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        animation: 'arbor-toast-in 0.2s ease forwards',
        ...style,
      }}
    >
      {children}
    </Flex>
  );
}

function ToastTitle({ children, style, ...props }: ToastTitleProps) {
  return (
    <Text
      as="p"
      {...props}
      fontWeight="medium"
      fontSize="small"
      color="text.primary"
      style={{ margin: 0, lineHeight: '20px', ...style }}
    >
      {children}
    </Text>
  );
}

function ToastDescription({ children, style, ...props }: ToastDescriptionProps) {
  return (
    <Text
      as="p"
      {...props}
      fontSize="sm"
      color="text.secondary"
      style={{ margin: 0, lineHeight: '20px', ...style }}
    >
      {children}
    </Text>
  );
}

function ToastClose({ label = 'Fechar', onClose, style, ...props }: ToastCloseProps) {
  return (
    <Clickable
      as="button"
      type="button"
      aria-label={label}
      onClick={onClose}
      {...props}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      width={20}
      height={20}
      flexShrink={0}
      cursor="pointer"
      color="text.secondary"
      borderRadius="nano"
      style={{
        marginLeft: 'auto',
        padding: 0,
        border: 'none',
        background: 'none',
        ...style,
      }}
    >
      <Icon name="X" size={14} aria-hidden="true" />
    </Clickable>
  );
}

function ToastItemRenderer({ item }: { item: import('../interfaces').ToastItem }) {
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
    toastStore.getSnapshot
  );

  if (items.length === 0) return null;

  return (
    <Portal>
      <Box
        aria-label="Notificações"
        style={getPlacementStyle(placement)}
      >
        {items.map((item) => (
          <ToastItemRenderer key={item.id} item={item} />
        ))}
      </Box>
    </Portal>
  );
}

export const Toast = Object.assign(ToastRoot, {
  Root: ToastRoot,
  Title: ToastTitle,
  Description: ToastDescription,
  Close: ToastClose,
});

export { Toaster };
