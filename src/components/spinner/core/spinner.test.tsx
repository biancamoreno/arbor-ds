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

  it('aceita size sm', () => {
    render(<Spinner size="sm" />, { wrapper });
    expect(screen.getByRole('status').getAttribute('width')).toBe('16');
  });

  it('aceita size md', () => {
    render(<Spinner size="md" />, { wrapper });
    expect(screen.getByRole('status').getAttribute('width')).toBe('24');
  });

  it('aceita size lg', () => {
    render(<Spinner size="lg" />, { wrapper });
    expect(screen.getByRole('status').getAttribute('width')).toBe('40');
  });

  it('aceita color customizada', () => {
    render(<Spinner color="#ff0000" />, { wrapper });
    expect(screen.getByRole('status')).toBeTruthy();
  });

  it('aplica style extra', () => {
    render(<Spinner style={{ opacity: 0.5 }} />, { wrapper });
    expect(screen.getByRole('status').style.opacity).toBe('0.5');
  });

  it('renderiza SVG com círculos internos', () => {
    const { container } = render(<Spinner />, { wrapper });
    const circles = container.querySelectorAll('circle');
    expect(circles).toHaveLength(2);
  });
});
