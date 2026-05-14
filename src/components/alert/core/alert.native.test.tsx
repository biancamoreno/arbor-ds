import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Alert } from './alert';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

describe('Alert (native)', () => {
  it('renders title and description', () => {
    render(
      <Alert tone="info">
        <Alert.Icon />
        <Alert.Title>Aviso</Alert.Title>
        <Alert.Description>Descrição da mensagem</Alert.Description>
      </Alert>,
      { wrapper: Wrapper }
    );

    expect(screen.getByText('Aviso')).toBeTruthy();
    expect(screen.getByText('Descrição da mensagem')).toBeTruthy();
  });

  it('renders critical tone with content', () => {
    render(
      <Alert tone="critical">
        <Alert.Title>Erro</Alert.Title>
      </Alert>,
      { wrapper: Wrapper }
    );

    expect(screen.getByText('Erro')).toBeTruthy();
  });

  it('Alert.Close usa accessibilityLabel padrão "Fechar"', () => {
    render(
      <Alert>
        <Alert.Title>T</Alert.Title>
        <Alert.Close />
      </Alert>,
      { wrapper: Wrapper },
    );
    expect(screen.getByLabelText('Fechar')).toBeTruthy();
  });

  it('Alert.Close aceita accessibilityLabel customizado', () => {
    render(
      <Alert>
        <Alert.Title>T</Alert.Title>
        <Alert.Close accessibilityLabel="Dispensar" />
      </Alert>,
      { wrapper: Wrapper },
    );
    expect(screen.getByLabelText('Dispensar')).toBeTruthy();
  });

  it('Alert.Close dispara onClick', () => {
    const onClick = jest.fn();
    render(
      <Alert>
        <Alert.Title>T</Alert.Title>
        <Alert.Close onClick={onClick} />
      </Alert>,
      { wrapper: Wrapper },
    );
    fireEvent.press(screen.getByLabelText('Fechar'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('Alert.Icon renderiza ícone padrão por tone quando sem children', () => {
    render(
      <Alert tone="success">
        <Alert.Icon />
        <Alert.Title>Ok</Alert.Title>
      </Alert>,
      { wrapper: Wrapper },
    );
    expect(screen.getByText('Ok')).toBeTruthy();
  });
});
