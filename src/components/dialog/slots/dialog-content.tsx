import { useEffect, useRef, useState } from 'react';
import { Portal, FocusScope, DismissableLayer } from '../../../ecosystem/primitives';
import { Flex } from '../../core';
import { transition } from '../../../ecosystem/utils/functions';
import { useDialogContext } from '../context/dialog-context';
import type { DialogContentProps } from '../interfaces/DialogProps';

const sizeMap = {
  sm: '420px',
  md: '560px',
  lg: '720px',
} as const;

export function DialogContent({ children, size = 'md' }: DialogContentProps) {
  const { open, setOpen, titleId, descriptionId } = useDialogContext();
  const close = () => setOpen(false);

  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (open) {
      setMounted(true);
      frameRef.current = requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 200);
      return () => clearTimeout(t);
    }
    return () => cancelAnimationFrame(frameRef.current);
  }, [open]);

  if (!mounted) return null;

  return (
    <Portal>
      <DismissableLayer onDismiss={close} disableOutsideClick>
        <FocusScope trapped autoFocus restoreFocus>
          <Flex
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            position="fixed"
            zIndex="modal"
            flexDirection="column"
            gap="small"
            padding="large"
            borderRadius="large"
            backgroundColor="surface.raised"
            boxShadow="xl"
            style={{
              top: '50%',
              left: '50%',
              width: '90%',
              maxWidth: sizeMap[size],
              outline: 'none',
              transform: `translate(-50%, -50%) scale(${visible ? 1 : 0.95})`,
              opacity: visible ? 1 : 0,
              transition: transition(['transform', 'opacity'], 'normal', 'decelerate'),
            }}
          >
            {children}
          </Flex>
        </FocusScope>
      </DismissableLayer>
    </Portal>
  );
}
