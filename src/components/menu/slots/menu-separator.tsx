import { Box } from '../../core';

export function MenuSeparator() {
  return (
    <Box
      as="li"
      role="separator"
      height={1}
      marginY="tiny"
      backgroundColor="border.default"
    />
  );
}
