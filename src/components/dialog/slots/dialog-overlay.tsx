import { Portal } from '../../../ecosystem/primitives';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useDialogContext } from '../context/dialog-context';
import type { DialogOverlayProps } from '../interfaces/DialogProps';

export function DialogOverlay({ style }: DialogOverlayProps) {
  const { isOpen, close } = useDialogContext();
  const theme = useTheme();

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        aria-hidden="true"
        onClick={close}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: theme.zIndices.overlay,
          backgroundColor: theme.colors.background.overlay,
          ...style,
        }}
      />
    </Portal>
  );
}
