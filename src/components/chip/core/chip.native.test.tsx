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

  it('aceita tone brand', () => {
    render(<Chip tone="brand" selected><Chip.Label>Brand</Chip.Label></Chip>, { wrapper: Wrapper });
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
});
