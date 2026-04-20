import { useTheme } from '../../../ecosystem/styled-system/adapters';

export function MenuSeparator() {
  const theme = useTheme();

  return (
    <li
      role="separator"
      style={{
        height: '1px',
        margin: `${theme.space.tiny} 0`,
        backgroundColor: theme.colors.border.default,
      }}
    />
  );
}
