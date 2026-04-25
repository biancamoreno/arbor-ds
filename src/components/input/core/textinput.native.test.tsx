import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ArborProvider } from '../../../ecosystem';
import { themeLight } from '../../../foundations';
import { Field } from '../../field';
import { TextInput } from './textinput';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

describe('TextInput (native)', () => {
  it('renders a placeholder', () => {
    render(<TextInput placeholder="Email" testID="ti" />, { wrapper });
    expect(screen.getByPlaceholderText('Email')).toBeTruthy();
  });

  it('fires onValueChange with the new text', () => {
    const handler = jest.fn();
    render(<TextInput testID="ti" onValueChange={handler} />, { wrapper });
    fireEvent.changeText(screen.getByTestId('ti'), 'hello');
    expect(handler).toHaveBeenCalledWith('hello');
  });

  it('fires onChange with a synthetic event when provided', () => {
    const handler = jest.fn();
    render(<TextInput testID="ti" onChange={handler} />, { wrapper });
    fireEvent.changeText(screen.getByTestId('ti'), 'abc');
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0].target.value).toBe('abc');
  });

  it('disables editing when disabled', () => {
    render(<TextInput testID="ti" disabled />, { wrapper });
    expect(screen.getByTestId('ti').props.editable).toBe(false);
    expect(screen.getByTestId('ti').props.accessibilityState).toEqual({ disabled: true });
  });

  it('maps type="password" to secureTextEntry', () => {
    render(<TextInput testID="ti" type="password" />, { wrapper });
    expect(screen.getByTestId('ti').props.secureTextEntry).toBe(true);
  });

  it('maps type="email" to keyboardType="email-address"', () => {
    render(<TextInput testID="ti" type="email" />, { wrapper });
    expect(screen.getByTestId('ti').props.keyboardType).toBe('email-address');
  });

  it('maps type="number" to keyboardType="numeric"', () => {
    render(<TextInput testID="ti" type="number" />, { wrapper });
    expect(screen.getByTestId('ti').props.keyboardType).toBe('numeric');
  });

  it('connects with FieldContext: nativeID, accessibilityLabelledBy, accessibilityState', () => {
    render(
      <Field id="ff" disabled>
        <Field.Label>Email</Field.Label>
        <TextInput testID="ti" />
      </Field>,
      { wrapper },
    );
    const input = screen.getByTestId('ti');
    expect(input.props.nativeID).toBe('ff');
    expect(input.props.accessibilityLabelledBy).toBe('ff-label');
    expect(input.props.editable).toBe(false);
    expect(input.props.accessibilityState).toEqual({ disabled: true });
  });

  it('exposes accessibilityDescribedBy when Field.Description is registered', () => {
    render(
      <Field id="ff">
        <TextInput testID="ti" />
        <Field.Description>Helper</Field.Description>
      </Field>,
      { wrapper },
    );
    expect(screen.getByTestId('ti').props['aria-describedby']).toBe('ff-description');
  });
});
