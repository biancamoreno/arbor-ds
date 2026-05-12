import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Checkbox } from './checkbox';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

describe('Checkbox (native)', () => {
  it('exposes accessibilityRole="checkbox"', () => {
    render(
      <Checkbox aria-label="agree">
        <Checkbox.Indicator />
      </Checkbox>,
      { wrapper: Wrapper },
    );
    expect(screen.getByRole('checkbox')).toBeTruthy();
  });

  it('reflects defaultChecked in accessibilityState', () => {
    render(
      <Checkbox defaultChecked aria-label="agree">
        <Checkbox.Indicator />
      </Checkbox>,
      { wrapper: Wrapper },
    );
    expect(screen.getByRole('checkbox').props.accessibilityState.checked).toBe(true);
  });

  it('fires onCheckedChange when pressed', () => {
    const onCheckedChange = jest.fn();
    render(
      <Checkbox aria-label="agree" onCheckedChange={onCheckedChange}>
        <Checkbox.Indicator />
      </Checkbox>,
      { wrapper: Wrapper },
    );
    fireEvent.press(screen.getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('does not fire onCheckedChange when disabled', () => {
    const onCheckedChange = jest.fn();
    render(
      <Checkbox aria-label="agree" disabled onCheckedChange={onCheckedChange}>
        <Checkbox.Indicator />
      </Checkbox>,
      { wrapper: Wrapper },
    );
    fireEvent.press(screen.getByRole('checkbox'));
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(screen.getByRole('checkbox').props.accessibilityState.disabled).toBe(true);
  });

  it('honors a controlled checked prop', () => {
    render(
      <Checkbox checked aria-label="agree" onCheckedChange={() => {}}>
        <Checkbox.Indicator />
      </Checkbox>,
      { wrapper: Wrapper },
    );
    expect(screen.getByRole('checkbox').props.accessibilityState.checked).toBe(true);
  });

  it('reflects indeterminate as accessibilityState.checked="mixed"', () => {
    render(
      <Checkbox aria-label="agree" indeterminate onCheckedChange={() => {}}>
        <Checkbox.Indicator />
      </Checkbox>,
      { wrapper: Wrapper },
    );
    expect(screen.getByRole('checkbox').props.accessibilityState.checked).toBe('mixed');
  });
});
