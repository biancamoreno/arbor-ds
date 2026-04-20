import React from 'react';
import { render, screen } from '@testing-library/react';
import { Table } from './table';
import { ArborProvider } from '../../../ecosystem';
import { themeLight } from '../../../foundations';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

function BasicTable() {
  return (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Nome</Table.HeaderCell>
          <Table.HeaderCell>Valor</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Produto A</Table.Cell>
          <Table.Cell>R$ 10,00</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Produto B</Table.Cell>
          <Table.Cell>R$ 20,00</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
}

describe('Table', () => {
  it('renderiza elemento <table>', () => {
    render(<BasicTable />, { wrapper });
    expect(screen.getByRole('table')).toBeTruthy();
  });

  it('renderiza thead e tbody (rowgroup)', () => {
    render(<BasicTable />, { wrapper });
    expect(screen.getAllByRole('rowgroup')).toHaveLength(2);
  });

  it('renderiza cabeçalhos com role="columnheader"', () => {
    render(<BasicTable />, { wrapper });
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(2);
    expect(headers[0].textContent).toBe('Nome');
    expect(headers[1].textContent).toBe('Valor');
  });

  it('HeaderCell tem scope="col"', () => {
    render(<BasicTable />, { wrapper });
    screen.getAllByRole('columnheader').forEach((h) => {
      expect(h.getAttribute('scope')).toBe('col');
    });
  });

  it('renderiza células de dados', () => {
    render(<BasicTable />, { wrapper });
    expect(screen.getByText('Produto A')).toBeTruthy();
    expect(screen.getByText('R$ 10,00')).toBeTruthy();
  });

  it('renderiza 3 rows (1 header + 2 body)', () => {
    render(<BasicTable />, { wrapper });
    expect(screen.getAllByRole('row')).toHaveLength(3);
  });

  it('aceita scrollable=true envolve em div com overflow', () => {
    const { container } = render(
      <Table scrollable>
        <Table.Body><Table.Row><Table.Cell>X</Table.Cell></Table.Row></Table.Body>
      </Table>,
      { wrapper }
    );
    const div = container.firstChild as HTMLElement;
    expect(div.tagName).toBe('DIV');
    expect(div.style.overflowX).toBe('auto');
  });

  it('sem scrollable firstChild é <table>', () => {
    const { container } = render(<BasicTable />, { wrapper });
    expect(container.firstChild?.nodeName).toBe('TABLE');
  });

  it('passa className extra', () => {
    const { container } = render(
      <Table className="my-table">
        <Table.Body><Table.Row><Table.Cell>X</Table.Cell></Table.Row></Table.Body>
      </Table>,
      { wrapper }
    );
    expect(container.querySelector('.my-table')).toBeTruthy();
  });

  it('aceita colSpan em células', () => {
    render(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell colSpan={2}>Célula mesclada</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
      { wrapper }
    );
    expect(screen.getByText('Célula mesclada')).toBeTruthy();
  });
});
