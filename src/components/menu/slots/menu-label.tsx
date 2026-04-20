import { useTheme } from '../../../ecosystem/styled-system/adapters';
import type { MenuLabelProps } from '../interfaces/MenuProps';

export function MenuLabel({ children }: MenuLabelProps) {
  const theme = useTheme();

  return (
    <li
      role="presentation"
      style={{
        padding: `${theme.space.tiny} ${theme.space.small}`,
        fontSize: theme.fontSizes.xsmall,
        fontWeight: theme.fontWeights.medium,
        color: theme.colors.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}
    >
      {children}
    </li>
  );
}
