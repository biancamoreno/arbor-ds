import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Pagination } from './pagination';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

describe('Pagination (native) — API plana', () => {
  it('Previous/Next acessíveis por accessibilityLabel default', () => {
    render(<Pagination page={2} count={5} onPageChange={jest.fn()} />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Página anterior')).toBeTruthy();
    expect(screen.getByLabelText('Próxima página')).toBeTruthy();
  });

  it('current tem accessibilityState.selected=true', () => {
    render(<Pagination page={3} count={5} onPageChange={jest.fn()} />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Página 3, atual').props.accessibilityState.selected).toBe(true);
  });

  it('botão inativo tem accessibilityState.selected=false', () => {
    render(<Pagination page={3} count={5} onPageChange={jest.fn()} />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Ir para a página 1').props.accessibilityState.selected).toBe(false);
  });

  it('onPageChange dispara ao pressionar botão numérico', () => {
    const onPageChange = jest.fn();
    render(<Pagination page={1} count={5} onPageChange={onPageChange} />, { wrapper: Wrapper });
    fireEvent.press(screen.getByLabelText('Ir para a página 3'));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('Previous disabled quando page === 1', () => {
    const onPageChange = jest.fn();
    render(<Pagination page={1} count={5} onPageChange={onPageChange} />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Página anterior').props.accessibilityState.disabled).toBe(true);
    fireEvent.press(screen.getByLabelText('Página anterior'));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('showFirstLast renderiza First e Last', () => {
    render(
      <Pagination page={10} count={20} onPageChange={jest.fn()} showFirstLast />,
      { wrapper: Wrapper },
    );
    expect(screen.getByLabelText('Primeira página')).toBeTruthy();
    expect(screen.getByLabelText('Última página')).toBeTruthy();
  });

  it('aceita accessibilityLabel customizado no Root', () => {
    render(
      <Pagination page={1} count={3} onPageChange={jest.fn()} accessibilityLabel="Navegar páginas" />,
      { wrapper: Wrapper },
    );
    // Quando o accessibilityLabel é aplicado ao Box raiz, vamos buscar via roleless via getAllByLabelText
    // (Clickable.native cria um Box wrapper que também recebe accessibilityLabel quando o consumer passa).
    // Usamos `queryAllByLabelText` para tolerar múltiplos matches.
    expect(screen.queryAllByLabelText('Navegar páginas').length).toBeGreaterThanOrEqual(1);
  });
});

describe('Pagination (native) — modo compound', () => {
  function CompoundExample() {
    return (
      <Pagination>
        <Pagination.List>
          <Pagination.Item><Pagination.Previous /></Pagination.Item>
          <Pagination.Item><Pagination.Button accessibilityLabel="P1">1</Pagination.Button></Pagination.Item>
          <Pagination.Item><Pagination.Button accessibilityLabel="P2, atual" current>2</Pagination.Button></Pagination.Item>
          <Pagination.Item><Pagination.Button accessibilityLabel="P3">3</Pagination.Button></Pagination.Item>
          <Pagination.Item><Pagination.Next /></Pagination.Item>
        </Pagination.List>
      </Pagination>
    );
  }

  it('renderiza buttons com accessibilityRole="button"', () => {
    render(<CompoundExample />, { wrapper: Wrapper });
    expect(screen.getAllByRole('button').length).toBeGreaterThanOrEqual(5);
  });

  it('Previous/Next defaults', () => {
    render(<CompoundExample />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Página anterior')).toBeTruthy();
    expect(screen.getByLabelText('Próxima página')).toBeTruthy();
  });

  it('botão dispara onClick ao pressionar', () => {
    const onClick = jest.fn();
    render(
      <Pagination>
        <Pagination.List>
          <Pagination.Item>
            <Pagination.Button accessibilityLabel="P5" onClick={onClick}>5</Pagination.Button>
          </Pagination.Item>
        </Pagination.List>
      </Pagination>,
      { wrapper: Wrapper },
    );
    fireEvent.press(screen.getByLabelText('P5'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('botão disabled não dispara onClick', () => {
    const onClick = jest.fn();
    render(
      <Pagination>
        <Pagination.List>
          <Pagination.Item>
            <Pagination.Previous disabled onClick={onClick} />
          </Pagination.Item>
        </Pagination.List>
      </Pagination>,
      { wrapper: Wrapper },
    );
    fireEvent.press(screen.getByLabelText('Página anterior'));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Página anterior').props.accessibilityState.disabled).toBe(true);
  });

  it('Pagination.First e Pagination.Last estão exportados', () => {
    render(
      <Pagination>
        <Pagination.List>
          <Pagination.Item><Pagination.First /></Pagination.Item>
          <Pagination.Item><Pagination.Last /></Pagination.Item>
        </Pagination.List>
      </Pagination>,
      { wrapper: Wrapper },
    );
    expect(screen.getByLabelText('Primeira página')).toBeTruthy();
    expect(screen.getByLabelText('Última página')).toBeTruthy();
  });
});
