import React from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ArborProvider } from '../../../ecosystem';
import { themeLight } from '../../../foundations';
import { Counter } from './counter';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

describe('Counter (native)', () => {
  it('renders the value', () => {
    render(<Counter value={3} showInput={false} />, { wrapper });
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('increments via the "+" button', () => {
    const handler = jest.fn();
    render(<Counter value={2} onValueChange={handler} showInput={false} />, { wrapper });
    fireEvent.press(screen.getByLabelText('Incrementar'));
    expect(handler).toHaveBeenCalledWith(3);
  });

  it('decrements via the "−" button', () => {
    const handler = jest.fn();
    render(<Counter value={5} onValueChange={handler} showInput={false} />, { wrapper });
    fireEvent.press(screen.getByLabelText('Decrementar'));
    expect(handler).toHaveBeenCalledWith(4);
  });

  it('respects min', () => {
    const handler = jest.fn();
    render(<Counter value={0} min={0} onValueChange={handler} showInput={false} />, { wrapper });
    fireEvent.press(screen.getByLabelText('Decrementar'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('respects max', () => {
    const handler = jest.fn();
    render(<Counter value={10} max={10} onValueChange={handler} showInput={false} />, { wrapper });
    fireEvent.press(screen.getByLabelText('Incrementar'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('uses TextInput with numeric keyboard when showInput is true (default)', () => {
    render(<Counter value={4} />, { wrapper });
    const inputs = screen.UNSAFE_getAllByType(RNTextInput);
    expect(inputs[0].props.keyboardType).toBe('numeric');
  });
});
