import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from './pagination';
import { ArborProvider } from '../../../ecosystem';
import { themeLight } from '../../../foundations';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

describe('Pagination — API plana (RFC-0043)', () => {
  it('renderiza <nav aria-label="Paginação"> por default', () => {
    render(<Pagination page={1} count={5} onPageChange={jest.fn()} />, { wrapper });
    expect(screen.getByRole('navigation').getAttribute('aria-label')).toBe('Paginação');
  });

  it('aceita accessibilityLabel customizado', () => {
    render(
      <Pagination page={1} count={5} onPageChange={jest.fn()} accessibilityLabel="Navegar páginas" />,
      { wrapper },
    );
    expect(screen.getByRole('navigation').getAttribute('aria-label')).toBe('Navegar páginas');
  });

  it('renderiza Previous, Next e range numérico', () => {
    render(<Pagination page={1} count={5} onPageChange={jest.fn()} />, { wrapper });
    expect(screen.getByRole('button', { name: 'Página anterior' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Próxima página' })).toBeTruthy();
    [1, 2, 3, 4, 5].forEach((p) => {
      expect(screen.getByText(String(p))).toBeTruthy();
    });
  });

  it('current tem aria-current="page" e usa label customizado de current', () => {
    render(<Pagination page={3} count={5} onPageChange={jest.fn()} />, { wrapper });
    const current = screen.getByRole('button', { name: 'Página 3, atual' });
    expect(current.getAttribute('aria-current')).toBe('page');
  });

  it('botões não-current têm aria-label "Ir para a página N"', () => {
    render(<Pagination page={3} count={5} onPageChange={jest.fn()} />, { wrapper });
    expect(screen.getByRole('button', { name: 'Ir para a página 1' })).toBeTruthy();
  });

  it('aceita getItemLabel customizado', () => {
    render(
      <Pagination
        page={2}
        count={3}
        onPageChange={jest.fn()}
        getItemLabel={(p, isCurrent) => (isCurrent ? `Atual: ${p}` : `Página ${p}`)}
      />,
      { wrapper },
    );
    expect(screen.getByRole('button', { name: 'Página 1' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Atual: 2' })).toBeTruthy();
  });

  it('Previous fica disabled quando page === 1', () => {
    render(<Pagination page={1} count={5} onPageChange={jest.fn()} />, { wrapper });
    expect(screen.getByRole('button', { name: 'Página anterior' }).hasAttribute('disabled')).toBe(true);
    expect(screen.getByRole('button', { name: 'Próxima página' }).hasAttribute('disabled')).toBe(false);
  });

  it('Next fica disabled quando page === count', () => {
    render(<Pagination page={5} count={5} onPageChange={jest.fn()} />, { wrapper });
    expect(screen.getByRole('button', { name: 'Próxima página' }).hasAttribute('disabled')).toBe(true);
  });

  it('onPageChange dispara ao clicar em número', () => {
    const onPageChange = jest.fn();
    render(<Pagination page={1} count={5} onPageChange={onPageChange} />, { wrapper });
    fireEvent.click(screen.getByRole('button', { name: 'Ir para a página 3' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('onPageChange dispara ao clicar em Next', () => {
    const onPageChange = jest.fn();
    render(<Pagination page={2} count={5} onPageChange={onPageChange} />, { wrapper });
    fireEvent.click(screen.getByRole('button', { name: 'Próxima página' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('onPageChange dispara ao clicar em Previous', () => {
    const onPageChange = jest.fn();
    render(<Pagination page={4} count={5} onPageChange={onPageChange} />, { wrapper });
    fireEvent.click(screen.getByRole('button', { name: 'Página anterior' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('onPageChange NÃO dispara ao clicar no current', () => {
    const onPageChange = jest.fn();
    render(<Pagination page={3} count={5} onPageChange={onPageChange} />, { wrapper });
    fireEvent.click(screen.getByRole('button', { name: 'Página 3, atual' }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('renderiza ellipsis (MoreHorizontal) quando count > totalItems', () => {
    const { container } = render(
      <Pagination page={5} count={20} onPageChange={jest.fn()} />,
      { wrapper },
    );
    // 2 ellipsis: antes do range central e depois.
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThanOrEqual(2);
  });

  it('showFirstLast renderiza First e Last', () => {
    render(
      <Pagination page={10} count={20} onPageChange={jest.fn()} showFirstLast />,
      { wrapper },
    );
    expect(screen.getByRole('button', { name: 'Primeira página' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Última página' })).toBeTruthy();
  });

  it('First/Last disparam goTo(1) e goTo(count)', () => {
    const onPageChange = jest.fn();
    render(
      <Pagination page={10} count={20} onPageChange={onPageChange} showFirstLast />,
      { wrapper },
    );
    fireEvent.click(screen.getByRole('button', { name: 'Primeira página' }));
    expect(onPageChange).toHaveBeenLastCalledWith(1);
    fireEvent.click(screen.getByRole('button', { name: 'Última página' }));
    expect(onPageChange).toHaveBeenLastCalledWith(20);
  });

  it('aceita size customizado (não quebra render)', () => {
    render(
      <Pagination page={1} count={3} onPageChange={jest.fn()} size="large" />,
      { wrapper },
    );
    expect(screen.getByText('1')).toBeTruthy();
  });

  it('clampa page fora do range', () => {
    const onPageChange = jest.fn();
    render(<Pagination page={99} count={5} onPageChange={onPageChange} />, { wrapper });
    expect(screen.getByRole('button', { name: 'Página 5, atual' }).getAttribute('aria-current')).toBe('page');
  });
});

describe('Pagination — modo compound', () => {
  function CompoundExample() {
    return (
      <Pagination>
        <Pagination.List>
          <Pagination.Item><Pagination.Previous /></Pagination.Item>
          <Pagination.Item><Pagination.Button accessibilityLabel="Ir para 1">1</Pagination.Button></Pagination.Item>
          <Pagination.Item><Pagination.Button current accessibilityLabel="Página 2, atual">2</Pagination.Button></Pagination.Item>
          <Pagination.Item><Pagination.Button accessibilityLabel="Ir para 3">3</Pagination.Button></Pagination.Item>
          <Pagination.Item><Pagination.Ellipsis /></Pagination.Item>
          <Pagination.Item><Pagination.Button accessibilityLabel="Ir para 10">10</Pagination.Button></Pagination.Item>
          <Pagination.Item><Pagination.Next /></Pagination.Item>
        </Pagination.List>
      </Pagination>
    );
  }

  it('renderiza estrutura nav > ul > li > button', () => {
    const { container } = render(<CompoundExample />, { wrapper });
    expect(container.querySelector('nav > ul')).toBeTruthy();
    expect(container.querySelectorAll('li').length).toBeGreaterThanOrEqual(6);
  });

  it('current tem aria-current="page"', () => {
    render(<CompoundExample />, { wrapper });
    expect(screen.getByRole('button', { name: 'Página 2, atual' }).getAttribute('aria-current')).toBe('page');
  });

  it('Previous/Next renderizam ícones (sem ASCII)', () => {
    render(<CompoundExample />, { wrapper });
    expect(screen.getByRole('button', { name: 'Página anterior' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Próxima página' })).toBeTruthy();
  });

  it('Pagination.Root explícito funciona com children', () => {
    const { container } = render(
      <Pagination.Root accessibilityLabel="X">
        <Pagination.List>
          <Pagination.Item><Pagination.Button>1</Pagination.Button></Pagination.Item>
        </Pagination.List>
      </Pagination.Root>,
      { wrapper },
    );
    expect(container.querySelector('nav[aria-label="X"]')).toBeTruthy();
  });

  it('botão disabled bloqueia onClick', () => {
    const onClick = jest.fn();
    render(
      <Pagination>
        <Pagination.List>
          <Pagination.Item>
            <Pagination.Previous disabled onClick={onClick} />
          </Pagination.Item>
        </Pagination.List>
      </Pagination>,
      { wrapper },
    );
    fireEvent.click(screen.getByRole('button', { name: 'Página anterior' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('Pagination.First e Pagination.Last estão exportados', () => {
    render(
      <Pagination>
        <Pagination.List>
          <Pagination.Item><Pagination.First /></Pagination.Item>
          <Pagination.Item><Pagination.Last /></Pagination.Item>
        </Pagination.List>
      </Pagination>,
      { wrapper },
    );
    expect(screen.getByRole('button', { name: 'Primeira página' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Última página' })).toBeTruthy();
  });

  it('Ellipsis tem aria-hidden', () => {
    const { container } = render(<CompoundExample />, { wrapper });
    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });
});
