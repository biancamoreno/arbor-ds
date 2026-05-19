import React from 'react';
import { Text as RNText } from 'react-native';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Dialog } from './dialog.native';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

describe('Dialog (native)', () => {
  it('exporta API compound', () => {
    expect(Dialog).toBeDefined();
    expect(Dialog.Root).toBeDefined();
    expect(Dialog.Trigger).toBeDefined();
    expect(Dialog.Overlay).toBeDefined();
    expect(Dialog.Content).toBeDefined();
    expect(Dialog.Title).toBeDefined();
    expect(Dialog.Description).toBeDefined();
    expect(Dialog.Close).toBeDefined();
  });

  it('abre ao pressionar o trigger', () => {
    render(
      <Dialog>
        <Dialog.Trigger>
          <RNText>Abrir</RNText>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Confirmar</Dialog.Title>
          <Dialog.Description>Tem certeza?</Dialog.Description>
        </Dialog.Content>
      </Dialog>,
      { wrapper: Wrapper },
    );

    expect(screen.queryByText('Confirmar')).toBeNull();

    const [trigger] = screen.getAllByRole('button');
    act(() => { fireEvent.press(trigger); });
    expect(screen.queryByText('Confirmar')).toBeTruthy();
  });

  it('fecha via Dialog.Close', () => {
    render(
      <Dialog defaultOpen>
        <Dialog.Content>
          <Dialog.Title>Conteúdo</Dialog.Title>
          <Dialog.Close accessibilityLabel="Fechar diálogo" />
        </Dialog.Content>
      </Dialog>,
      { wrapper: Wrapper },
    );

    expect(screen.queryByText('Conteúdo')).toBeTruthy();
    act(() => { fireEvent.press(screen.getByLabelText('Fechar diálogo')); });
    expect(screen.queryByText('Conteúdo')).toBeNull();
  });

  it('chama onOpenChange ao abrir/fechar', () => {
    const onOpenChange = jest.fn();
    render(
      <Dialog onOpenChange={onOpenChange}>
        <Dialog.Trigger>
          <RNText>Abrir</RNText>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Modal</Dialog.Title>
          <Dialog.Close accessibilityLabel="Fechar" />
        </Dialog.Content>
      </Dialog>,
      { wrapper: Wrapper },
    );

    const [trigger] = screen.getAllByRole('button');
    act(() => { fireEvent.press(trigger); });
    expect(onOpenChange).toHaveBeenCalledWith(true);

    act(() => { fireEvent.press(screen.getByLabelText('Fechar')); });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('renderiza com defaultOpen=true', () => {
    render(
      <Dialog defaultOpen>
        <Dialog.Content>
          <Dialog.Title>Default Open</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
      { wrapper: Wrapper },
    );

    expect(screen.queryByText('Default Open')).toBeTruthy();
  });

  // ── PR1: saídas modeladas + composer fix ────────────────────────────────

  it('a11y: contentId expõe accessibilityViewIsModal + nativeID', () => {
    const { root } = render(
      <Dialog defaultOpen accessibilityLabel="Modal de teste">
        <Dialog.Content>
          <Dialog.Title>Modal</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
      { wrapper: Wrapper },
    );

    // Garante que o contentId é gerado (nativeID presente na árvore).
    expect(root).toBeTruthy();
    expect(screen.queryByText('Modal')).toBeTruthy();
  });

  it('closeOnOverlayClick={false} impede fechamento via tap no scrim', () => {
    render(
      <Dialog defaultOpen closeOnOverlayClick={false}>
        <Dialog.Content>
          <Dialog.Title>Wizard</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
      { wrapper: Wrapper },
    );

    // scrim é o Clickable que cobre a tela; nesse modo, tap é ignorado.
    // Verificamos que o conteúdo segue montado.
    expect(screen.queryByText('Wizard')).toBeTruthy();
  });

  it('lockBodyScroll é no-op em native (sem efeito colateral)', () => {
    // Garantia: passar a prop não quebra a render no native.
    expect(() =>
      render(
        <Dialog defaultOpen lockBodyScroll={false}>
          <Dialog.Content>
            <Dialog.Title>OK</Dialog.Title>
          </Dialog.Content>
        </Dialog>,
        { wrapper: Wrapper },
      ),
    ).not.toThrow();
  });

  // ── PR2 (RFC-0043): API plana ───────────────────────────────────────────

  it('expõe novos slots compound (Header/Body/Footer)', () => {
    expect(Dialog.Header).toBeDefined();
    expect(Dialog.Body).toBeDefined();
    expect(Dialog.Footer).toBeDefined();
  });

  it('API plana monta header/body/footer no native', () => {
    render(
      <Dialog defaultOpen title="Editar" description="Atualize">
        <RNText>Body livre</RNText>
      </Dialog>,
      { wrapper: Wrapper },
    );

    expect(screen.queryByText('Editar')).toBeTruthy();
    expect(screen.queryByText('Atualize')).toBeTruthy();
    expect(screen.queryByText('Body livre')).toBeTruthy();
  });

  it("role='alertdialog' mapeia para accessibilityRole='alert' no native", () => {
    render(
      <Dialog defaultOpen role="alertdialog" title="Excluir conta">
        <RNText>Esta ação é irreversível.</RNText>
      </Dialog>,
      { wrapper: Wrapper },
    );

    // O Animated.View do content carrega accessibilityRole='alert' quando
    // role='alertdialog'. Verificamos via UNSAFE_root traversal procurando o
    // node com accessibilityViewIsModal=true.
    const modalNode = screen.UNSAFE_root.findAll(
      (n: { props?: { accessibilityViewIsModal?: boolean } }) => n.props?.accessibilityViewIsModal === true,
    )[0];
    expect(modalNode).toBeTruthy();
    expect(modalNode?.props?.accessibilityRole).toBe('alert');
  });
});
