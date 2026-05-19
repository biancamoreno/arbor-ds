import React from 'react';
import { Text as RNText } from 'react-native';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Drawer } from './drawer.native';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

describe('Drawer (native)', () => {
  it('exporta API compound', () => {
    expect(Drawer).toBeDefined();
    expect(Drawer.Root).toBeDefined();
    expect(Drawer.Trigger).toBeDefined();
    expect(Drawer.Overlay).toBeDefined();
    expect(Drawer.Content).toBeDefined();
    expect(Drawer.Header).toBeDefined();
    expect(Drawer.Body).toBeDefined();
    expect(Drawer.Footer).toBeDefined();
    expect(Drawer.Title).toBeDefined();
    expect(Drawer.Description).toBeDefined();
    expect(Drawer.Close).toBeDefined();
  });

  it('abre ao pressionar o trigger', () => {
    render(
      <Drawer>
        <Drawer.Trigger>
          <RNText>Abrir</RNText>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Filtros</Drawer.Title>
          <Drawer.Description>Refine a busca.</Drawer.Description>
        </Drawer.Content>
      </Drawer>,
      { wrapper: Wrapper },
    );

    expect(screen.queryByText('Filtros')).toBeNull();
    const [trigger] = screen.getAllByRole('button');
    act(() => { fireEvent.press(trigger); });
    expect(screen.queryByText('Filtros')).toBeTruthy();
  });

  it('fecha via Drawer.Close', () => {
    render(
      <Drawer defaultOpen>
        <Drawer.Content>
          <Drawer.Title>Conteúdo</Drawer.Title>
          <Drawer.Close accessibilityLabel="Fechar painel" />
        </Drawer.Content>
      </Drawer>,
      { wrapper: Wrapper },
    );

    expect(screen.queryByText('Conteúdo')).toBeTruthy();
    act(() => { fireEvent.press(screen.getByLabelText('Fechar painel')); });
    expect(screen.queryByText('Conteúdo')).toBeNull();
  });

  it('chama onOpenChange ao abrir/fechar', () => {
    const onOpenChange = jest.fn();
    render(
      <Drawer onOpenChange={onOpenChange}>
        <Drawer.Trigger>
          <RNText>Abrir</RNText>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Modal</Drawer.Title>
          <Drawer.Close accessibilityLabel="Fechar" />
        </Drawer.Content>
      </Drawer>,
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
      <Drawer defaultOpen>
        <Drawer.Content>
          <Drawer.Title>Default Open</Drawer.Title>
        </Drawer.Content>
      </Drawer>,
      { wrapper: Wrapper },
    );
    expect(screen.queryByText('Default Open')).toBeTruthy();
  });

  it('closeOnOverlayClick={false} impede fechamento via tap no scrim', () => {
    render(
      <Drawer defaultOpen closeOnOverlayClick={false}>
        <Drawer.Content>
          <Drawer.Title>Wizard</Drawer.Title>
        </Drawer.Content>
      </Drawer>,
      { wrapper: Wrapper },
    );
    expect(screen.queryByText('Wizard')).toBeTruthy();
  });

  it('lockBodyScroll é no-op em native (sem efeito colateral)', () => {
    expect(() =>
      render(
        <Drawer defaultOpen lockBodyScroll={false}>
          <Drawer.Content>
            <Drawer.Title>OK</Drawer.Title>
          </Drawer.Content>
        </Drawer>,
        { wrapper: Wrapper },
      ),
    ).not.toThrow();
  });

  // ── RFC-0043: API plana ─────────────────────────────────────────────────

  it('API plana monta header/body/footer no native', () => {
    render(
      <Drawer defaultOpen title="Filtros" description="Refine">
        <RNText>Body livre</RNText>
      </Drawer>,
      { wrapper: Wrapper },
    );

    expect(screen.queryByText('Filtros')).toBeTruthy();
    expect(screen.queryByText('Refine')).toBeTruthy();
    expect(screen.queryByText('Body livre')).toBeTruthy();
  });

  it("role='alertdialog' mapeia para accessibilityRole='alert' no native", () => {
    render(
      <Drawer defaultOpen role="alertdialog" title="Confirmar saída">
        <RNText>Você tem alterações não salvas.</RNText>
      </Drawer>,
      { wrapper: Wrapper },
    );

    const modalNode = screen.UNSAFE_root.findAll(
      (n: { props?: { accessibilityViewIsModal?: boolean } }) => n.props?.accessibilityViewIsModal === true,
    )[0];
    expect(modalNode).toBeTruthy();
    expect(modalNode?.props?.accessibilityRole).toBe('alert');
  });

  it('aceita placement nas 4 direções sem quebrar render', () => {
    (['left', 'right', 'top', 'bottom'] as const).forEach((placement) => {
      const { unmount } = render(
        <Drawer defaultOpen placement={placement} title={`Drawer ${placement}`} />,
        { wrapper: Wrapper },
      );
      expect(screen.queryByText(`Drawer ${placement}`)).toBeTruthy();
      unmount();
    });
  });
});
