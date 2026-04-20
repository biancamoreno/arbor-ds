import { Portal, FocusScope, DismissableLayer } from '../../../ecosystem/primitives';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useDialogContext } from '../context/dialog-context';
import type { DialogContentProps } from '../interfaces/DialogProps';

const sizeMap = {
  sm: '420px',
  md: '560px',
  lg: '720px',
} as const;

export function DialogContent({ children, size = 'md' }: DialogContentProps) {
  const { isOpen, close, titleId, descriptionId } = useDialogContext();
  const theme = useTheme();

  if (!isOpen) return null;

  return (
    <Portal>
      <DismissableLayer onDismiss={close} disableOutsideClick>
        <FocusScope trapped autoFocus restoreFocus>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: theme.zIndices.modal,
              width: '90%',
              maxWidth: sizeMap[size],
              display: 'flex',
              flexDirection: 'column',
              gap: theme.space.small,
              padding: theme.space.large,
              borderRadius: theme.radii.large,
              backgroundColor: theme.colors.surface.raised,
              boxShadow: '0 20px 48px rgba(0, 0, 0, 0.16)',
              outline: 'none',
            }}
          >
            {children}
          </div>
        </FocusScope>
      </DismissableLayer>
    </Portal>
  );
}
