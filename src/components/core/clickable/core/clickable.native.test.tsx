import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ArborProvider } from '../../../../ecosystem';
import { themeLight } from '../../../../foundations';
import { Text } from '../../text';
import { Clickable } from './clickable';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

describe('Clickable (native)', () => {
  it('renders children inside a pressable container', () => {
    render(<Clickable testID="cb"><Text>child</Text></Clickable>, { wrapper });
    expect(screen.getByTestId('cb')).toBeTruthy();
    expect(screen.getByText('child')).toBeTruthy();
  });

  it('default accessibilityRole is "button"', () => {
    render(<Clickable testID="cb">x</Clickable>, { wrapper });
    expect(screen.getByTestId('cb').props.accessibilityRole).toBe('button');
  });

  it('maps `role` to `accessibilityRole`', () => {
    render(<Clickable testID="cb" role="link">x</Clickable>, { wrapper });
    expect(screen.getByTestId('cb').props.accessibilityRole).toBe('link');
  });

  it('maps `aria-label` to `accessibilityLabel`', () => {
    render(<Clickable testID="cb" aria-label="action">x</Clickable>, { wrapper });
    expect(screen.getByTestId('cb').props.accessibilityLabel).toBe('action');
  });

  it('fires onClick on press', () => {
    const handler = jest.fn();
    render(<Clickable testID="cb" onClick={handler}>x</Clickable>, { wrapper });
    fireEvent.press(screen.getByTestId('cb'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick when disabled', () => {
    const handler = jest.fn();
    render(<Clickable testID="cb" onClick={handler} disabled>x</Clickable>, { wrapper });
    fireEvent.press(screen.getByTestId('cb'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('reflects disabled in accessibilityState', () => {
    render(<Clickable testID="cb" disabled>x</Clickable>, { wrapper });
    expect(screen.getByTestId('cb').props.accessibilityState.disabled).toBe(true);
  });

  it('explicit accessibilityRole takes precedence over role', () => {
    render(
      <Clickable
        testID="cb"
        role="link"
        {...({ accessibilityRole: 'tab' } as { accessibilityRole: 'tab' })}
      >
        x
      </Clickable>,
      { wrapper },
    );
    expect(screen.getByTestId('cb').props.accessibilityRole).toBe('tab');
  });

  it('merges custom accessibilityState with disabled', () => {
    render(
      <Clickable
        testID="cb"
        disabled
        {...({ accessibilityState: { selected: true } } as { accessibilityState: { selected: true } })}
      >
        x
      </Clickable>,
      { wrapper },
    );
    const state = screen.getByTestId('cb').props.accessibilityState;
    expect(state.selected).toBe(true);
    expect(state.disabled).toBe(true);
  });
});
