import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from './progress-bar';
import { ArborProvider } from '../../../ecosystem';
import { themeLight } from '../../../foundations';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

describe('ProgressBar', () => {
  it('renderiza com role="progressbar"', () => {
    render(<ProgressBar progress={50} />, { wrapper });
    expect(screen.getByRole('progressbar')).toBeTruthy();
  });

  it('expõe aria-valuenow correto', () => {
    render(<ProgressBar progress={75} />, { wrapper });
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('75');
  });

  it('expõe aria-valuemin=0', () => {
    render(<ProgressBar progress={50} />, { wrapper });
    expect(screen.getByRole('progressbar').getAttribute('aria-valuemin')).toBe('0');
  });

  it('expõe aria-valuemax=100', () => {
    render(<ProgressBar progress={50} />, { wrapper });
    expect(screen.getByRole('progressbar').getAttribute('aria-valuemax')).toBe('100');
  });

  it('aceita aria-label via prop label', () => {
    render(<ProgressBar progress={30} label="Carregando arquivo" />, { wrapper });
    expect(screen.getByLabelText('Carregando arquivo')).toBeTruthy();
  });

  it('clamp: progress > 100 vira 100', () => {
    render(<ProgressBar progress={150} />, { wrapper });
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('100');
  });

  it('clamp: progress < 0 vira 0', () => {
    render(<ProgressBar progress={-10} />, { wrapper });
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('0');
  });

  it('aceita size sm', () => {
    render(<ProgressBar progress={50} size="sm" />, { wrapper });
    expect(screen.getByRole('progressbar').style.height).toBe('4px');
  });

  it('aceita size lg', () => {
    render(<ProgressBar progress={50} size="lg" />, { wrapper });
    expect(screen.getByRole('progressbar').style.height).toBe('12px');
  });

  it('aceita tone success', () => {
    render(<ProgressBar progress={50} tone="success" />, { wrapper });
    expect(screen.getByRole('progressbar')).toBeTruthy();
  });

  it('aplica style extra', () => {
    render(<ProgressBar progress={50} style={{ opacity: 0.5 }} />, { wrapper });
    expect(screen.getByRole('progressbar').style.opacity).toBe('0.5');
  });

  it('indeterminate não expõe aria-valuenow', () => {
    render(<ProgressBar progress={0} indeterminate />, { wrapper });
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBeNull();
  });

  it('indeterminate expõe aria-busy', () => {
    render(<ProgressBar progress={0} indeterminate />, { wrapper });
    expect(screen.getByRole('progressbar').getAttribute('aria-busy')).toBe('true');
  });
});
