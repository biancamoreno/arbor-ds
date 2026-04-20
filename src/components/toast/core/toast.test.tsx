import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { Toast, Toaster } from './toast';
import { useToast } from './use-toast';
import { toastStore } from '../store/toast-store';
import { ArborProvider } from '../../../ecosystem';
import { themeLight } from '../../../foundations';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

beforeEach(() => {
  act(() => toastStore.clear());
});

describe('Toast (componente isolado)', () => {
  it('renderiza com role="status"', () => {
    render(<Toast><Toast.Title>Mensagem</Toast.Title></Toast>, { wrapper });
    expect(screen.getByRole('status')).toBeTruthy();
  });

  it('renderiza Toast.Title', () => {
    render(<Toast><Toast.Title>Salvo com sucesso</Toast.Title></Toast>, { wrapper });
    expect(screen.getByText('Salvo com sucesso')).toBeTruthy();
  });

  it('renderiza Toast.Description', () => {
    render(
      <Toast><Toast.Title>T</Toast.Title><Toast.Description>Detalhes</Toast.Description></Toast>,
      { wrapper }
    );
    expect(screen.getByText('Detalhes')).toBeTruthy();
  });

  it('tone critical → aria-live="assertive"', () => {
    render(<Toast tone="critical"><Toast.Title>Erro</Toast.Title></Toast>, { wrapper });
    expect(screen.getByRole('status').getAttribute('aria-live')).toBe('assertive');
  });

  it('tone success → aria-live="polite"', () => {
    render(<Toast tone="success"><Toast.Title>OK</Toast.Title></Toast>, { wrapper });
    expect(screen.getByRole('status').getAttribute('aria-live')).toBe('polite');
  });

  it('Toast.Close dispara onClose', () => {
    const onClose = jest.fn();
    render(
      <Toast><Toast.Title>T</Toast.Title><Toast.Close onClose={onClose} /></Toast>,
      { wrapper }
    );
    const btn = screen.getByLabelText('Fechar') as HTMLButtonElement;
    act(() => btn.click());
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('useToast + Toaster', () => {
  function TestHarness() {
    const { toast } = useToast();
    return (
      <>
        <Toaster />
        <button onClick={() => toast({ title: 'Arquivo salvo', tone: 'success', duration: 5000 })}>
          Mostrar
        </button>
      </>
    );
  }

  it('exibe toast ao chamar toast()', async () => {
    render(<TestHarness />, { wrapper });
    act(() => { (screen.getByText('Mostrar') as HTMLButtonElement).click(); });
    await waitFor(() => expect(screen.getByText('Arquivo salvo')).toBeTruthy());
  });

  it('remove toast ao expirar duration', async () => {
    jest.useFakeTimers();
    render(<TestHarness />, { wrapper });
    act(() => { (screen.getByText('Mostrar') as HTMLButtonElement).click(); });
    await waitFor(() => expect(screen.getByText('Arquivo salvo')).toBeTruthy());
    act(() => { jest.advanceTimersByTime(5001); });
    await waitFor(() => expect(screen.queryByText('Arquivo salvo')).toBeNull());
    jest.useRealTimers();
  });

  it('remove toast ao clicar em fechar', async () => {
    render(<TestHarness />, { wrapper });
    act(() => { (screen.getByText('Mostrar') as HTMLButtonElement).click(); });
    await waitFor(() => expect(screen.getByLabelText('Fechar')).toBeTruthy());
    act(() => { (screen.getByLabelText('Fechar') as HTMLButtonElement).click(); });
    await waitFor(() => expect(screen.queryByText('Arquivo salvo')).toBeNull());
  });
});
