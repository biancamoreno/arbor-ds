import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Button } from './button';
import { ButtonGroup } from '../../button-group';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

describe('Button (native)', () => {
  it('renderiza com accessibilityRole="button"', () => {
    render(<Button>Salvar</Button>, { wrapper: Wrapper });
    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('renderiza children string em <Text>', () => {
    render(<Button>Confirmar</Button>, { wrapper: Wrapper });
    expect(screen.getByText('Confirmar')).toBeTruthy();
  });

  it('dispara onClick ao pressionar', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Press</Button>, { wrapper: Wrapper });
    fireEvent.press(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('disabled bloqueia onClick e expõe accessibilityState.disabled', () => {
    const onClick = jest.fn();
    render(<Button disabled onClick={onClick}>X</Button>, { wrapper: Wrapper });
    fireEvent.press(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button').props.accessibilityState.disabled).toBe(true);
  });

  it('loading bloqueia onClick e expõe accessibilityState.busy=true', () => {
    const onClick = jest.fn();
    render(<Button loading onClick={onClick}>Salvando</Button>, { wrapper: Wrapper });
    const btn = screen.getByRole('button');
    fireEvent.press(btn);
    expect(onClick).not.toHaveBeenCalled();
    expect(btn.props.accessibilityState.busy).toBe(true);
  });

  it('aceita variantes sem quebrar', () => {
    const variants: Array<'primary' | 'secondary' | 'ghost' | 'danger'> = [
      'primary',
      'secondary',
      'ghost',
      'danger',
    ];
    variants.forEach((variant) => {
      const { unmount } = render(<Button variant={variant}>{variant}</Button>, { wrapper: Wrapper });
      expect(screen.getByText(variant)).toBeTruthy();
      unmount();
    });
  });

  it('aceita sizes sem quebrar', () => {
    const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];
    sizes.forEach((size) => {
      const { unmount } = render(<Button size={size}>{size}</Button>, { wrapper: Wrapper });
      expect(screen.getByText(size)).toBeTruthy();
      unmount();
    });
  });

  it('dentro de ButtonGroup attached, primeiro item colapsa radii à direita', () => {
    render(
      <ButtonGroup aria-label="Ações" attached>
        <Button>Um</Button>
        <Button>Dois</Button>
        <Button>Três</Button>
      </ButtonGroup>,
      { wrapper: Wrapper },
    );
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('ButtonGroup isDisabled propaga para itens (busy ou disabled)', () => {
    const onClick = jest.fn();
    render(
      <ButtonGroup aria-label="Ações" isDisabled>
        <Button onClick={onClick}>Bloqueado</Button>
      </ButtonGroup>,
      { wrapper: Wrapper },
    );
    fireEvent.press(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button').props.accessibilityState.disabled).toBe(true);
  });
});
