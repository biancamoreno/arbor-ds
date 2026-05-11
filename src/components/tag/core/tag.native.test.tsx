import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Tag } from './tag';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

describe('Tag (native)', () => {
  it('renderiza children como texto', () => {
    render(<Tag>Filtro</Tag>, { wrapper: Wrapper });
    expect(screen.getByText('Filtro')).toBeTruthy();
  });

  it('não expõe accessibilityRole="button"', () => {
    render(<Tag>label</Tag>, { wrapper: Wrapper });
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('aceita tone="brand"', () => {
    render(<Tag tone="brand">Brand</Tag>, { wrapper: Wrapper });
    expect(screen.getByText('Brand')).toBeTruthy();
  });

  it('aceita variant="solid"', () => {
    render(<Tag variant="solid">Solid</Tag>, { wrapper: Wrapper });
    expect(screen.getByText('Solid')).toBeTruthy();
  });

  it('aceita combinação tone × variant', () => {
    render(<Tag tone="critical" variant="solid">Crítico</Tag>, { wrapper: Wrapper });
    expect(screen.getByText('Crítico')).toBeTruthy();
  });
});
