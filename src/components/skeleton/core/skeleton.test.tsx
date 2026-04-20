import React from 'react';
import { render, screen } from '@testing-library/react';
import { Skeleton } from './skeleton';
import { ArborProvider } from '../../../ecosystem';
import { themeLight } from '../../../foundations';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

describe('Skeleton', () => {
  it('renderiza com role="status"', () => {
    render(<Skeleton />, { wrapper });
    expect(screen.getByRole('status')).toBeTruthy();
  });

  it('tem aria-label "Carregando"', () => {
    render(<Skeleton />, { wrapper });
    expect(screen.getByLabelText('Carregando')).toBeTruthy();
  });

  it('aplica width numérico', () => {
    render(<Skeleton width={200} />, { wrapper });
    expect(screen.getByRole('status').style.width).toBe('200px');
  });

  it('aplica width em string CSS', () => {
    render(<Skeleton width="50%" />, { wrapper });
    expect(screen.getByRole('status').style.width).toBe('50%');
  });

  it('aplica height', () => {
    render(<Skeleton height={32} />, { wrapper });
    expect(screen.getByRole('status').style.height).toBe('32px');
  });

  it('aplica borderRadius numérico', () => {
    render(<Skeleton borderRadius={8} />, { wrapper });
    expect(screen.getByRole('status').style.borderRadius).toBe('8px');
  });

  it('renderiza múltiplas linhas com prop lines', () => {
    const { container } = render(<Skeleton lines={3} />, { wrapper });
    const spans = container.querySelectorAll('span[aria-hidden]');
    expect(spans).toHaveLength(3);
  });

  it('última linha tem menor largura quando lines > 1', () => {
    const { container } = render(<Skeleton lines={3} />, { wrapper });
    const spans = container.querySelectorAll<HTMLSpanElement>('span[aria-hidden]');
    expect(spans[2].style.width).toBe('60%');
  });

  it('aplica style extra', () => {
    render(<Skeleton style={{ opacity: 0.5 }} />, { wrapper });
    expect(screen.getByRole('status').style.opacity).toBe('0.5');
  });

  it('passa data-testid extra', () => {
    render(<Skeleton data-testid="skel" />, { wrapper });
    expect(screen.getByTestId('skel')).toBeTruthy();
  });
});
