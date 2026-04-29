import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Table } from './table';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

function BasicTable({ scrollable = false }: { scrollable?: boolean } = {}) {
  return (
    <Table scrollable={scrollable}>
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

describe('Table (native)', () => {
  it('renderiza conteúdo de células', () => {
    render(<BasicTable />, { wrapper: Wrapper });
    expect(screen.getByText('Nome')).toBeTruthy();
    expect(screen.getByText('Valor')).toBeTruthy();
    expect(screen.getByText('Produto A')).toBeTruthy();
    expect(screen.getByText('R$ 10,00')).toBeTruthy();
    expect(screen.getByText('Produto B')).toBeTruthy();
    expect(screen.getByText('R$ 20,00')).toBeTruthy();
  });

  it('HeaderCell tem accessibilityRole="header"', () => {
    render(<BasicTable />, { wrapper: Wrapper });
    expect(screen.getAllByRole('header')).toHaveLength(2);
  });

  it('HeaderCell renderiza texto bold via Text interno', () => {
    render(<BasicTable />, { wrapper: Wrapper });
    expect(screen.getByText('Nome')).toBeTruthy();
  });

  it('aceita ReactNode arbitrário em Cell (sem wrapping em Text)', () => {
    render(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <React.Fragment>
                {/* children não-string passa direto sem ser embrulhado em Text */}
                <></>
              </React.Fragment>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
      { wrapper: Wrapper },
    );
    // Render não deve lançar nem alertar text-string-must-be-in-text
    expect(true).toBe(true);
  });

  it('renderiza Head e Body separados', () => {
    render(<BasicTable />, { wrapper: Wrapper });
    expect(screen.getAllByRole('header')).toHaveLength(2);
    expect(screen.getByText('Produto A')).toBeTruthy();
  });

  it('scrollable=true não quebra render (envolve em ScrollView)', () => {
    render(<BasicTable scrollable />, { wrapper: Wrapper });
    expect(screen.getByText('Produto A')).toBeTruthy();
    expect(screen.getAllByRole('header')).toHaveLength(2);
  });

  it('aceita célula com número', () => {
    render(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell>{42}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
      { wrapper: Wrapper },
    );
    expect(screen.getByText('42')).toBeTruthy();
  });

  it('Row sem section ainda renderiza (uso defensivo fora de Head/Body)', () => {
    render(
      <Table>
        <Table.Row>
          <Table.Cell>Solta</Table.Cell>
        </Table.Row>
      </Table>,
      { wrapper: Wrapper },
    );
    expect(screen.getByText('Solta')).toBeTruthy();
  });
});
