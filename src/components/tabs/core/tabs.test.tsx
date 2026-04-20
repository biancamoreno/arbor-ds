import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs } from './tabs';
import { ArborProvider } from '../../../ecosystem';
import { themeLight } from '../../../foundations';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

function BasicTabs({ defaultValue = 'a' }: { defaultValue?: string }) {
  return (
    <Tabs defaultValue={defaultValue}>
      <Tabs.List>
        <Tabs.Trigger value="a">Tab A</Tabs.Trigger>
        <Tabs.Trigger value="b">Tab B</Tabs.Trigger>
        <Tabs.Trigger value="c" disabled>Tab C</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="a">Conteúdo A</Tabs.Content>
      <Tabs.Content value="b">Conteúdo B</Tabs.Content>
      <Tabs.Content value="c">Conteúdo C</Tabs.Content>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('renderiza triggers com role="tab"', () => {
    render(<BasicTabs />, { wrapper });
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  it('tablist tem role="tablist"', () => {
    render(<BasicTabs />, { wrapper });
    expect(screen.getByRole('tablist')).toBeTruthy();
  });

  it('tab ativa tem aria-selected=true', () => {
    render(<BasicTabs defaultValue="a" />, { wrapper });
    expect(screen.getByRole('tab', { name: 'Tab A' }).getAttribute('aria-selected')).toBe('true');
  });

  it('tab inativa tem aria-selected=false', () => {
    render(<BasicTabs defaultValue="a" />, { wrapper });
    expect(screen.getByRole('tab', { name: 'Tab B' }).getAttribute('aria-selected')).toBe('false');
  });

  it('exibe conteúdo da tab ativa', () => {
    render(<BasicTabs defaultValue="a" />, { wrapper });
    expect(screen.getByText('Conteúdo A')).toBeTruthy();
  });

  it('oculta conteúdo de tab inativa', () => {
    render(<BasicTabs defaultValue="a" />, { wrapper });
    expect(screen.queryByText('Conteúdo B')).toBeNull();
  });

  it('troca conteúdo ao clicar', () => {
    render(<BasicTabs />, { wrapper });
    fireEvent.click(screen.getByRole('tab', { name: 'Tab B' }));
    expect(screen.getByText('Conteúdo B')).toBeTruthy();
    expect(screen.queryByText('Conteúdo A')).toBeNull();
  });

  it('tab desabilitada não muda o painel ativo', () => {
    render(<BasicTabs defaultValue="a" />, { wrapper });
    fireEvent.click(screen.getByRole('tab', { name: 'Tab C' }));
    expect(screen.queryByText('Conteúdo C')).toBeNull();
  });

  it('tabpanel tem role="tabpanel" e aria-labelledby correto', () => {
    render(<BasicTabs defaultValue="a" />, { wrapper });
    const panel = screen.getByRole('tabpanel');
    expect(panel).toBeTruthy();
    expect(panel.getAttribute('aria-labelledby')).toBe('tab-trigger-a');
  });

  it('modo controlado chama onValueChange', () => {
    const onChange = jest.fn();
    render(
      <Tabs value="a" onValueChange={onChange}>
        <Tabs.List>
          <Tabs.Trigger value="a">A</Tabs.Trigger>
          <Tabs.Trigger value="b">B</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="a">CA</Tabs.Content>
        <Tabs.Content value="b">CB</Tabs.Content>
      </Tabs>,
      { wrapper }
    );
    fireEvent.click(screen.getByRole('tab', { name: 'B' }));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('ArrowRight foca próxima tab', () => {
    render(<BasicTabs defaultValue="a" />, { wrapper });
    const tabA = screen.getByRole('tab', { name: 'Tab A' });
    tabA.focus();
    fireEvent.keyDown(tabA, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Tab B' }));
  });

  it('ArrowLeft foca tab anterior', () => {
    render(<BasicTabs defaultValue="b" />, { wrapper });
    const tabB = screen.getByRole('tab', { name: 'Tab B' });
    tabB.focus();
    fireEvent.keyDown(tabB, { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Tab A' }));
  });
});
