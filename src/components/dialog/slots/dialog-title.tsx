import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useDialogContext } from '../context/dialog-context';
import type { DialogTitleProps } from '../interfaces/DialogProps';

export function DialogTitle({ children }: DialogTitleProps) {
  const { titleId } = useDialogContext();
  const theme = useTheme();

  return (
    <h2
      id={titleId}
      style={{
        margin: 0,
        color: theme.colors.text.primary,
        fontSize: theme.fontSizes.medium,
        fontWeight: theme.fontWeights.medium,
      }}
    >
      {children}
    </h2>
  );
}
