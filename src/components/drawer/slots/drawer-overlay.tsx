import { Portal } from '../../../ecosystem/primitives';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useDrawerContext } from '../context/drawer-context';
import type { DrawerOverlayProps } from '../interfaces/DrawerProps';

export function DrawerOverlay({ style }: DrawerOverlayProps) {
  const { isOpen, close } = useDrawerContext();
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
