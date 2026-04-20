import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Accordion } from './accordion';
import { ArborProvider } from '../../../ecosystem';
import { themeLight } from '../../../foundations';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

function BasicAccordion() {
  return (
    <Accordion>
      <Accordion.Item value="a">
        <Accordion.Trigger>Seção A</Accordion.Trigger>
        <Accordion.Content>Conteúdo A</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="b">
        <Accordion.Trigger>Seção B</Accordion.Trigger>
        <Accordion.Content>Conteúdo B</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}

describe('Accordion', () => {
  it('renderiza triggers', () => {
    render(<BasicAccordion />, { wrapper });
    expect(screen.getByText('Seção A')).toBeTruthy();
    expect(screen.getByText('Seção B')).toBeTruthy();
  });

  it('conteúdo começa fechado', () => {
    render(<BasicAccordion />, { wrapper });
    expect(screen.queryByText('Conteúdo A')).toBeNull();
  });

  it('abre conteúdo ao clicar no trigger', () => {
    render(<BasicAccordion />, { wrapper });
    fireEvent.click(screen.getByText('Seção A'));
    expect(screen.getByText('Conteúdo A')).toBeTruthy();
  });

  it('fecha ao clicar de novo (toggle)', () => {
    render(<BasicAccordion />, { wrapper });
    fireEvent.click(screen.getByText('Seção A'));
    expect(screen.getByText('Conteúdo A')).toBeTruthy();
    fireEvent.click(screen.getByText('Seção A'));
    expect(screen.queryByText('Conteúdo A')).toBeNull();
  });

  it('type=single fecha o outro ao abrir novo', () => {
    render(<BasicAccordion />, { wrapper });
    fireEvent.click(screen.getByText('Seção A'));
    expect(screen.getByText('Conteúdo A')).toBeTruthy();
    fireEvent.click(screen.getByText('Seção B'));
    expect(screen.queryByText('Conteúdo A')).toBeNull();
    expect(screen.getByText('Conteúdo B')).toBeTruthy();
  });

  it('type=multiple mantém ambos abertos', () => {
    render(
      <Accordion type="multiple">
        <Accordion.Item value="a"><Accordion.Trigger>A</Accordion.Trigger><Accordion.Content>CA</Accordion.Content></Accordion.Item>
        <Accordion.Item value="b"><Accordion.Trigger>B</Accordion.Trigger><Accordion.Content>CB</Accordion.Content></Accordion.Item>
      </Accordion>,
      { wrapper }
    );
    fireEvent.click(screen.getByText('A'));
    fireEvent.click(screen.getByText('B'));
    expect(screen.getByText('CA')).toBeTruthy();
    expect(screen.getByText('CB')).toBeTruthy();
  });

  it('trigger expõe aria-expanded=false quando fechado', () => {
    render(<BasicAccordion />, { wrapper });
    expect(screen.getAllByRole('button')[0].getAttribute('aria-expanded')).toBe('false');
  });

  it('trigger expõe aria-expanded=true quando aberto', () => {
    render(<BasicAccordion />, { wrapper });
    fireEvent.click(screen.getByText('Seção A'));
    expect(screen.getAllByRole('button')[0].getAttribute('aria-expanded')).toBe('true');
  });

  it('content expõe role="region" e aria-labelledby', () => {
    render(<BasicAccordion />, { wrapper });
    fireEvent.click(screen.getByText('Seção A'));
    const region = screen.getByRole('region');
    expect(region).toBeTruthy();
    expect(region.getAttribute('aria-labelledby')).toBeTruthy();
  });

  it('disabled impede abertura', () => {
    render(
      <Accordion>
        <Accordion.Item value="x" disabled>
          <Accordion.Trigger>Desabilitado</Accordion.Trigger>
          <Accordion.Content>Não deve aparecer</Accordion.Content>
        </Accordion.Item>
      </Accordion>,
      { wrapper }
    );
    fireEvent.click(screen.getByText('Desabilitado'));
    expect(screen.queryByText('Não deve aparecer')).toBeNull();
  });

  it('defaultValue abre item inicialmente', () => {
    render(
      <Accordion defaultValue="a">
        <Accordion.Item value="a"><Accordion.Trigger>A</Accordion.Trigger><Accordion.Content>CA</Accordion.Content></Accordion.Item>
      </Accordion>,
      { wrapper }
    );
    expect(screen.getByText('CA')).toBeTruthy();
  });

  it('onValueChange é chamado ao abrir', () => {
    const onChange = jest.fn();
    render(
      <Accordion onValueChange={onChange}>
        <Accordion.Item value="a"><Accordion.Trigger>A</Accordion.Trigger><Accordion.Content>CA</Accordion.Content></Accordion.Item>
      </Accordion>,
      { wrapper }
    );
    fireEvent.click(screen.getByText('A'));
    expect(onChange).toHaveBeenCalledWith('a');
  });
});
