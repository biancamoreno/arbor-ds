import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Chip } from './chip';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

describe('Chip (native)', () => {
  it('renderiza Chip.Label', () => {
    render(<Chip><Chip.Label>React</Chip.Label></Chip>, { wrapper: Wrapper });
    expect(screen.getByText('React')).toBeTruthy();
  });

  it('aceita variant filled', () => {
    render(<Chip variant="filled"><Chip.Label>F</Chip.Label></Chip>, { wrapper: Wrapper });
    expect(screen.getByText('F')).toBeTruthy();
  });

  it('aceita variant outlined', () => {
    render(<Chip variant="outlined"><Chip.Label>O</Chip.Label></Chip>, { wrapper: Wrapper });
    expect(screen.getByText('O')).toBeTruthy();
  });

  it('aceita tone brand selectable', () => {
    render(
      <Chip tone="brand" selectable selected><Chip.Label>Brand</Chip.Label></Chip>,
      { wrapper: Wrapper },
    );
    expect(screen.getByText('Brand')).toBeTruthy();
  });

  it('Chip.Remove dispara onClick', () => {
    const onRemove = jest.fn();
    render(
      <Chip>
        <Chip.Label>Tag</Chip.Label>
        <Chip.Remove onClick={onRemove} />
      </Chip>,
      { wrapper: Wrapper },
    );
    fireEvent.press(screen.getByLabelText('Remover'));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('Chip.Remove aceita label customizado', () => {
    render(
      <Chip>
        <Chip.Label>Tag</Chip.Label>
        <Chip.Remove label="Excluir" />
      </Chip>,
      { wrapper: Wrapper },
    );
    expect(screen.getByLabelText('Excluir')).toBeTruthy();
  });

  // RFC-0033 — modo selectable

  describe('selectable (RFC-0033)', () => {
    it('selectable expõe accessibilityState.selected + role=button', () => {
      render(
        <Chip selectable selected><Chip.Label>Ativo</Chip.Label></Chip>,
        { wrapper: Wrapper },
      );
      const btn = screen.getByRole('button', { name: 'Ativo' });
      expect(btn).toBeTruthy();
    });

    it('selectable dispara onSelectedChange ao pressionar', () => {
      const onSelectedChange = jest.fn();
      render(
        <Chip selectable selected={false} onSelectedChange={onSelectedChange}>
          <Chip.Label>Toggle</Chip.Label>
        </Chip>,
        { wrapper: Wrapper },
      );
      fireEvent.press(screen.getByRole('button'));
      expect(onSelectedChange).toHaveBeenCalledWith(true);
    });

    it('disabled bloqueia toggle (selectable)', () => {
      const onSelectedChange = jest.fn();
      render(
        <Chip selectable disabled selected={false} onSelectedChange={onSelectedChange}>
          <Chip.Label>X</Chip.Label>
        </Chip>,
        { wrapper: Wrapper },
      );
      fireEvent.press(screen.getByRole('button'));
      expect(onSelectedChange).not.toHaveBeenCalled();
    });

    it('defaultSelected funciona não-controlado', () => {
      const onSelectedChange = jest.fn();
      render(
        <Chip selectable defaultSelected onSelectedChange={onSelectedChange}>
          <Chip.Label>X</Chip.Label>
        </Chip>,
        { wrapper: Wrapper },
      );
      fireEvent.press(screen.getByRole('button'));
      expect(onSelectedChange).toHaveBeenCalledWith(false);
    });
  });
});
