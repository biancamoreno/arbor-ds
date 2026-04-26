import React from 'react';
import { render, screen } from '@testing-library/react-native';
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

  it('renders critical tone with alert role', () => {
    render(
      <Alert tone="critical">
        <Alert.Title>Erro</Alert.Title>
      </Alert>,
      { wrapper: Wrapper }
    );

    expect(screen.getByText('Erro')).toBeTruthy();
  });
});
