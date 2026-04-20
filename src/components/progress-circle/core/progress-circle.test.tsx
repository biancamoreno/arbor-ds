import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProgressCircle } from './progress-circle';
import { ArborProvider } from '../../../ecosystem';
import { themeLight } from '../../../foundations';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

describe('ProgressCircle', () => {
  it('renderiza com role="progressbar"', () => {
    render(<ProgressCircle progress={50} />, { wrapper });
    expect(screen.getByRole('progressbar')).toBeTruthy();
  });

  it('expõe aria-valuenow', () => {
    render(<ProgressCircle progress={40} />, { wrapper });
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('40');
  });

  it('expõe aria-valuemin=0 e aria-valuemax=100', () => {
    render(<ProgressCircle progress={40} />, { wrapper });
    const el = screen.getByRole('progressbar');
    expect(el.getAttribute('aria-valuemin')).toBe('0');
    expect(el.getAttribute('aria-valuemax')).toBe('100');
  });

  it('clamp: progress > 100 vira 100', () => {
    render(<ProgressCircle progress={200} />, { wrapper });
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('100');
  });

  it('clamp: progress < 0 vira 0', () => {
    render(<ProgressCircle progress={-5} />, { wrapper });
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('0');
  });

  it('aceita size customizado', () => {
    render(<ProgressCircle progress={50} size={64} />, { wrapper });
    expect(screen.getByRole('progressbar').getAttribute('width')).toBe('64');
  });

  it('aceita aria-label via prop label', () => {
    render(<ProgressCircle progress={50} label="Upload 50%" />, { wrapper });
    expect(screen.getByLabelText('Upload 50%')).toBeTruthy();
  });

  it('aceita tone success', () => {
    render(<ProgressCircle progress={80} tone="success" />, { wrapper });
    expect(screen.getByRole('progressbar')).toBeTruthy();
  });

  it('renderiza dois círculos SVG', () => {
    const { container } = render(<ProgressCircle progress={50} />, { wrapper });
    expect(container.querySelectorAll('circle')).toHaveLength(2);
  });

  it('aceita strokeWidth customizado', () => {
    render(<ProgressCircle progress={50} strokeWidth={8} />, { wrapper });
    expect(screen.getByRole('progressbar')).toBeTruthy();
  });
});
