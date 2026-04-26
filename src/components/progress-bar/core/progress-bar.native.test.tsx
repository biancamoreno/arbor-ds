import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { ProgressBar } from './progress-bar';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

describe('ProgressBar (native)', () => {
  it('renders with determinate progress', () => {
    render(<ProgressBar progress={50} label="Carregando" />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Carregando')).toBeTruthy();
  });

  it('clamps progress to 0..100', () => {
    render(<ProgressBar progress={150} label="Acima" />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Acima')).toBeTruthy();
  });

  it('renders indeterminate variant', () => {
    render(<ProgressBar progress={0} indeterminate label="Indef" />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Indef')).toBeTruthy();
  });
});
