import React from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import type { ModalProps } from '../interfaces';

const sizeMap = {
  sm: '420px',
  md: '560px',
  lg: '720px',
} as const;

export function Modal({
  open,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeLabel = 'Close modal',
  closeOnOverlayClick = true,
  onOpenChange,
}: ModalProps) {
  const theme = useTheme();

  React.useEffect(() => {
    if (!open || typeof document === 'undefined') {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange?.(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  if (!open) {
    return null;
  }

  return (
    <div
      role="presentation"
      onClick={() => {
        if (closeOnOverlayClick) {
          onOpenChange?.(false);
        }
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: theme.zIndices.modal,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.space.medium,
        backgroundColor: theme.colors.background.overlay,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        onClick={(event) => event.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: sizeMap[size],
          display: 'flex',
          flexDirection: 'column',
          gap: theme.space.small,
          padding: theme.space.large,
          borderRadius: theme.radii.large,
          backgroundColor: theme.colors.surface.raised,
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.16)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0 }}>
            {title && (
              <h2
                style={{
                  margin: 0,
                  color: theme.colors.text.primary,
                  fontSize: theme.fontSizes.medium,
                }}
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                style={{
                  margin: 0,
                  color: theme.colors.text.secondary,
                  fontSize: theme.fontSizes.small,
                }}
              >
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label={closeLabel}
            onClick={() => onOpenChange?.(false)}
            style={{
              border: 'none',
              background: 'transparent',
              color: theme.colors.text.secondary,
              cursor: 'pointer',
              fontSize: theme.fontSizes.medium,
              lineHeight: 1,
            }}
          >
            x
          </button>
        </div>
        {children && <div style={{ color: theme.colors.text.primary }}>{children}</div>}
        {footer && <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;
