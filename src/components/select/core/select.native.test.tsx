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
  defaultValue?: string;
}) {
  return (
    <Select
      defaultValue={props.defaultValue ?? ''}
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

  it('shows display-text (not raw value) after selection', () => {
    render(<BasicSelect />, { wrapper: Wrapper });
    fireEvent.press(screen.getByRole('combobox'));
    fireEvent.press(screen.getByText('Banana'));
    // SelectValue mostra "Banana" (display-text), não "banana" (value).
    expect(screen.getByText('Banana')).toBeTruthy();
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

  it('items expose accessibilityRole="radio"', () => {
    render(<BasicSelect />, { wrapper: Wrapper });
    fireEvent.press(screen.getByRole('combobox'));
    const items = screen.getAllByRole('radio');
    expect(items.length).toBe(3);
  });

  it('marks selected item with accessibilityState.selected', () => {
    render(<BasicSelect defaultValue="apple" />, { wrapper: Wrapper });
    fireEvent.press(screen.getByRole('combobox'));
    const items = screen.getAllByRole('radio');
    const apple = items.find(item => item.props.accessibilityState?.selected === true);
    expect(apple).toBeDefined();
  });
});

describe('Select item registry (native, W1)', () => {
  it('exposes display-text via SelectValue when value preset and listbox closed', () => {
    render(<BasicSelect defaultValue="banana" />, { wrapper: Wrapper });
    // Listbox fechado. O display-text precisa estar disponível mesmo sem ter aberto.
    expect(screen.getByText('Banana')).toBeTruthy();
  });

  it('explicit displayText prop overrides extracted text', () => {
    render(
      <Select defaultValue="card">
        <Select.Trigger>
          <Select.Value placeholder="x" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="card" displayText="Cartão de crédito">
            Cartão de crédito (raw)
          </Select.Item>
        </Select.Content>
      </Select>,
      { wrapper: Wrapper },
    );
    expect(screen.getByText('Cartão de crédito')).toBeTruthy();
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
