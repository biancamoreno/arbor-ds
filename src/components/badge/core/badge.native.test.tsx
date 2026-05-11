import React from 'react';
import { Text as RNText } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Badge } from './badge';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

describe('Badge (native)', () => {
  it('renderiza children como texto', () => {
    render(<Badge>3</Badge>, { wrapper: Wrapper });
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('aceita tone × variant', () => {
    render(
      <Badge tone="critical" variant="solid">
        Erro
      </Badge>,
      { wrapper: Wrapper }
    );
    expect(screen.getByText('Erro')).toBeTruthy();
  });

  it('aceita variant subtle', () => {
    render(
      <Badge tone="info" variant="subtle">
        Info
      </Badge>,
      { wrapper: Wrapper }
    );
    expect(screen.getByText('Info')).toBeTruthy();
  });

  it('renderiza com icon e children', () => {
    render(
      <Badge icon={<RNText>★</RNText>}>3</Badge>,
      { wrapper: Wrapper },
    );
    expect(screen.getByText('★')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('não expõe accessibilityRole="button"', () => {
    render(<Badge>x</Badge>, { wrapper: Wrapper });
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renderiza Badge.Anchor com badge slot', () => {
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
