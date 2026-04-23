import { Text } from '../../core';
import { useDialogContext } from '../context/dialog-context';
import type { DialogDescriptionProps } from '../interfaces/DialogProps';

export function DialogDescription({ children }: DialogDescriptionProps) {
  const { descriptionId } = useDialogContext();

  return (
    <Text
      as="p"
      id={descriptionId}
      color="text.secondary"
      fontSize="small"
      style={{ margin: 0 }}
    >
      {children}
    </Text>
  );
}
