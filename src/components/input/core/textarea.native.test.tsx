import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ArborProvider } from '../../../ecosystem';
import { themeLight } from '../../../foundations';
import { Field } from '../../field';
import { TextArea } from './textarea';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

describe('TextArea (native)', () => {
  it('renders multiline TextInput with the requested numberOfLines', () => {
    render(<TextArea testID="ta" rows={6} />, { wrapper });
    const node = screen.getByTestId('ta');
    expect(node.props.multiline).toBe(true);
    expect(node.props.numberOfLines).toBe(6);
  });

  it('fires onValueChange on change text', () => {
    const handler = jest.fn();
    render(<TextArea testID="ta" onValueChange={handler} />, { wrapper });
    fireEvent.changeText(screen.getByTestId('ta'), 'hello');
    expect(handler).toHaveBeenCalledWith('hello');
  });

  it('forwards maxLength', () => {
    render(<TextArea testID="ta" maxLength={120} />, { wrapper });
    expect(screen.getByTestId('ta').props.maxLength).toBe(120);
  });

  it('shows character counter when showCharCount and maxLength are provided', () => {
    render(<TextArea testID="ta" value="abc" maxLength={10} showCharCount />, { wrapper });
    expect(screen.getByText('3 / 10')).toBeTruthy();
  });

  it('disables editing when disabled', () => {
    render(<TextArea testID="ta" disabled />, { wrapper });
    expect(screen.getByTestId('ta').props.editable).toBe(false);
  });

  it('integrates with Field: nativeID + accessibilityLabelledBy', () => {
    render(
      <Field id="ta-field">
        <Field.Label>Bio</Field.Label>
        <TextArea testID="ta" />
      </Field>,
      { wrapper },
    );
    const node = screen.getByTestId('ta');
    expect(node.props.nativeID).toBe('ta-field');
    expect(node.props.accessibilityLabelledBy).toBe('ta-field-label');
  });
});
