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

  it('aceita tone warning com role="alert" (assertivo)', () => {
    render(<Alert tone="warning"><Alert.Title>Atenção</Alert.Title></Alert>, { wrapper });
    expect(screen.getByRole('alert')).toBeTruthy();
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

  it('Alert.Icon renderiza ícone padrão por tone quando sem children', () => {
    const { container } = render(
      <Alert tone="success"><Alert.Icon /><Alert.Title>Ok</Alert.Title></Alert>,
      { wrapper }
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('Alert.Close usa ícone X', () => {
    const { container } = render(
      <Alert><Alert.Title>T</Alert.Title><Alert.Close /></Alert>,
      { wrapper }
    );
    const closeBtn = container.querySelector('[aria-label="Fechar"]');
    expect(closeBtn?.querySelector('svg')).toBeTruthy();
  });

  it('aceita tone critical com role="alert"', () => {
    render(<Alert tone="critical"><Alert.Title>Erro</Alert.Title></Alert>, { wrapper });
    expect(screen.getByRole('alert')).toBeTruthy();
  });
});

describe('Alert flat API (title/description/icon/onClose props)', () => {
  it('renderiza Icon + Title + Description automaticamente via props', () => {
    const { container } = render(
      <Alert tone="warning" title="Atenção" description="Verifique." />,
      { wrapper },
    );
    expect(screen.getByText('Atenção')).toBeTruthy();
    expect(screen.getByText('Verifique.')).toBeTruthy();
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renderiza Close button quando onClose é definido', () => {
    const onClose = jest.fn();
    const { container } = render(
      <Alert tone="info" title="X" onClose={onClose} />,
      { wrapper },
    );
    const closeBtn = container.querySelector('[aria-label="Fechar"]') as HTMLElement;
    expect(closeBtn).toBeTruthy();
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('não renderiza Close button quando onClose é undefined', () => {
    const { container } = render(<Alert tone="info" title="X" />, { wrapper });
    expect(container.querySelector('[aria-label="Fechar"]')).toBeNull();
  });

  it('compound API continua disponível quando todas as props planas são undefined', () => {
    render(
      <Alert tone="info">
        <Alert.Title>Compound</Alert.Title>
      </Alert>,
      { wrapper },
    );
    expect(screen.getByText('Compound')).toBeTruthy();
  });
});
