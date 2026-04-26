import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Field } from '../../field';
import { Select } from './select';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

function BasicSelect(props: {
  value?: string;
  onValueChange?: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <Select
      defaultValue=""
      value={props.value}
      onValueChange={props.onValueChange}
      disabled={props.disabled}
    >
      <Select.Trigger>
        <Select.Value placeholder="Pick one" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
        <Select.Item value="cherry" disabled>
          Cherry
        </Select.Item>
      </Select.Content>
    </Select>
  );
}

describe('Select (native)', () => {
  it('exposes accessibilityRole="combobox" on the trigger', () => {
    render(<BasicSelect />, { wrapper: Wrapper });
    expect(screen.getByRole('combobox')).toBeTruthy();
  });

  it('shows placeholder when no value selected', () => {
    render(<BasicSelect />, { wrapper: Wrapper });
    expect(screen.getByText('Pick one')).toBeTruthy();
  });

  it('starts with accessibilityState.expanded=false', () => {
    render(<BasicSelect />, { wrapper: Wrapper });
    expect(screen.getByRole('combobox').props.accessibilityState.expanded).toBe(false);
  });

  it('opens on trigger press (expanded=true)', () => {
    render(<BasicSelect />, { wrapper: Wrapper });
    fireEvent.press(screen.getByRole('combobox'));
    expect(screen.getByRole('combobox').props.accessibilityState.expanded).toBe(true);
  });

  it('renders items when open', () => {
    render(<BasicSelect />, { wrapper: Wrapper });
    fireEvent.press(screen.getByRole('combobox'));
    expect(screen.getByText('Apple')).toBeTruthy();
    expect(screen.getByText('Banana')).toBeTruthy();
  });

  it('selects item and closes on press', () => {
    const onValueChange = jest.fn();
    render(<BasicSelect onValueChange={onValueChange} />, { wrapper: Wrapper });
    fireEvent.press(screen.getByRole('combobox'));
    fireEvent.press(screen.getByText('Apple'));
    expect(onValueChange).toHaveBeenCalledWith('apple');
    expect(screen.getByRole('combobox').props.accessibilityState.expanded).toBe(false);
  });

  it('shows selected value after selection', () => {
    render(<BasicSelect />, { wrapper: Wrapper });
    fireEvent.press(screen.getByRole('combobox'));
    fireEvent.press(screen.getByText('Banana'));
    expect(screen.getByText('banana')).toBeTruthy();
  });

  it('disabled trigger does not open', () => {
    render(<BasicSelect disabled />, { wrapper: Wrapper });
    fireEvent.press(screen.getByRole('combobox'));
    expect(screen.getByRole('combobox').props.accessibilityState.expanded).toBe(false);
  });

  it('disabled item does not call onValueChange', () => {
    const onValueChange = jest.fn();
    render(<BasicSelect onValueChange={onValueChange} />, { wrapper: Wrapper });
    fireEvent.press(screen.getByRole('combobox'));
    fireEvent.press(screen.getByText('Cherry'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('marks selected item with accessibilityState.selected', () => {
    render(<BasicSelect />, { wrapper: Wrapper });
    fireEvent.press(screen.getByRole('combobox'));
    fireEvent.press(screen.getByText('Apple'));
    fireEvent.press(screen.getByRole('combobox'));
    const items = screen.getAllByRole('menuitem');
    const apple = items.find(item => item.props.accessibilityState?.selected === true);
    expect(apple).toBeDefined();
  });
});

describe('Select FieldContext integration (native)', () => {
  it('inherits disabled from FieldContext', () => {
    render(
      <Field id="sf" disabled>
        <BasicSelect />
      </Field>,
      { wrapper: Wrapper },
    );
    expect(screen.getByRole('combobox').props.accessibilityState.disabled).toBe(true);
  });

  it('connects Label to trigger via accessibilityLabelledBy', () => {
    render(
      <Field id="sf">
        <Field.Label>Fruit</Field.Label>
        <BasicSelect />
      </Field>,
      { wrapper: Wrapper },
    );
    expect(screen.getByRole('combobox').props.accessibilityLabelledBy).toBe('sf-label');
  });

  it('uses Field fieldId as nativeID on the trigger', () => {
    render(
      <Field id="sf">
        <BasicSelect />
      </Field>,
      { wrapper: Wrapper },
    );
    expect(screen.getByRole('combobox').props.nativeID).toBe('sf');
  });
});
