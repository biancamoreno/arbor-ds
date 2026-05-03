import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tag } from './tag';
import { ArborProvider } from '../../../ecosystem';
import { themeLight } from '../../../foundations';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

describe('Tag (web)', () => {
  it('renderiza com role="button"', () => {
    render(<Tag>Filtro</Tag>, { wrapper });
    expect(screen.getByRole('button', { name: 'Filtro' })).toBeTruthy();
  });

  it('renderiza children', () => {
    render(<Tag>React</Tag>, { wrapper });
    expect(screen.getByText('React')).toBeTruthy();
  });

  it('selected expõe aria-pressed=true', () => {
    render(<Tag selected>Ativo</Tag>, { wrapper });
    expect(screen.getByRole('button').getAttribute('aria-pressed')).toBe('true');
  });

  it('default expõe aria-pressed=false', () => {
    render(<Tag>Inativo</Tag>, { wrapper });
    expect(screen.getByRole('button').getAttribute('aria-pressed')).toBe('false');
  });

  it('dispara onClick ao clicar', () => {
    const onClick = jest.fn();
    render(<Tag onClick={onClick}>Press</Tag>, { wrapper });
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('disabled bloqueia onClick', () => {
    const onClick = jest.fn();
    render(<Tag disabled onClick={onClick}>X</Tag>, { wrapper });
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true);
  });

  it('aceita tone="brand"', () => {
    render(<Tag tone="brand" selected>Brand</Tag>, { wrapper });
    expect(screen.getByText('Brand')).toBeTruthy();
  });
});
