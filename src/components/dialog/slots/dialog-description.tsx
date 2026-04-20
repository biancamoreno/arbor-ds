import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useDialogContext } from '../context/dialog-context';
import type { DialogDescriptionProps } from '../interfaces/DialogProps';

export function DialogDescription({ children }: DialogDescriptionProps) {
  const { descriptionId } = useDialogContext();
  const theme = useTheme();

  return (
    <p
      id={descriptionId}
      style={{
        margin: 0,
        color: theme.colors.text.secondary,
        fontSize: theme.fontSizes.small,
      }}
    >
      {children}
    </p>
  );
}
