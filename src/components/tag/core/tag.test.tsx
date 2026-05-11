import React from 'react';
import { render, screen } from '@testing-library/react';
import { Tag } from './tag';
import { ArborProvider } from '../../../ecosystem';
import { themeLight } from '../../../foundations';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

describe('Tag (web)', () => {
  it('renderiza como <span> (não-interativo)', () => {
    render(<Tag>Filtro</Tag>, { wrapper });
    const el = screen.getByText('Filtro');
    expect(el.tagName).toBe('SPAN');
  });

  it('não expõe role="button"', () => {
    render(<Tag>Filtro</Tag>, { wrapper });
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renderiza children', () => {
    render(<Tag>React</Tag>, { wrapper });
    expect(screen.getByText('React')).toBeTruthy();
  });

  it('aceita tone="brand"', () => {
    render(<Tag tone="brand">Brand</Tag>, { wrapper });
    expect(screen.getByText('Brand')).toBeTruthy();
  });

  it('aceita variant="solid"', () => {
    render(<Tag variant="solid">Solid</Tag>, { wrapper });
    expect(screen.getByText('Solid')).toBeTruthy();
  });

  it('aceita combinação tone × variant', () => {
    render(<Tag tone="success" variant="solid">Sucesso</Tag>, { wrapper });
    expect(screen.getByText('Sucesso')).toBeTruthy();
  });
});
