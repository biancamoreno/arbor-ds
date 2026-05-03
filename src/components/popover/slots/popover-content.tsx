import { Portal, DismissableLayer } from '../../../ecosystem/primitives';
import { Flex } from '../../core';
import { usePopoverContext } from '../context/popover-context';
import type { PopoverContentProps } from '../interfaces/PopoverProps';

export function PopoverContent({ children }: PopoverContentProps) {
  const { open, setOpen, titleId, triggerRef } = usePopoverContext();

  if (!open) return null;

  return (
    <Portal>
      <DismissableLayer onDismiss={() => setOpen(false)} excludeRef={triggerRef}>
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
