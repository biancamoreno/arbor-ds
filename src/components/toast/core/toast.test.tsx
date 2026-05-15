import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { Toast, Toaster } from './toast';
import { useToast } from './use-toast';
import { toastStore } from '../store/toast-store';
import { ArborProvider } from '../../../ecosystem';
import { themeLight, createTheme } from '../../../foundations';

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

  it('tone warning → aria-live="assertive"', () => {
    render(<Toast tone="warning"><Toast.Title>Atenção</Toast.Title></Toast>, { wrapper });
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

  it('Toast.Close aceita accessibilityLabel customizado', () => {
    render(
      <Toast><Toast.Title>T</Toast.Title><Toast.Close accessibilityLabel="Dispensar" /></Toast>,
      { wrapper },
    );
    expect(screen.getByLabelText('Dispensar')).toBeTruthy();
  });

  it('Toast.Icon renderiza ícone tone-default quando sem children', () => {
    const { container } = render(
      <Toast tone="success"><Toast.Icon /><Toast.Title>Ok</Toast.Title></Toast>,
      { wrapper },
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('override de components.toast.colors.{tone} via createTheme propaga', () => {
    const customTheme = createTheme(themeLight, {
      components: {
        toast: {
          colors: {
            success: {
              background: 'brand.bgSubtle',
              borderColor: 'brand.solid',
              icon: 'brand.solid',
              title: 'brand.text',
              description: 'brand.text',
              closeHover: 'brand.bgElementHover',
            },
          },
        },
      },
    });
    const themedWrapper = ({ children }: { children: React.ReactNode }) => (
      <ArborProvider theme={customTheme}>{children}</ArborProvider>
    );
    render(<Toast tone="success"><Toast.Title>Custom</Toast.Title></Toast>, { wrapper: themedWrapper });
    expect(screen.getByText('Custom')).toBeTruthy();
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

  it('toast com placement vai para o stack daquele placement', async () => {
    function Harness() {
      const { toast } = useToast();
      return (
        <>
          <Toaster placement="bottom-right" />
          <button onClick={() => toast({ title: 'No topo', placement: 'top-center', duration: 0 })}>
            top
          </button>
        </>
      );
    }
    render(<Harness />, { wrapper });
    act(() => { (screen.getByText('top') as HTMLButtonElement).click(); });
    await waitFor(() => expect(screen.getByText('No topo')).toBeTruthy());

    const stack = document.querySelector('[data-placement="top-center"]');
    expect(stack).toBeTruthy();
    expect(stack!.textContent).toContain('No topo');
    expect(document.querySelector('[data-placement="bottom-right"]')).toBeNull();
  });

  it('toasts em placements distintos coexistem em stacks separados', async () => {
    function Harness() {
      const { toast } = useToast();
      return (
        <>
          <Toaster placement="bottom-right" />
          <button onClick={() => toast({ title: 'Topo', placement: 'top-center', duration: 0 })}>
            top
          </button>
          <button onClick={() => toast({ title: 'Base', placement: 'bottom-right', duration: 0 })}>
            bottom
          </button>
        </>
      );
    }
    render(<Harness />, { wrapper });
    act(() => { (screen.getByText('top') as HTMLButtonElement).click(); });
    act(() => { (screen.getByText('bottom') as HTMLButtonElement).click(); });
    await waitFor(() => expect(screen.getByText('Topo')).toBeTruthy());

    const top = document.querySelector('[data-placement="top-center"]')!;
    const bottom = document.querySelector('[data-placement="bottom-right"]')!;
    expect(top.textContent).toContain('Topo');
    expect(top.textContent).not.toContain('Base');
    expect(bottom.textContent).toContain('Base');
    expect(bottom.textContent).not.toContain('Topo');
  });

  it('toast sem placement cai no placement (fallback) do Toaster', async () => {
    function Harness() {
      const { toast } = useToast();
      return (
        <>
          <Toaster placement="top-left" />
          <button onClick={() => toast({ title: 'Sem placement', duration: 0 })}>fire</button>
        </>
      );
    }
    render(<Harness />, { wrapper });
    act(() => { (screen.getByText('fire') as HTMLButtonElement).click(); });
    await waitFor(() => expect(screen.getByText('Sem placement')).toBeTruthy());
    const stack = document.querySelector('[data-placement="top-left"]');
    expect(stack).toBeTruthy();
    expect(stack!.textContent).toContain('Sem placement');
  });
});
