import { Text } from '../../core';
import { useDrawerContext } from '../context/drawer-context';
import type { DrawerTitleProps } from '../interfaces/DrawerProps';

export function DrawerTitle({ children }: DrawerTitleProps) {
  const { titleId } = useDrawerContext();

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
