import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Skeleton } from './skeleton.native';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

describe('Skeleton (native)', () => {
  it('renders with default accessibility label', () => {
    render(<Skeleton />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Carregando')).toBeTruthy();
  });

  it('renders multiple lines when prop is set', () => {
    render(<Skeleton lines={3} />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Carregando')).toBeTruthy();
  });

  it('accepts numeric width/height', () => {
    render(<Skeleton width={120} height={20} />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Carregando')).toBeTruthy();
  });

  it('accepts string width and borderRadius', () => {
    render(<Skeleton width="50%" borderRadius={8} />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Carregando')).toBeTruthy();
  });
});
