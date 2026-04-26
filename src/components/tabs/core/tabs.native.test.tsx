import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Text } from '../../core/text';
import { Tabs } from './tabs';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

function BasicTabs({ defaultValue = 'a' }: { defaultValue?: string }) {
  return (
    <Tabs defaultValue={defaultValue}>
      <Tabs.List>
        <Tabs.Trigger value="a">Tab A</Tabs.Trigger>
        <Tabs.Trigger value="b">Tab B</Tabs.Trigger>
        <Tabs.Trigger value="c" disabled>Tab C</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="a"><Text>Conteúdo A</Text></Tabs.Content>
      <Tabs.Content value="b"><Text>Conteúdo B</Text></Tabs.Content>
      <Tabs.Content value="c"><Text>Conteúdo C</Text></Tabs.Content>
    </Tabs>
  );
}

describe('Tabs (native)', () => {
  it('triggers expõem accessibilityRole="tab"', () => {
    render(<BasicTabs />, { wrapper: Wrapper });
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  it('tab ativa tem accessibilityState.selected=true', () => {
    render(<BasicTabs defaultValue="a" />, { wrapper: Wrapper });
    expect(screen.getByRole('tab', { name: 'Tab A' }).props.accessibilityState.selected).toBe(true);
  });

  it('tab inativa tem accessibilityState.selected=false', () => {
    render(<BasicTabs defaultValue="a" />, { wrapper: Wrapper });
    expect(screen.getByRole('tab', { name: 'Tab B' }).props.accessibilityState.selected).toBe(false);
  });

  it('exibe conteúdo da tab ativa', () => {
    render(<BasicTabs defaultValue="a" />, { wrapper: Wrapper });
    expect(screen.getByText('Conteúdo A')).toBeTruthy();
  });

  it('oculta conteúdo de tab inativa', () => {
    render(<BasicTabs defaultValue="a" />, { wrapper: Wrapper });
    expect(screen.queryByText('Conteúdo B')).toBeNull();
  });

  it('troca conteúdo ao pressionar trigger', () => {
    render(<BasicTabs />, { wrapper: Wrapper });
    fireEvent.press(screen.getByRole('tab', { name: 'Tab B' }));
    expect(screen.getByText('Conteúdo B')).toBeTruthy();
    expect(screen.queryByText('Conteúdo A')).toBeNull();
  });

  it('trigger desabilitado não muda o painel ativo', () => {
    render(<BasicTabs defaultValue="a" />, { wrapper: Wrapper });
    fireEvent.press(screen.getByRole('tab', { name: 'Tab C' }));
    expect(screen.queryByText('Conteúdo C')).toBeNull();
    expect(screen.getByRole('tab', { name: 'Tab C' }).props.accessibilityState.disabled).toBe(true);
  });

  it('modo controlado chama onValueChange', () => {
    const onChange = jest.fn();
    render(
      <Tabs value="a" onValueChange={onChange}>
        <Tabs.List>
          <Tabs.Trigger value="a">A</Tabs.Trigger>
          <Tabs.Trigger value="b">B</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="a"><Text>CA</Text></Tabs.Content>
        <Tabs.Content value="b"><Text>CB</Text></Tabs.Content>
      </Tabs>,
      { wrapper: Wrapper },
    );
    fireEvent.press(screen.getByRole('tab', { name: 'B' }));
    expect(onChange).toHaveBeenCalledWith('b');
  });
});
