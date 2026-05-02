import React from 'react';
import { render, screen } from '@testing-library/react';
import { Spinner } from './spinner';
import { ArborProvider } from '../../../ecosystem';
import { themeLight } from '../../../foundations';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

describe('Spinner', () => {
  it('renderiza com role="status"', () => {
    render(<Spinner />, { wrapper });
    expect(screen.getByRole('status')).toBeTruthy();
  });

  it('tem aria-label padrão "Carregando"', () => {
    render(<Spinner />, { wrapper });
    expect(screen.getByLabelText('Carregando')).toBeTruthy();
  });

  it('aceita aria-label customizado', () => {
    render(<Spinner label="Aguarde" />, { wrapper });
    expect(screen.getByLabelText('Aguarde')).toBeTruthy();
  });

  it('aceita size sm — 16px', () => {
    render(<Spinner size="sm" />, { wrapper });
    expect(screen.getByRole('status').style.width).toBe('16px');
  });

  it('aceita size md — 24px', () => {
    render(<Spinner size="md" />, { wrapper });
    expect(screen.getByRole('status').style.width).toBe('24px');
  });

  it('aceita size lg — 40px', () => {
    render(<Spinner size="lg" />, { wrapper });
    expect(screen.getByRole('status').style.width).toBe('40px');
  });

  it('aceita color customizada', () => {
    render(<Spinner color="#ff0000" />, { wrapper });
    expect(screen.getByRole('status')).toBeTruthy();
  });

  it('aplica style extra', () => {
    render(<Spinner style={{ opacity: 0.5 }} />, { wrapper });
    expect(screen.getByRole('status').style.opacity).toBe('0.5');
  });

  it('renderiza ícone SVG interno (loader-circle)', () => {
    const { container } = render(<Spinner />, { wrapper });
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('tem animação de spin', () => {
    render(<Spinner />, { wrapper });
    expect(screen.getByRole('status').style.animation).toContain('arbor-spin');
  });

  it('expõe displayName', () => {
    expect(Spinner.displayName).toBe('Spinner');
  });
});
