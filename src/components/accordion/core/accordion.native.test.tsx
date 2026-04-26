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

function BasicAccordion(props: { defaultValue?: string; type?: 'single' | 'multiple' }) {
  return (
    <Accordion {...props}>
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
    </Accordion>
  );
}

describe('Accordion (native)', () => {
  it('Triggers expõem accessibilityRole="button"', () => {
    render(<BasicAccordion />, { wrapper: Wrapper });
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('item fechado tem accessibilityState.expanded=false', () => {
    render(<BasicAccordion />, { wrapper: Wrapper });
    expect(screen.getByRole('button', { name: 'Trigger A' }).props.accessibilityState.expanded).toBe(false);
  });

  it('item aberto via defaultValue tem accessibilityState.expanded=true', () => {
    render(<BasicAccordion defaultValue="a" />, { wrapper: Wrapper });
    expect(screen.getByRole('button', { name: 'Trigger A' }).props.accessibilityState.expanded).toBe(true);
  });

  it('Content renderiza apenas quando aberto', () => {
    render(<BasicAccordion defaultValue="a" />, { wrapper: Wrapper });
    expect(screen.getByText('Conteúdo A')).toBeTruthy();
    expect(screen.queryByText('Conteúdo B')).toBeNull();
  });

  it('toggle abre conteúdo ao pressionar', () => {
    render(<BasicAccordion />, { wrapper: Wrapper });
    expect(screen.queryByText('Conteúdo B')).toBeNull();
    fireEvent.press(screen.getByRole('button', { name: 'Trigger B' }));
    expect(screen.getByText('Conteúdo B')).toBeTruthy();
  });

  it('modo single: abrir B fecha A', () => {
    render(<BasicAccordion defaultValue="a" />, { wrapper: Wrapper });
    fireEvent.press(screen.getByRole('button', { name: 'Trigger B' }));
    expect(screen.queryByText('Conteúdo A')).toBeNull();
    expect(screen.getByText('Conteúdo B')).toBeTruthy();
  });

  it('modo multiple: A e B podem coexistir abertos', () => {
    render(<BasicAccordion type="multiple" defaultValue="a" />, { wrapper: Wrapper });
    fireEvent.press(screen.getByRole('button', { name: 'Trigger B' }));
    expect(screen.getByText('Conteúdo A')).toBeTruthy();
    expect(screen.getByText('Conteúdo B')).toBeTruthy();
  });

  it('item disabled não toggla', () => {
    render(<BasicAccordion />, { wrapper: Wrapper });
    fireEvent.press(screen.getByRole('button', { name: 'Trigger C' }));
    expect(screen.queryByText('Conteúdo C')).toBeNull();
    expect(screen.getByRole('button', { name: 'Trigger C' }).props.accessibilityState.disabled).toBe(true);
  });

  it('modo controlado chama onValueChange', () => {
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
