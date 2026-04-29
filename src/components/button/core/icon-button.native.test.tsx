import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { IconButton } from './icon-button';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

describe('IconButton (native)', () => {
  it('renderiza com accessibilityRole="button"', () => {
    render(
      <IconButton aria-label="Fechar">
        <Text>×</Text>
      </IconButton>,
      { wrapper: Wrapper },
    );
    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('dispara onClick ao pressionar', () => {
    const onClick = jest.fn();
    render(
      <IconButton aria-label="Action" onClick={onClick}>
        <Text>i</Text>
      </IconButton>,
      { wrapper: Wrapper },
    );
    fireEvent.press(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('disabled bloqueia onClick', () => {
    const onClick = jest.fn();
    render(
      <IconButton aria-label="Off" disabled onClick={onClick}>
        <Text>i</Text>
      </IconButton>,
      { wrapper: Wrapper },
    );
    fireEvent.press(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('aceita shape="square" e shape="circle" sem quebrar', () => {
    const { rerender } = render(
      <IconButton aria-label="i" shape="circle">
        <Text>i</Text>
      </IconButton>,
      { wrapper: Wrapper },
    );
    expect(screen.getByRole('button')).toBeTruthy();
    rerender(
      <IconButton aria-label="i" shape="square">
        <Text>i</Text>
      </IconButton>,
    );
    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('aceita sizes sm/md/lg', () => {
    const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];
    sizes.forEach((size) => {
      const { unmount } = render(
        <IconButton aria-label={size} size={size}>
          <Text>i</Text>
        </IconButton>,
        { wrapper: Wrapper },
      );
      expect(screen.getByRole('button')).toBeTruthy();
      unmount();
    });
  });
});
