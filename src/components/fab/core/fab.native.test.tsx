import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { FloatingActionButton } from './fab';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

describe('FloatingActionButton (native)', () => {
  it('uses label as accessibilityLabel when extended', () => {
    render(
      <FloatingActionButton icon="Plus" label="Novo" onPress={() => {}} />,
      { wrapper: Wrapper },
    );
    expect(screen.getByRole('button').props.accessibilityLabel).toBe('Novo');
  });

  it('falls back to aria-label when label is absent', () => {
    render(
      <FloatingActionButton icon="Plus" aria-label="add" onPress={() => {}} />,
      { wrapper: Wrapper },
    );
    expect(screen.getByRole('button').props.accessibilityLabel).toBe('add');
  });

  it('fires onPress when not disabled', () => {
    const onPress = jest.fn();
    render(
      <FloatingActionButton icon="Plus" aria-label="add" onPress={onPress} />,
      { wrapper: Wrapper },
    );
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not fire onPress when disabled', () => {
    const onPress = jest.fn();
    render(
      <FloatingActionButton icon="Plus" aria-label="add" disabled onPress={onPress} />,
      { wrapper: Wrapper },
    );
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
