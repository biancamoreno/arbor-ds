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

  it('conteúdo começa fechado (data-state=closed)', () => {
    render(<BasicAccordion />, { wrapper });
    const regions = screen.getAllByRole('region');
    expect(regions[0].getAttribute('data-state')).toBe('closed');
    expect(regions[1].getAttribute('data-state')).toBe('closed');
  });

  it('abre conteúdo ao clicar no trigger', () => {
    render(<BasicAccordion />, { wrapper });
    fireEvent.click(screen.getByText('Seção A'));
    expect(screen.getByText('Conteúdo A')).toBeTruthy();
  });

  it('fecha ao clicar de novo (toggle) — data-state=closed', () => {
    render(<BasicAccordion />, { wrapper });
    fireEvent.click(screen.getByText('Seção A'));
    const regions = screen.getAllByRole('region');
    expect(regions[0].getAttribute('data-state')).toBe('open');
    fireEvent.click(screen.getByText('Seção A'));
    expect(regions[0].getAttribute('data-state')).toBe('closed');
  });

  it('type=single fecha o outro ao abrir novo', () => {
    render(<BasicAccordion />, { wrapper });
    fireEvent.click(screen.getByText('Seção A'));
    const regions = screen.getAllByRole('region');
    expect(regions[0].getAttribute('data-state')).toBe('open');
    fireEvent.click(screen.getByText('Seção B'));
    expect(regions[0].getAttribute('data-state')).toBe('closed');
    expect(regions[1].getAttribute('data-state')).toBe('open');
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
    const openRegion = screen.getAllByRole('region').find(r => r.getAttribute('data-state') === 'open');
    expect(openRegion).toBeTruthy();
    expect(openRegion?.getAttribute('aria-labelledby')).toBeTruthy();
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
    const region = screen.getByRole('region');
    expect(region.getAttribute('data-state')).toBe('closed');
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

  it('trigger tem ChevronDown como SVG (icon)', () => {
    const { container } = render(<BasicAccordion />, { wrapper });
    const triggers = container.querySelectorAll('button');
    const firstTrigger = triggers[0];
    expect(firstTrigger.querySelector('svg')).toBeTruthy();
  });

  it('conteúdo usa grid-template-rows para animação', () => {
    render(<BasicAccordion />, { wrapper });
    const regions = screen.getAllByRole('region');
    expect(regions[0].style.gridTemplateRows).toBe('0fr');
    fireEvent.click(screen.getByText('Seção A'));
    expect(regions[0].style.gridTemplateRows).toBe('1fr');
  });
});
