import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Text } from '../../core/text';
import { Accordion } from './accordion';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

function ItemsABCDisabled() {
  return (
    <>
      <Accordion.Item value="a">
        <Accordion.Trigger>Trigger A</Accordion.Trigger>
        <Accordion.Content><Text>Conteúdo A</Text></Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="b">
        <Accordion.Trigger>Trigger B</Accordion.Trigger>
        <Accordion.Content><Text>Conteúdo B</Text></Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="c" disabled>
        <Accordion.Trigger>Trigger C</Accordion.Trigger>
        <Accordion.Content><Text>Conteúdo C</Text></Accordion.Content>
      </Accordion.Item>
    </>
  );
}

describe('Accordion (native)', () => {
  it('Triggers expõem accessibilityRole="button"', () => {
    render(<Accordion><ItemsABCDisabled /></Accordion>, { wrapper: Wrapper });
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('item fechado tem accessibilityState.expanded=false', () => {
    render(<Accordion><ItemsABCDisabled /></Accordion>, { wrapper: Wrapper });
    expect(screen.getByRole('button', { name: 'Trigger A' }).props.accessibilityState.expanded).toBe(false);
  });

  it('item aberto via defaultValue tem accessibilityState.expanded=true', () => {
    render(<Accordion defaultValue="a"><ItemsABCDisabled /></Accordion>, { wrapper: Wrapper });
    expect(screen.getByRole('button', { name: 'Trigger A' }).props.accessibilityState.expanded).toBe(true);
  });

  it('Content renderiza apenas quando aberto', () => {
    render(<Accordion defaultValue="a"><ItemsABCDisabled /></Accordion>, { wrapper: Wrapper });
    expect(screen.getByText('Conteúdo A')).toBeTruthy();
    expect(screen.queryByText('Conteúdo B')).toBeNull();
  });

  it('toggle abre conteúdo ao pressionar', () => {
    render(<Accordion><ItemsABCDisabled /></Accordion>, { wrapper: Wrapper });
    expect(screen.queryByText('Conteúdo B')).toBeNull();
    fireEvent.press(screen.getByRole('button', { name: 'Trigger B' }));
    expect(screen.getByText('Conteúdo B')).toBeTruthy();
  });

  it('modo single: abrir B fecha A', () => {
    render(<Accordion defaultValue="a"><ItemsABCDisabled /></Accordion>, { wrapper: Wrapper });
    fireEvent.press(screen.getByRole('button', { name: 'Trigger B' }));
    expect(screen.queryByText('Conteúdo A')).toBeNull();
    expect(screen.getByText('Conteúdo B')).toBeTruthy();
  });

  it('single + collapsible=false: clicar no aberto NÃO fecha', () => {
    render(<Accordion type="single" collapsible={false} defaultValue="a"><ItemsABCDisabled /></Accordion>, { wrapper: Wrapper });
    fireEvent.press(screen.getByRole('button', { name: 'Trigger A' }));
    expect(screen.getByText('Conteúdo A')).toBeTruthy();
  });

  it('modo multiple: A e B podem coexistir abertos', () => {
    render(
      <Accordion type="multiple" defaultValue={['a']}>
        <ItemsABCDisabled />
      </Accordion>,
      { wrapper: Wrapper },
    );
    fireEvent.press(screen.getByRole('button', { name: 'Trigger B' }));
    expect(screen.getByText('Conteúdo A')).toBeTruthy();
    expect(screen.getByText('Conteúdo B')).toBeTruthy();
  });

  it('multiple onValueChange recebe array', () => {
    const onChange = jest.fn();
    render(
      <Accordion type="multiple" onValueChange={onChange}>
        <Accordion.Item value="a">
          <Accordion.Trigger>A</Accordion.Trigger>
          <Accordion.Content><Text>CA</Text></Accordion.Content>
        </Accordion.Item>
      </Accordion>,
      { wrapper: Wrapper },
    );
    fireEvent.press(screen.getByRole('button', { name: 'A' }));
    expect(onChange).toHaveBeenCalledWith(['a']);
  });

  it('item disabled não toggla', () => {
    render(<Accordion><ItemsABCDisabled /></Accordion>, { wrapper: Wrapper });
    fireEvent.press(screen.getByRole('button', { name: 'Trigger C' }));
    expect(screen.queryByText('Conteúdo C')).toBeNull();
    expect(screen.getByRole('button', { name: 'Trigger C' }).props.accessibilityState.disabled).toBe(true);
  });

  it('modo controlado chama onValueChange (single)', () => {
    const onChange = jest.fn();
    render(
      <Accordion value="" onValueChange={onChange}>
        <Accordion.Item value="x">
          <Accordion.Trigger>X</Accordion.Trigger>
          <Accordion.Content><Text>CX</Text></Accordion.Content>
        </Accordion.Item>
      </Accordion>,
      { wrapper: Wrapper },
    );
    fireEvent.press(screen.getByRole('button', { name: 'X' }));
    expect(onChange).toHaveBeenCalledWith('x');
  });
});
