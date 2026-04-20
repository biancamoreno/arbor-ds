import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Alert } from './alert';
import { ArborProvider } from '../../../ecosystem';
import { themeLight } from '../../../foundations';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

describe('Alert', () => {
  it('renderiza com role="status" para tone info', () => {
    render(<Alert tone="info"><Alert.Title>Info</Alert.Title></Alert>, { wrapper });
    expect(screen.getByRole('status')).toBeTruthy();
  });

  it('renderiza com role="alert" para tone critical', () => {
    render(<Alert tone="critical"><Alert.Title>Erro</Alert.Title></Alert>, { wrapper });
    expect(screen.getByRole('alert')).toBeTruthy();
  });

  it('renderiza Alert.Title', () => {
    render(<Alert><Alert.Title>Título de alerta</Alert.Title></Alert>, { wrapper });
    expect(screen.getByText('Título de alerta')).toBeTruthy();
  });

  it('renderiza Alert.Description', () => {
    render(
      <Alert><Alert.Title>T</Alert.Title><Alert.Description>Descrição</Alert.Description></Alert>,
      { wrapper }
    );
    expect(screen.getByText('Descrição')).toBeTruthy();
  });

  it('Alert.Icon tem aria-hidden', () => {
    const { container } = render(
      <Alert><Alert.Icon>⚠</Alert.Icon><Alert.Title>T</Alert.Title></Alert>,
      { wrapper }
    );
    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });

  it('Alert.Close tem aria-label padrão "Fechar"', () => {
    render(
      <Alert><Alert.Title>T</Alert.Title><Alert.Close /></Alert>,
      { wrapper }
    );
    expect(screen.getByLabelText('Fechar')).toBeTruthy();
  });

  it('Alert.Close dispara onClick', () => {
    const onClose = jest.fn();
    render(
      <Alert><Alert.Title>T</Alert.Title><Alert.Close onClick={onClose} /></Alert>,
      { wrapper }
    );
    fireEvent.click(screen.getByLabelText('Fechar'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('aceita tone success', () => {
    render(<Alert tone="success"><Alert.Title>Sucesso</Alert.Title></Alert>, { wrapper });
    expect(screen.getByText('Sucesso')).toBeTruthy();
  });

  it('aceita tone warning com role="status"', () => {
    render(<Alert tone="warning"><Alert.Title>Atenção</Alert.Title></Alert>, { wrapper });
    expect(screen.getByRole('status')).toBeTruthy();
  });

  it('passa className extra', () => {
    const { container } = render(
      <Alert className="custom-alert"><Alert.Title>T</Alert.Title></Alert>,
      { wrapper }
    );
    expect(container.querySelector('.custom-alert')).toBeTruthy();
  });

  it('Alert.Close aceita label customizado', () => {
    render(
      <Alert><Alert.Title>T</Alert.Title><Alert.Close label="Dispensar aviso" /></Alert>,
      { wrapper }
    );
    expect(screen.getByLabelText('Dispensar aviso')).toBeTruthy();
  });
});
