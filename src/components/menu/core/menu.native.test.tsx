import React from 'react';
import { Text as RNText } from 'react-native';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Menu } from './menu.native';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

describe('Menu (native)', () => {
  it('exporta API compound', () => {
    expect(Menu).toBeDefined();
    expect(Menu.Root).toBeDefined();
    expect(Menu.Trigger).toBeDefined();
    expect(Menu.Content).toBeDefined();
    expect(Menu.Item).toBeDefined();
    expect(Menu.Label).toBeDefined();
    expect(Menu.Separator).toBeDefined();
  });

  it('abre ao pressionar o trigger', () => {
    render(
      <Menu>
        <Menu.Trigger>
          <RNText>Abrir</RNText>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item>
            <RNText>Editar</RNText>
          </Menu.Item>
        </Menu.Content>
      </Menu>,
      { wrapper: Wrapper },
    );

    expect(screen.queryByText('Editar')).toBeNull();

    act(() => {
      fireEvent.press(screen.getByText('Abrir'));
    });
    expect(screen.queryByText('Editar')).toBeTruthy();
  });

  it('chama onSelect e fecha ao pressionar item', () => {
    const onSelect = jest.fn();
    render(
      <Menu defaultOpen>
        <Menu.Content>
          <Menu.Item onSelect={onSelect}>
            <RNText>Editar</RNText>
          </Menu.Item>
        </Menu.Content>
      </Menu>,
      { wrapper: Wrapper },
    );

    act(() => {
      fireEvent.press(screen.getByText('Editar'));
    });
    expect(onSelect).toHaveBeenCalled();
    expect(screen.queryByText('Editar')).toBeNull();
  });

  it('item disabled não dispara onSelect', () => {
    const onSelect = jest.fn();
    render(
      <Menu defaultOpen>
        <Menu.Content>
          <Menu.Item disabled onSelect={onSelect}>
            <RNText>Excluir</RNText>
          </Menu.Item>
        </Menu.Content>
      </Menu>,
      { wrapper: Wrapper },
    );

    act(() => {
      fireEvent.press(screen.getByText('Excluir'));
    });
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('chama onOpenChange ao abrir/fechar', () => {
    const onOpenChange = jest.fn();
    render(
      <Menu onOpenChange={onOpenChange}>
        <Menu.Trigger>
          <RNText>Abrir</RNText>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item onSelect={() => undefined}>
            <RNText>Editar</RNText>
          </Menu.Item>
        </Menu.Content>
      </Menu>,
      { wrapper: Wrapper },
    );

    act(() => {
      fireEvent.press(screen.getByText('Abrir'));
    });
    expect(onOpenChange).toHaveBeenCalledWith(true);

    act(() => {
      fireEvent.press(screen.getByText('Editar'));
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('renderiza com defaultOpen=true', () => {
    render(
      <Menu defaultOpen>
        <Menu.Content>
          <Menu.Label>
            <RNText>Section</RNText>
          </Menu.Label>
          <Menu.Item>
            <RNText>Default open</RNText>
          </Menu.Item>
          <Menu.Separator />
        </Menu.Content>
      </Menu>,
      { wrapper: Wrapper },
    );

    expect(screen.queryByText('Default open')).toBeTruthy();
  });
});
