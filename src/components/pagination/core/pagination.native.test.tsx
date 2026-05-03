import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Pagination } from './pagination';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

function BasicPagination() {
  return (
    <Pagination>
      <Pagination.List>
        <Pagination.Item><Pagination.Prev /></Pagination.Item>
        <Pagination.Item><Pagination.Button aria-label="Página 1">1</Pagination.Button></Pagination.Item>
        <Pagination.Item><Pagination.Button aria-label="Página 2" current>2</Pagination.Button></Pagination.Item>
        <Pagination.Item><Pagination.Button aria-label="Página 3">3</Pagination.Button></Pagination.Item>
        <Pagination.Item><Pagination.Next /></Pagination.Item>
      </Pagination.List>
    </Pagination>
  );
}

describe('Pagination (native)', () => {
  it('renderiza buttons com accessibilityRole="button"', () => {
    render(<BasicPagination />, { wrapper: Wrapper });
    expect(screen.getAllByRole('button').length).toBeGreaterThanOrEqual(5);
  });

  it('Prev usa accessibilityLabel padrão "Página anterior"', () => {
    render(<BasicPagination />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Página anterior')).toBeTruthy();
  });

  it('Next usa accessibilityLabel padrão "Próxima página"', () => {
    render(<BasicPagination />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Próxima página')).toBeTruthy();
  });

  it('botão ativo tem accessibilityState.selected=true', () => {
    render(<BasicPagination />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Página 2').props.accessibilityState.selected).toBe(true);
  });

  it('botão inativo tem accessibilityState.selected=false', () => {
    render(<BasicPagination />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Página 1').props.accessibilityState.selected).toBe(false);
  });

  it('botão dispara onClick ao pressionar', () => {
    const onClick = jest.fn();
    render(
      <Pagination>
        <Pagination.List>
          <Pagination.Item>
            <Pagination.Button aria-label="P5" onClick={onClick}>5</Pagination.Button>
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
            <Pagination.Prev disabled onClick={onClick} />
          </Pagination.Item>
        </Pagination.List>
      </Pagination>,
      { wrapper: Wrapper },
    );
    fireEvent.press(screen.getByLabelText('Página anterior'));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Página anterior').props.accessibilityState.disabled).toBe(true);
  });

  it('Ellipsis renderiza "…" (oculto de a11y)', () => {
    render(
      <Pagination>
        <Pagination.List>
          <Pagination.Item><Pagination.Ellipsis /></Pagination.Item>
        </Pagination.List>
      </Pagination>,
      { wrapper: Wrapper },
    );
    expect(screen.getByText('…', { includeHiddenElements: true })).toBeTruthy();
  });

  it('Ellipsis é oculto de screen readers (TD-019)', () => {
    render(
      <Pagination>
        <Pagination.List>
          <Pagination.Item><Pagination.Ellipsis /></Pagination.Item>
        </Pagination.List>
      </Pagination>,
      { wrapper: Wrapper },
    );
    expect(screen.queryByText('…')).toBeNull();
  });

  it('Root usa accessibilityLabel customizado', () => {
    render(
      <Pagination label="Navegar páginas">
        <Pagination.List>
          <Pagination.Item>
            <Pagination.Button aria-label="P1">1</Pagination.Button>
          </Pagination.Item>
        </Pagination.List>
      </Pagination>,
      { wrapper: Wrapper },
    );
    expect(screen.getByLabelText('Navegar páginas')).toBeTruthy();
  });
});
