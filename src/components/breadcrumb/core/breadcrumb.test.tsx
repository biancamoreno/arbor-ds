import React from 'react';
import { render, screen } from '@testing-library/react';
import { Breadcrumb } from './breadcrumb';
import { ArborProvider } from '../../../ecosystem';
import { themeLight } from '../../../foundations';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

function BasicBreadcrumb() {
  return (
    <Breadcrumb>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          <Breadcrumb.Separator />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="/produtos">Produtos</Breadcrumb.Link>
          <Breadcrumb.Separator />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Breadcrumb.Current>Detalhes</Breadcrumb.Current>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb>
  );
}

describe('Breadcrumb', () => {
  it('renderiza nav com aria-label padrão', () => {
    render(<BasicBreadcrumb />, { wrapper });
    expect(screen.getByRole('navigation')).toBeTruthy();
    expect(screen.getByRole('navigation').getAttribute('aria-label')).toBe('Navegação estrutural');
  });

  it('aceita label customizado', () => {
    render(
      <Breadcrumb label="Breadcrumb">
        <Breadcrumb.List><Breadcrumb.Item><Breadcrumb.Current>X</Breadcrumb.Current></Breadcrumb.Item></Breadcrumb.List>
      </Breadcrumb>,
      { wrapper }
    );
    expect(screen.getByRole('navigation').getAttribute('aria-label')).toBe('Breadcrumb');
  });

  it('renderiza links com href', () => {
    render(<BasicBreadcrumb />, { wrapper });
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toBeTruthy();
    expect(homeLink.getAttribute('href')).toBe('/');
  });

  it('Current tem aria-current="page"', () => {
    render(<BasicBreadcrumb />, { wrapper });
    expect(screen.getByText('Detalhes').getAttribute('aria-current')).toBe('page');
  });

  it('Separator tem aria-hidden', () => {
    const { container } = render(<BasicBreadcrumb />, { wrapper });
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(0);
  });

  it('Separator default renderiza Icon ChevronRight', () => {
    const { container } = render(<BasicBreadcrumb />, { wrapper });
    // Separator default = <Icon name="ChevronRight"> (svg) em vez de texto "/"
    const separators = container.querySelectorAll('span[role="presentation"]');
    expect(separators.length).toBe(2);
    separators.forEach((sep) => {
      expect(sep.querySelector('svg')).toBeTruthy();
    });
  });

  it('Separator aceita children customizados', () => {
    render(
      <Breadcrumb>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
            <Breadcrumb.Separator>›</Breadcrumb.Separator>
          </Breadcrumb.Item>
          <Breadcrumb.Item><Breadcrumb.Current>Página</Breadcrumb.Current></Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb>,
      { wrapper }
    );
    expect(screen.getByText('›')).toBeTruthy();
  });

  it('lista usa <ol>', () => {
    const { container } = render(<BasicBreadcrumb />, { wrapper });
    expect(container.querySelector('ol')).toBeTruthy();
  });

  it('itens são <li>', () => {
    const { container } = render(<BasicBreadcrumb />, { wrapper });
    expect(container.querySelectorAll('li')).toHaveLength(3);
  });
});
