import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from './pagination';
import { ArborProvider } from '../../../ecosystem';
import { themeLight } from '../../../foundations';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

function BasicPagination() {
  return (
    <Pagination>
      <Pagination.List>
        <Pagination.Item><Pagination.Prev /></Pagination.Item>
        <Pagination.Item><Pagination.Button>1</Pagination.Button></Pagination.Item>
        <Pagination.Item><Pagination.Button isActive>2</Pagination.Button></Pagination.Item>
        <Pagination.Item><Pagination.Button>3</Pagination.Button></Pagination.Item>
        <Pagination.Item><Pagination.Ellipsis /></Pagination.Item>
        <Pagination.Item><Pagination.Button>10</Pagination.Button></Pagination.Item>
        <Pagination.Item><Pagination.Next /></Pagination.Item>
      </Pagination.List>
    </Pagination>
  );
}

describe('Pagination', () => {
  it('renderiza nav', () => {
    render(<BasicPagination />, { wrapper });
    expect(screen.getByRole('navigation')).toBeTruthy();
  });

  it('nav tem aria-label="Paginação"', () => {
    render(<BasicPagination />, { wrapper });
    expect(screen.getByRole('navigation').getAttribute('aria-label')).toBe('Paginação');
  });

  it('aceita label customizado', () => {
    render(
      <Pagination label="Navegar páginas">
        <Pagination.List><Pagination.Item><Pagination.Button>1</Pagination.Button></Pagination.Item></Pagination.List>
      </Pagination>,
      { wrapper }
    );
    expect(screen.getByRole('navigation').getAttribute('aria-label')).toBe('Navegar páginas');
  });

  it('página ativa tem aria-current="page"', () => {
    render(<BasicPagination />, { wrapper });
    expect(screen.getByRole('button', { name: '2' }).getAttribute('aria-current')).toBe('page');
  });

  it('páginas inativas não têm aria-current', () => {
    render(<BasicPagination />, { wrapper });
    expect(screen.getByRole('button', { name: '1' }).getAttribute('aria-current')).toBeNull();
  });

  it('Prev tem aria-label="Página anterior"', () => {
    render(<BasicPagination />, { wrapper });
    expect(screen.getByRole('button', { name: 'Página anterior' })).toBeTruthy();
  });

  it('Next tem aria-label="Próxima página"', () => {
    render(<BasicPagination />, { wrapper });
    expect(screen.getByRole('button', { name: 'Próxima página' })).toBeTruthy();
  });

  it('Ellipsis tem aria-hidden', () => {
    const { container } = render(<BasicPagination />, { wrapper });
    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });

  it('botão disabled não dispara click', () => {
    const onClick = jest.fn();
    render(
      <Pagination>
        <Pagination.List>
          <Pagination.Item><Pagination.Prev disabled onClick={onClick} /></Pagination.Item>
        </Pagination.List>
      </Pagination>,
      { wrapper }
    );
    fireEvent.click(screen.getByRole('button', { name: 'Página anterior' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('botão dispara onClick', () => {
    const onClick = jest.fn();
    render(
      <Pagination>
        <Pagination.List>
          <Pagination.Item><Pagination.Button onClick={onClick}>5</Pagination.Button></Pagination.Item>
        </Pagination.List>
      </Pagination>,
      { wrapper }
    );
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('lista é <ul>', () => {
    const { container } = render(<BasicPagination />, { wrapper });
    expect(container.querySelector('ul')).toBeTruthy();
  });
});
