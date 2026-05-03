import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Card } from './card';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

describe('Card (native)', () => {
  it('renderiza Card.Body com conteúdo', () => {
    render(
      <Card><Card.Body><Text>Conteúdo</Text></Card.Body></Card>,
      { wrapper: Wrapper },
    );
    expect(screen.getByText('Conteúdo')).toBeTruthy();
  });

  it('renderiza Card.Header', () => {
    render(
      <Card><Card.Header><Text>Título</Text></Card.Header></Card>,
      { wrapper: Wrapper },
    );
    expect(screen.getByText('Título')).toBeTruthy();
  });

  it('renderiza Card.Footer', () => {
    render(
      <Card>
        <Card.Body><Text>X</Text></Card.Body>
        <Card.Footer><Text>Rodapé</Text></Card.Footer>
      </Card>,
      { wrapper: Wrapper },
    );
    expect(screen.getByText('Rodapé')).toBeTruthy();
  });

  describe('variants', () => {
    it.each(['outlined', 'elevated', 'flat'] as const)('aceita variant %s', (variant) => {
      render(
        <Card variant={variant}><Card.Body><Text>X</Text></Card.Body></Card>,
        { wrapper: Wrapper },
      );
      expect(screen.getByText('X')).toBeTruthy();
    });
  });

  describe('paddings (SP-1)', () => {
    it.each(['none', 'xsmall', 'small', 'medium', 'large', 'xlarge'] as const)(
      'aceita padding %s',
      (padding) => {
        render(
          <Card padding={padding}><Card.Body><Text>X</Text></Card.Body></Card>,
          { wrapper: Wrapper },
        );
        expect(screen.getByText('X')).toBeTruthy();
      },
    );
  });

  describe('Card decorativo', () => {
    it('renderiza sem accessibilityRole button', () => {
      render(
        <Card><Card.Body><Text>X</Text></Card.Body></Card>,
        { wrapper: Wrapper },
      );
      expect(screen.queryByRole('button')).toBeNull();
    });
  });

  describe('Card interativo', () => {
    it('renderiza Pressable com accessibilityLabel', () => {
      render(
        <Card interactive onClick={() => {}} aria-label="Abrir produto">
          <Card.Body><Text>X</Text></Card.Body>
        </Card>,
        { wrapper: Wrapper },
      );
      expect(screen.getByLabelText('Abrir produto')).toBeTruthy();
    });

    it('prefere accessibilityLabel quando ambos passados', () => {
      render(
        <Card interactive onClick={() => {}} aria-label="aria" accessibilityLabel="native">
          <Card.Body><Text>X</Text></Card.Body>
        </Card>,
        { wrapper: Wrapper },
      );
      expect(screen.getByLabelText('native')).toBeTruthy();
    });

    it('dispara onClick (onPress)', () => {
      const handleClick = jest.fn();
      render(
        <Card interactive onClick={handleClick} aria-label="Abrir">
          <Card.Body><Text>X</Text></Card.Body>
        </Card>,
        { wrapper: Wrapper },
      );
      fireEvent.press(screen.getByLabelText('Abrir'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});
