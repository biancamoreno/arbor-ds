import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Spinner } from './spinner.native';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

describe('Spinner (native)', () => {
  it('renders with default label as accessibility label', () => {
    render(<Spinner />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Carregando')).toBeTruthy();
  });

  it('overrides label via prop', () => {
    render(<Spinner label="Aguarde" />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Aguarde')).toBeTruthy();
  });

  it('renders all sizes without crashing', () => {
    const { rerender } = render(<Spinner size="small" label="A" />, { wrapper: Wrapper });
    expect(screen.getByLabelText('A')).toBeTruthy();
    rerender(<Spinner size="medium" label="B" />);
    expect(screen.getByLabelText('B')).toBeTruthy();
    rerender(<Spinner size="large" label="C" />);
    expect(screen.getByLabelText('C')).toBeTruthy();
  });

  it('accepts custom color without crashing', () => {
    render(<Spinner color="#ff0000" label="Cor" />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Cor')).toBeTruthy();
  });

  it('exposes displayName', () => {
    expect(Spinner.displayName).toBe('Spinner');
  });
});
