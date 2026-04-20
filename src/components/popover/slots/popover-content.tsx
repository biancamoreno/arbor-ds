import { Portal, DismissableLayer } from '../../../ecosystem/primitives';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { usePopoverContext } from '../context/popover-context';
import type { PopoverContentProps } from '../interfaces/PopoverProps';

export function PopoverContent({ children }: PopoverContentProps) {
  const { isOpen, close, titleId } = usePopoverContext();
  const theme = useTheme();

  if (!isOpen) return null;

  return (
    <Portal>
      <DismissableLayer onDismiss={close}>
        <div
          role="dialog"
          aria-labelledby={titleId}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: theme.zIndices.popover,
            minWidth: '200px',
            maxWidth: '360px',
            display: 'flex',
            flexDirection: 'column',
            gap: theme.space.small,
            padding: theme.space.medium,
            borderRadius: theme.radii.medium,
            backgroundColor: theme.colors.surface.raised,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            outline: 'none',
          }}
        >
          {children}
        </div>
      </DismissableLayer>
    </Portal>
  );
}
