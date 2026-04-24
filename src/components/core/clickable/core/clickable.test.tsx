import React, { useRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ArborProvider } from '../../../../ecosystem';
import { themeLight } from '../../../../foundations';
import { Clickable } from './clickable';
import { PressFeedback } from '../../press-feedback';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

describe('Clickable', () => {
  it('renderiza children dentro de um button por default', () => {
    render(<Clickable>Click me</Clickable>, { wrapper });
    const button = screen.getByText('Click me');
    expect(button.tagName).toBe('BUTTON');
  });

  it('chama onClick ao ser clicado', () => {
    const handler = jest.fn();
    render(<Clickable onClick={handler}>Click me</Clickable>, { wrapper });
    fireEvent.click(screen.getByText('Click me'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('respeita disabled (não dispara onClick)', () => {
    const handler = jest.fn();
    render(<Clickable onClick={handler} disabled>Click me</Clickable>, { wrapper });
    fireEvent.click(screen.getByText('Click me'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('forwarda ref canônico para o elemento DOM', () => {
    function Probe() {
      const ref = useRef<HTMLElement | null>(null);
      return (
        <Clickable ref={ref} testID="probe">
          target
        </Clickable>
      );
    }
    render(<Probe />, { wrapper });
    const el = screen.getByTestId('probe');
    expect(el).toBeTruthy();
    expect(el.tagName).toBe('BUTTON');
  });

  it('forwarda innerRef legado (compat) para o elemento DOM', () => {
    const ref = { current: null as HTMLElement | null };
    render(
      <Clickable innerRef={(node: HTMLElement | null) => { ref.current = node; }} testID="legacy">
        legacy
      </Clickable>,
      { wrapper },
    );
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('BUTTON');
  });

  it('aceita as polimórfico (renderiza como tag custom)', () => {
    render(
      <Clickable as="a" role="button" href="#x" testID="link">
        link
      </Clickable>,
      { wrapper },
    );
    const el = screen.getByTestId('link');
    expect(el.tagName).toBe('A');
  });

  it('responde a Enter/Space em buttons nativos', () => {
    const handler = jest.fn();
    render(<Clickable onClick={handler} testID="kb">k</Clickable>, { wrapper });
    const el = screen.getByTestId('kb');
    el.focus();
    fireEvent.click(el);
    expect(handler).toHaveBeenCalled();
  });

  it('compõe com PressFeedback como filho irmão', () => {
    render(
      <Clickable testID="composed">
        <PressFeedback variant="default" testID="feedback" />
        <span>conteúdo</span>
      </Clickable>,
      { wrapper },
    );
    expect(screen.getByTestId('composed')).toBeTruthy();
    expect(screen.getByTestId('feedback')).toBeTruthy();
    expect(screen.getByText('conteúdo')).toBeTruthy();
  });

  it('emite warning de a11y em dev quando as !== button/a sem role', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Clickable as="div">no role</Clickable>, { wrapper });
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('sem prop `role` definida'));
    spy.mockRestore();
  });

  it('NÃO emite warning quando role é fornecido', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Clickable as="div" role="button">with role</Clickable>, { wrapper });
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('NÃO emite warning para as="button" ou as="a"', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Clickable as="button">btn</Clickable>, { wrapper });
    render(<Clickable as="a">link</Clickable>, { wrapper });
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
