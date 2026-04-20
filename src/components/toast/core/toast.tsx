import React, { useEffect, useSyncExternalStore } from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { Portal } from '../../../ecosystem/primitives';
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

function getToneColors(tone: ToastTone, theme: ReturnType<typeof useTheme>) {
  const c = theme.colors;
  const map: Record<ToastTone, { border: string }> = {
    neutral: { border: c.border.default },
    info: { border: c.status.info },
    success: { border: c.feedback.success.base },
    warning: { border: c.feedback.warning.base },
    critical: { border: c.feedback.critical.base },
  };
  return map[tone];
}

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
  const theme = useTheme();
  const { border } = getToneColors(tone, theme);
  injectKeyframes();

  return (
    <div
      role="status"
      aria-live={tone === 'critical' ? 'assertive' : 'polite'}
      aria-atomic="true"
      {...props}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: theme.space.small,
        padding: `${theme.space.small} ${theme.space.medium}`,
        borderRadius: theme.radii.small,
        backgroundColor: theme.colors.surface.raised,
        borderLeftWidth: '4px',
        borderLeftStyle: 'solid',
        borderLeftColor: border,
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        animation: 'arbor-toast-in 0.2s ease forwards',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function ToastTitle({ children, style, ...props }: ToastTitleProps) {
  const theme = useTheme();
  return (
    <p
      {...props}
      style={{
        margin: 0,
        fontWeight: theme.fontWeights.medium,
        fontSize: theme.fontSizes.small,
        lineHeight: '20px',
        color: theme.colors.text.primary,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

function ToastDescription({ children, style, ...props }: ToastDescriptionProps) {
  const theme = useTheme();
  return (
    <p
      {...props}
      style={{
        margin: 0,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.text.secondary,
        lineHeight: '20px',
        ...style,
      }}
    >
      {children}
    </p>
  );
}

function ToastClose({ label = 'Fechar', onClose, style, ...props }: ToastCloseProps) {
  const theme = useTheme();
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClose}
      {...props}
      style={{
        marginLeft: 'auto',
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '20px',
        height: '20px',
        padding: 0,
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        color: theme.colors.text.secondary,
        borderRadius: theme.radii.nano,
        ...style,
      }}
    >
      ×
    </button>
  );
}

function ToastItemRenderer({ item }: { item: import('../interfaces').ToastItem }) {
  const theme = useTheme();

  useEffect(() => {
    if (!item.duration) return;
    const t = setTimeout(() => toastStore.remove(item.id), item.duration);
    return () => clearTimeout(t);
  }, [item.id, item.duration]);

  return (
    <ToastRoot tone={item.tone}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: theme.space.micro }}>
        {item.title && <ToastTitle>{item.title}</ToastTitle>}
        {item.description && <ToastDescription>{item.description}</ToastDescription>}
      </div>
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
      <div
        aria-label="Notificações"
        style={getPlacementStyle(placement)}
      >
        {items.map((item) => (
          <ToastItemRenderer key={item.id} item={item} />
        ))}
      </div>
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
