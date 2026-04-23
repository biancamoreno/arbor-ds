import { Text } from '../../core';
import { useDialogContext } from '../context/dialog-context';
import type { DialogTitleProps } from '../interfaces/DialogProps';

export function DialogTitle({ children }: DialogTitleProps) {
  const { titleId } = useDialogContext();

  return (
    <Text
      as="h2"
      id={titleId}
      color="text.primary"
      fontSize="medium"
      fontWeight="medium"
      style={{ margin: 0 }}
    >
      {children}
    </Text>
  );
}
