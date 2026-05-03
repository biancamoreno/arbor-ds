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

  it('fecha ao clicar de novo (single + collapsible default true)', () => {
    render(<BasicAccordion />, { wrapper });
    fireEvent.click(screen.getByText('Seção A'));
    const regions = screen.getAllByRole('region');
    expect(regions[0].getAttribute('data-state')).toBe('open');
    fireEvent.click(screen.getByText('Seção A'));
    expect(regions[0].getAttribute('data-state')).toBe('closed');
  });

  it('collapsible=false impede fechar item ativo em single', () => {
    render(
      <Accordion type="single" collapsible={false} defaultValue="a">
        <Accordion.Item value="a"><Accordion.Trigger>A</Accordion.Trigger><Accordion.Content>CA</Accordion.Content></Accordion.Item>
        <Accordion.Item value="b"><Accordion.Trigger>B</Accordion.Trigger><Accordion.Content>CB</Accordion.Content></Accordion.Item>
      </Accordion>,
      { wrapper },
    );
    const regions = screen.getAllByRole('region');
    expect(regions[0].getAttribute('data-state')).toBe('open');
    fireEvent.click(screen.getByText('A'));
    expect(regions[0].getAttribute('data-state')).toBe('open');
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

  it('type=multiple onValueChange recebe array', () => {
    const onChange = jest.fn();
    render(
      <Accordion type="multiple" onValueChange={onChange}>
        <Accordion.Item value="a"><Accordion.Trigger>A</Accordion.Trigger><Accordion.Content>CA</Accordion.Content></Accordion.Item>
      </Accordion>,
      { wrapper },
    );
    fireEvent.click(screen.getByText('A'));
    expect(onChange).toHaveBeenCalledWith(['a']);
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

  it('disabled impede abertura e expõe aria-disabled', () => {
    render(
      <Accordion>
        <Accordion.Item value="x" disabled>
          <Accordion.Trigger>Desabilitado</Accordion.Trigger>
          <Accordion.Content>Não deve aparecer</Accordion.Content>
        </Accordion.Item>
      </Accordion>,
      { wrapper }
    );
    const trigger = screen.getByRole('button');
    expect(trigger.getAttribute('aria-disabled')).toBe('true');
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

  it('onValueChange é chamado ao abrir (single)', () => {
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

  describe('teclado', () => {
    it('ArrowDown move foco para o próximo trigger', () => {
      render(<BasicAccordion />, { wrapper });
      const buttons = screen.getAllByRole('button');
      buttons[0].focus();
      fireEvent.keyDown(buttons[0], { key: 'ArrowDown' });
      expect(document.activeElement).toBe(buttons[1]);
    });

    it('ArrowUp do primeiro vai para o último (wrap)', () => {
      render(<BasicAccordion />, { wrapper });
      const buttons = screen.getAllByRole('button');
      buttons[0].focus();
      fireEvent.keyDown(buttons[0], { key: 'ArrowUp' });
      expect(document.activeElement).toBe(buttons[1]);
    });

    it('Home move foco para o primeiro trigger', () => {
      render(<BasicAccordion />, { wrapper });
      const buttons = screen.getAllByRole('button');
      buttons[1].focus();
      fireEvent.keyDown(buttons[1], { key: 'Home' });
      expect(document.activeElement).toBe(buttons[0]);
    });

    it('End move foco para o último trigger', () => {
      render(<BasicAccordion />, { wrapper });
      const buttons = screen.getAllByRole('button');
      buttons[0].focus();
      fireEvent.keyDown(buttons[0], { key: 'End' });
      expect(document.activeElement).toBe(buttons[1]);
    });

    it('DOM-order: items condicionais respeitam ordem visual no End', () => {
      function ConditionalAccordion({ showB }: { showB: boolean }) {
        return (
          <Accordion>
            <Accordion.Item key="a" value="a"><Accordion.Trigger>A</Accordion.Trigger><Accordion.Content>CA</Accordion.Content></Accordion.Item>
            {showB && (
              <Accordion.Item key="b" value="b"><Accordion.Trigger>B</Accordion.Trigger><Accordion.Content>CB</Accordion.Content></Accordion.Item>
            )}
            <Accordion.Item key="c" value="c"><Accordion.Trigger>C</Accordion.Trigger><Accordion.Content>CC</Accordion.Content></Accordion.Item>
          </Accordion>
        );
      }
      const { rerender } = render(<ConditionalAccordion showB={false} />, { wrapper });
      // re-monta com B no meio (B registra DEPOIS de C, mas no DOM aparece ANTES)
      rerender(<ConditionalAccordion showB />);
      const triggerA = screen.getByRole('button', { name: 'A' });
      triggerA.focus();
      fireEvent.keyDown(triggerA, { key: 'End' });
      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'C' }));
    });
  });
});
