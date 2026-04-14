import { useTheme } from '../../../ecosystem/styled-system/adapters';
import type { DrawerProps } from '../interfaces';

const widthMap = {
  sm: '320px',
  md: '420px',
  lg: '560px',
} as const;

const heightMap = {
  sm: '240px',
  md: '320px',
  lg: '420px',
} as const;

function getPanelPosition(placement: NonNullable<DrawerProps['placement']>, size: NonNullable<DrawerProps['size']>) {
  if (placement === 'bottom') {
    return {
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: heightMap[size],
      borderRadius: '24px 24px 0 0',
    };
  }

  if (placement === 'left') {
    return {
      left: 0,
      top: 0,
      bottom: 0,
      width: widthMap[size],
      height: '100%',
      borderRadius: '0 24px 24px 0',
    };
  }

  return {
    right: 0,
    top: 0,
    bottom: 0,
    width: widthMap[size],
    height: '100%',
    borderRadius: '24px 0 0 24px',
  };
}

export function Drawer({
  open,
  title,
  description,
  children,
  footer,
  placement = 'right',
  size = 'md',
  closeLabel = 'Close drawer',
  closeOnOverlayClick = true,
  onOpenChange,
}: DrawerProps) {
  const theme = useTheme();

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
        zIndex: theme.zIndices.overlay,
        backgroundColor: theme.colors.background.overlay,
      }}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        onClick={(event) => event.stopPropagation()}
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          gap: theme.space.small,
          padding: theme.space.large,
          backgroundColor: theme.colors.surface.raised,
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.16)',
          ...getPanelPosition(placement, size),
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
        <div style={{ flex: 1, overflowY: 'auto', color: theme.colors.text.primary }}>{children}</div>
        {footer && <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>{footer}</div>}
      </aside>
    </div>
  );
}

export default Drawer;
