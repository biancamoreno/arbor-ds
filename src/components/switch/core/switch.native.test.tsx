import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Switch as RNSwitch } from 'react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Switch } from './switch';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

describe('Switch (native)', () => {
  it('exposes accessibilityRole="switch" with aria-label on the wrapper', () => {
    render(<Switch aria-label="notifications" />, { wrapper: Wrapper });
    const node = screen.getByLabelText('notifications');
    expect(node.props.accessibilityRole).toBe('switch');
    expect(node.props.accessibilityLabel).toBe('notifications');
  });

  it('reflects defaultChecked in the underlying RNSwitch value', () => {
    render(<Switch aria-label="notifications" defaultChecked />, { wrapper: Wrapper });
    const inner = screen.UNSAFE_getByType(RNSwitch);
    expect(inner.props.value).toBe(true);
  });

  it('fires onCheckedChange when toggled', () => {
    const onCheckedChange = jest.fn();
    render(
      <Switch aria-label="notifications" onCheckedChange={onCheckedChange} />,
      { wrapper: Wrapper },
    );
    fireEvent(screen.UNSAFE_getByType(RNSwitch), 'valueChange', true);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('does not fire onCheckedChange when disabled', () => {
    const onCheckedChange = jest.fn();
    render(
      <Switch aria-label="notifications" disabled onCheckedChange={onCheckedChange} />,
      { wrapper: Wrapper },
    );
    fireEvent(screen.UNSAFE_getByType(RNSwitch), 'valueChange', true);
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(screen.getByLabelText('notifications').props.accessibilityState.disabled).toBe(true);
  });
});
