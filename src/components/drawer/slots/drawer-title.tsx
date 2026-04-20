import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useDrawerContext } from '../context/drawer-context';
import type { DrawerTitleProps } from '../interfaces/DrawerProps';

export function DrawerTitle({ children }: DrawerTitleProps) {
  const { titleId } = useDrawerContext();
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
