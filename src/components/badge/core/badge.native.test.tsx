import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Badge } from './badge';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

describe('Badge (native)', () => {
  it('renders children', () => {
    render(<Badge>3</Badge>, { wrapper: Wrapper });
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('renders with tone and variant props', () => {
    render(
      <Badge tone="critical" variant="solid">
        Erro
      </Badge>,
      { wrapper: Wrapper }
    );
    expect(screen.getByText('Erro')).toBeTruthy();
  });

  it('renders Badge.Anchor with badge slot', () => {
    render(
      <Badge.Anchor badge={<Badge tone="critical">9</Badge>}>
        <Badge>icon</Badge>
      </Badge.Anchor>,
      { wrapper: Wrapper }
    );
    expect(screen.getByText('9')).toBeTruthy();
    expect(screen.getByText('icon')).toBeTruthy();
  });
});
