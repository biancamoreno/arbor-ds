import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FloatingActionButton } from './fab';
import { ArborProvider } from '../../../ecosystem';
import { themeLight } from '../../../foundations';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

describe('FloatingActionButton', () => {
  it('renderiza com aria-label', () => {
    render(
      <FloatingActionButton icon="Plus" onPress={() => {}} aria-label="Adicionar item" />,
      { wrapper },
    );
    expect(screen.getByRole('button', { name: 'Adicionar item' })).toBeTruthy();
  });

  it('renderiza label quando fornecido', () => {
    render(
      <FloatingActionButton icon="Plus" label="Nova venda" onPress={() => {}} />,
      { wrapper },
    );
    expect(screen.getByText('Nova venda')).toBeTruthy();
  });

  it('usa label como aria-label quando presente', () => {
    render(
      <FloatingActionButton icon="Pencil" label="Editar" onPress={() => {}} />,
      { wrapper },
    );
    expect(screen.getByRole('button', { name: 'Editar' })).toBeTruthy();
  });

  it('chama onPress ao clicar', () => {
    const onPress = jest.fn();
    render(
      <FloatingActionButton icon="Plus" onPress={onPress} aria-label="Adicionar" />,
      { wrapper },
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('não chama onPress quando disabled', () => {
    const onPress = jest.fn();
    render(
      <FloatingActionButton icon="Plus" onPress={onPress} disabled aria-label="Adicionar" />,
      { wrapper },
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('emite warning quando sem label e sem aria-label', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <FloatingActionButton icon="Plus" onPress={() => {}} />,
      { wrapper },
    );
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('[FloatingActionButton]'));
    spy.mockRestore();
  });

  it('renderiza como elemento button', () => {
    render(
      <FloatingActionButton icon="Plus" onPress={() => {}} aria-label="Adicionar" />,
      { wrapper },
    );
    expect(screen.getByRole('button').tagName).toBe('BUTTON');
  });
});

describe('FloatingActionButton accessibility — touch target (TD-016, WCAG 2.5.5)', () => {
  it.each([
    ['sm', 44],
    ['md', 56],
    ['lg', 72],
  ] as const)('size %s renders with height %d (>= 44)', (size, expected) => {
    render(
      <FloatingActionButton icon="Plus" size={size} onPress={() => {}} aria-label="x" />,
      { wrapper },
    );
    const btn = screen.getByRole('button') as HTMLButtonElement;
    expect(btn.style.height).toBe(`${expected}px`);
    expect(expected).toBeGreaterThanOrEqual(44);
  });
});
