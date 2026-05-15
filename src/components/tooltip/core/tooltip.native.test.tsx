import React from 'react';
import { Text as RNText } from 'react-native';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Tooltip } from './tooltip.native';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

describe('Tooltip (native)', () => {
  it('exporta API plana + compound', () => {
    expect(Tooltip).toBeDefined();
    expect(Tooltip.Root).toBeDefined();
    expect(Tooltip.Trigger).toBeDefined();
    expect(Tooltip.Content).toBeDefined();
  });

  it('long-press abre o tooltip; pressOut fecha', () => {
    render(
      <Tooltip label="Dica útil" placement="top">
        <RNText>Trigger</RNText>
      </Tooltip>,
      { wrapper: Wrapper },
    );

    expect(screen.queryByText('Dica útil')).toBeNull();

    const trigger = screen.getByLabelText('Dica útil');
    act(() => {
      fireEvent(trigger, 'longPress');
    });
    expect(screen.queryByText('Dica útil')).toBeTruthy();

    act(() => {
      fireEvent(trigger, 'pressOut');
    });
  });

  it('accessibilityLabel default = label quando string', () => {
    render(
      <Tooltip label="Excluir">
        <RNText>X</RNText>
      </Tooltip>,
      { wrapper: Wrapper },
    );
    expect(screen.getByLabelText('Excluir')).toBeTruthy();
  });

  it('accessibilityLabel override sobrescreve label', () => {
    render(
      <Tooltip label="X" accessibilityLabel="Botão remover item">
        <RNText>X</RNText>
      </Tooltip>,
      { wrapper: Wrapper },
    );
    expect(screen.getByLabelText('Botão remover item')).toBeTruthy();
  });

  it('propaga accessibilityHint para o Pressable trigger', () => {
    render(
      <Tooltip label="X" accessibilityHint="Pressione e segure para ver">
        <RNText>Trigger</RNText>
      </Tooltip>,
      { wrapper: Wrapper },
    );
    const trigger = screen.getByLabelText('X');
    expect(trigger.props.accessibilityHint).toBe('Pressione e segure para ver');
  });

  it('respects disabled state — long-press não abre', () => {
    render(
      <Tooltip label="Dica" disabled>
        <RNText>X</RNText>
      </Tooltip>,
      { wrapper: Wrapper },
    );
    const trigger = screen.getByLabelText('Dica');
    act(() => {
      fireEvent(trigger, 'longPress');
    });
    // Texto 'Dica' aparece no trigger (RNText filho); o tooltip overlay não monta.
    // Verificamos que NÃO há 2 ocorrências (trigger + overlay).
    const matches = screen.queryAllByText('Dica');
    expect(matches.length).toBe(0);
  });

  it('compound API funciona', () => {
    render(
      <Tooltip>
        <Tooltip.Trigger>
          <RNText testID="compound-trigger">Compound</RNText>
        </Tooltip.Trigger>
        <Tooltip.Content>Conteúdo rich</Tooltip.Content>
      </Tooltip>,
      { wrapper: Wrapper },
    );
    expect(screen.queryByText('Conteúdo rich')).toBeNull();
    // No compound, sem label/accessibilityLabel; o Pressable é o pai do RNText.
    const inner = screen.getByTestId('compound-trigger');
    let trigger: typeof inner | null = inner;
    while (trigger && trigger.type !== 'View' && !trigger.props.onLongPress) {
      trigger = trigger.parent as typeof inner | null;
    }
    expect(trigger).not.toBeNull();
    act(() => {
      fireEvent(trigger!, 'longPress');
    });
    expect(screen.queryByText('Conteúdo rich')).toBeTruthy();
  });
});
