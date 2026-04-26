import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Tag } from './tag';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

describe('Tag (native)', () => {
  it('renderiza com accessibilityRole="button"', () => {
    render(<Tag>label</Tag>, { wrapper: Wrapper });
    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('renderiza children em <Text>', () => {
    render(<Tag>Filtro</Tag>, { wrapper: Wrapper });
    expect(screen.getByText('Filtro')).toBeTruthy();
  });

  it('selected expõe accessibilityState.selected=true', () => {
    render(<Tag selected>Ativo</Tag>, { wrapper: Wrapper });
    expect(screen.getByRole('button').props.accessibilityState.selected).toBe(true);
  });

  it('default expõe accessibilityState.selected=false', () => {
    render(<Tag>Inativo</Tag>, { wrapper: Wrapper });
    expect(screen.getByRole('button').props.accessibilityState.selected).toBe(false);
  });

  it('dispara onClick ao pressionar', () => {
    const onClick = jest.fn();
    render(<Tag onClick={onClick}>Press</Tag>, { wrapper: Wrapper });
    fireEvent.press(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('disabled não dispara onClick', () => {
    const onClick = jest.fn();
    render(<Tag disabled onClick={onClick}>X</Tag>, { wrapper: Wrapper });
    fireEvent.press(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button').props.accessibilityState.disabled).toBe(true);
  });

  it('aceita tone="brand" sem quebrar', () => {
    render(<Tag tone="brand" selected>Brand</Tag>, { wrapper: Wrapper });
    expect(screen.getByText('Brand')).toBeTruthy();
  });
});
