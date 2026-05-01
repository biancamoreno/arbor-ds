import { Portal, DismissableLayer } from '../../../ecosystem/primitives';
import { Flex } from '../../core';
import { usePopoverContext } from '../context/popover-context';
import type { PopoverContentProps } from '../interfaces/PopoverProps';

export function PopoverContent({ children }: PopoverContentProps) {
  const { isOpen, close, titleId, triggerRef } = usePopoverContext();

  if (!isOpen) return null;

  return (
    <Portal>
      <DismissableLayer onDismiss={close} excludeRef={triggerRef}>
        <Flex
          role="dialog"
          aria-labelledby={titleId}
          position="fixed"
          zIndex="popover"
          flexDirection="column"
          gap="small"
          padding="medium"
          borderRadius="medium"
          backgroundColor="surface.raised"
          outline="none"
          boxShadow="xl"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: '200px',
            maxWidth: '360px',
          }}
        >
          {children}
        </Flex>
      </DismissableLayer>
    </Portal>
  );
}
