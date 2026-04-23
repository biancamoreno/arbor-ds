import { Box } from '../../core';
import type { MenuLabelProps } from '../interfaces/MenuProps';

export function MenuLabel({ children }: MenuLabelProps) {
  return (
    <Box
      as="li"
      role="presentation"
      paddingX="small"
      paddingY="tiny"
      fontSize="xsmall"
      fontWeight="medium"
      color="text.secondary"
      textTransform="uppercase"
      letterSpacing="0.05em"
    >
      {children}
    </Box>
  );
}
