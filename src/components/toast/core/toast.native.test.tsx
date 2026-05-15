import React from 'react';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Toast, Toaster } from './toast.native';
import { useToast } from './use-toast';
import { toastStore } from '../store/toast-store';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

beforeEach(() => {
  act(() => toastStore.clear());
});

describe('Toast (native, isolado)', () => {
  it('renderiza Toast.Title', () => {
    render(
      <Toast>
        <Toast.Title>Salvo com sucesso</Toast.Title>
      </Toast>,
      { wrapper: Wrapper },
    );
    expect(screen.getByText('Salvo com sucesso')).toBeTruthy();
  });

  it('renderiza Toast.Description', () => {
    render(
      <Toast>
        <Toast.Title>T</Toast.Title>
        <Toast.Description>Detalhes</Toast.Description>
      </Toast>,
      { wrapper: Wrapper },
    );
    expect(screen.getByText('Detalhes')).toBeTruthy();
  });

  it('tone critical → accessibilityRole="alert" + liveRegion="assertive"', () => {
    render(
      <Toast tone="critical" testID="t">
        <Toast.Title>Erro</Toast.Title>
      </Toast>,
      { wrapper: Wrapper },
    );
    const node = screen.getByTestId('t');
    expect(node.props.accessibilityRole).toBe('alert');
    expect(node.props.accessibilityLiveRegion).toBe('assertive');
  });

  it('tone warning → accessibilityRole="alert" + liveRegion="assertive"', () => {
    render(
      <Toast tone="warning" testID="t">
        <Toast.Title>Atenção</Toast.Title>
      </Toast>,
      { wrapper: Wrapper },
    );
    const node = screen.getByTestId('t');
    expect(node.props.accessibilityRole).toBe('alert');
    expect(node.props.accessibilityLiveRegion).toBe('assertive');
  });

  it('tone success → liveRegion="polite"', () => {
    render(
      <Toast tone="success" testID="t">
        <Toast.Title>OK</Toast.Title>
      </Toast>,
      { wrapper: Wrapper },
    );
    expect(screen.getByTestId('t').props.accessibilityLiveRegion).toBe('polite');
  });

  it('Toast.Close dispara onClose', () => {
    const onClose = jest.fn();
    render(
      <Toast>
        <Toast.Title>T</Toast.Title>
        <Toast.Close onClose={onClose} />
      </Toast>,
      { wrapper: Wrapper },
    );
    fireEvent.press(screen.getByLabelText('Fechar'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Toast.Close aceita accessibilityLabel customizado', () => {
    render(
      <Toast>
        <Toast.Title>T</Toast.Title>
        <Toast.Close accessibilityLabel="Dispensar" />
      </Toast>,
      { wrapper: Wrapper },
    );
    expect(screen.getByLabelText('Dispensar')).toBeTruthy();
  });

  it('Toast.Icon renderiza ícone tone-default quando sem children', () => {
    render(
      <Toast tone="success">
        <Toast.Icon />
        <Toast.Title>Ok</Toast.Title>
      </Toast>,
      { wrapper: Wrapper },
    );
    expect(screen.getByText('Ok')).toBeTruthy();
  });
});

describe('useToast + Toaster (native)', () => {
  function TestHarness({
    placement,
    toastPlacement,
  }: {
    placement?: 'top-right' | 'bottom-right' | 'top-center';
    toastPlacement?: 'top-right' | 'bottom-right' | 'top-center';
  }) {
    const { toast } = useToast();
    return (
      <>
        <Toaster placement={placement} />
        <Toast.Close
          accessibilityLabel="Mostrar"
          onClose={() =>
            toast({
              title: 'Arquivo salvo',
              tone: 'success',
              duration: 5000,
              placement: toastPlacement,
            })
          }
        />
      </>
    );
  }

  it('exibe toast ao chamar toast()', async () => {
    render(<TestHarness />, { wrapper: Wrapper });
    fireEvent.press(screen.getByLabelText('Mostrar'));
    await waitFor(() => expect(screen.getByText('Arquivo salvo')).toBeTruthy());
  });

  it('remove toast ao expirar duration', async () => {
    jest.useFakeTimers();
    render(<TestHarness />, { wrapper: Wrapper });
    fireEvent.press(screen.getByLabelText('Mostrar'));
    await waitFor(() => expect(screen.getByText('Arquivo salvo')).toBeTruthy());
    act(() => {
      jest.advanceTimersByTime(5001);
    });
    await waitFor(() => expect(screen.queryByText('Arquivo salvo')).toBeNull());
    jest.useRealTimers();
  });

  it('remove toast ao pressionar fechar', async () => {
    render(<TestHarness />, { wrapper: Wrapper });
    fireEvent.press(screen.getByLabelText('Mostrar'));
    await waitFor(() => expect(screen.getByText('Arquivo salvo')).toBeTruthy());
    fireEvent.press(screen.getByLabelText('Fechar'));
    await waitFor(() => expect(screen.queryByText('Arquivo salvo')).toBeNull());
  });

  it('toast com duration=0 é persistente', async () => {
    jest.useFakeTimers();
    function H() {
      const { toast } = useToast();
      return (
        <>
          <Toaster />
          <Toast.Close
            accessibilityLabel="Persistir"
            onClose={() => toast({ title: 'Fica', duration: 0 })}
          />
        </>
      );
    }
    render(<H />, { wrapper: Wrapper });
    fireEvent.press(screen.getByLabelText('Persistir'));
    await waitFor(() => expect(screen.getByText('Fica')).toBeTruthy());
    act(() => {
      jest.advanceTimersByTime(60_000);
    });
    expect(screen.getByText('Fica')).toBeTruthy();
    jest.useRealTimers();
  });

  it('toast com placement vai para o stack daquele placement', async () => {
    render(<TestHarness toastPlacement="top-center" placement="bottom-right" />, {
      wrapper: Wrapper,
    });
    fireEvent.press(screen.getByLabelText('Mostrar'));
    await waitFor(() => expect(screen.getByText('Arquivo salvo')).toBeTruthy());
    expect(screen.getByTestId('toast-stack-top-center')).toBeTruthy();
    expect(screen.queryByTestId('toast-stack-bottom-right')).toBeNull();
  });

  it('toasts em placements distintos coexistem em stacks separados', async () => {
    function Harness() {
      const { toast } = useToast();
      return (
        <>
          <Toaster placement="bottom-right" />
          <Toast.Close
            accessibilityLabel="top"
            onClose={() => toast({ title: 'Topo', placement: 'top-center', duration: 0 })}
          />
          <Toast.Close
            accessibilityLabel="bottom"
            onClose={() => toast({ title: 'Base', placement: 'bottom-right', duration: 0 })}
          />
        </>
      );
    }
    render(<Harness />, { wrapper: Wrapper });
    fireEvent.press(screen.getByLabelText('top'));
    fireEvent.press(screen.getByLabelText('bottom'));
    await waitFor(() => expect(screen.getByText('Topo')).toBeTruthy());
    expect(screen.getByTestId('toast-stack-top-center')).toBeTruthy();
    expect(screen.getByTestId('toast-stack-bottom-right')).toBeTruthy();
  });

  it('toast sem placement cai no placement (fallback) do Toaster', async () => {
    render(<TestHarness placement="top-right" />, { wrapper: Wrapper });
    fireEvent.press(screen.getByLabelText('Mostrar'));
    await waitFor(() => expect(screen.getByText('Arquivo salvo')).toBeTruthy());
    expect(screen.getByTestId('toast-stack-top-right')).toBeTruthy();
  });
});
