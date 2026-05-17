import React from 'react';
import { Text as RNText } from 'react-native';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Popover } from './popover.native';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

describe('Popover (native)', () => {
  it('exporta API plana + compound', () => {
    expect(Popover).toBeDefined();
    expect(Popover.Root).toBeDefined();
    expect(Popover.Trigger).toBeDefined();
    expect(Popover.Content).toBeDefined();
    expect(Popover.Close).toBeDefined();
  });

  it('abre ao pressionar o trigger', () => {
    render(
      <Popover>
        <Popover.Trigger>
          <RNText>Abrir</RNText>
        </Popover.Trigger>
        <Popover.Content>
          <RNText>Conteúdo</RNText>
        </Popover.Content>
      </Popover>,
      { wrapper: Wrapper },
    );

    expect(screen.queryByText('Conteúdo')).toBeNull();

    const trigger = screen.getByText('Abrir');
    act(() => {
      fireEvent.press(trigger);
    });
    expect(screen.queryByText('Conteúdo')).toBeTruthy();
  });

  it('fecha via Popover.Close', () => {
    render(
      <Popover defaultOpen>
        <Popover.Content>
          <RNText>Conteúdo</RNText>
          <Popover.Close accessibilityLabel="Fechar popover" />
        </Popover.Content>
      </Popover>,
      { wrapper: Wrapper },
    );

    expect(screen.queryByText('Conteúdo')).toBeTruthy();
    const closeBtn = screen.getByLabelText('Fechar popover');
    act(() => {
      fireEvent.press(closeBtn);
    });
    expect(screen.queryByText('Conteúdo')).toBeNull();
  });

  it('toggle ao pressionar trigger novamente', () => {
    render(
      <Popover>
        <Popover.Trigger>
          <RNText>Toggle</RNText>
        </Popover.Trigger>
        <Popover.Content>
          <RNText>Conteúdo</RNText>
        </Popover.Content>
      </Popover>,
      { wrapper: Wrapper },
    );

    const trigger = screen.getByText('Toggle');

    act(() => {
      fireEvent.press(trigger);
    });
    expect(screen.queryByText('Conteúdo')).toBeTruthy();

    act(() => {
      fireEvent.press(trigger);
    });
    expect(screen.queryByText('Conteúdo')).toBeNull();
  });

  it('chama onOpenChange ao abrir/fechar', () => {
    const onOpenChange = jest.fn();
    render(
      <Popover onOpenChange={onOpenChange}>
        <Popover.Trigger>
          <RNText>Abrir</RNText>
        </Popover.Trigger>
        <Popover.Content>
          <RNText>Conteúdo</RNText>
          <Popover.Close accessibilityLabel="Fechar" />
        </Popover.Content>
      </Popover>,
      { wrapper: Wrapper },
    );

    act(() => {
      fireEvent.press(screen.getByText('Abrir'));
    });
    expect(onOpenChange).toHaveBeenCalledWith(true);

    act(() => {
      fireEvent.press(screen.getByLabelText('Fechar'));
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('renderiza com defaultOpen=true', () => {
    render(
      <Popover defaultOpen>
        <Popover.Content>
          <RNText>Default open</RNText>
        </Popover.Content>
      </Popover>,
      { wrapper: Wrapper },
    );

    expect(screen.queryByText('Default open')).toBeTruthy();
  });
});
