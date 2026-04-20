import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Field } from '../../field';
import { Select } from './select';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

function renderSelect(ui: React.ReactElement) {
  return render(ui, { wrapper: Wrapper });
}

function BasicSelect({ value, onValueChange, disabled }: { value?: string; onValueChange?: (v: string) => void; disabled?: boolean }) {
  return (
    <Select defaultValue="" onValueChange={onValueChange} disabled={disabled} value={value}>
      <Select.Trigger>
        <Select.Value placeholder="Pick one" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
        <Select.Item value="cherry" disabled>Cherry (disabled)</Select.Item>
      </Select.Content>
    </Select>
  );
}

describe('Select.Root', () => {
  it('renders the trigger', () => {
    renderSelect(<BasicSelect />);
    expect(screen.getByRole('combobox')).toBeTruthy();
  });

  it('shows placeholder when no value selected', () => {
    renderSelect(<BasicSelect />);
    expect(screen.getByText('Pick one')).toBeTruthy();
  });

  it('content is hidden by default', () => {
    renderSelect(<BasicSelect />);
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('opens content on trigger click', () => {
    renderSelect(<BasicSelect />);
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeTruthy();
  });

  it('shows items when open', () => {
    renderSelect(<BasicSelect />);
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByText('Apple')).toBeTruthy();
    expect(screen.getByText('Banana')).toBeTruthy();
  });

  it('closes on item selection', () => {
    renderSelect(<BasicSelect />);
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Apple'));
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('calls onValueChange with selected value', () => {
    const onValueChange = jest.fn();
    renderSelect(<BasicSelect onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Apple'));
    expect(onValueChange).toHaveBeenCalledWith('apple');
  });

  it('shows selected value after selection', () => {
    renderSelect(<BasicSelect />);
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Banana'));
    expect(screen.getByText('banana')).toBeTruthy();
  });

  it('closes on Escape key', () => {
    renderSelect(<BasicSelect />);
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeTruthy();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('toggles open/close on trigger click', () => {
    renderSelect(<BasicSelect />);
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeTruthy();
    fireEvent.click(trigger);
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('is disabled when disabled=true', () => {
    renderSelect(<BasicSelect disabled />);
    expect((screen.getByRole('combobox') as HTMLButtonElement).disabled).toBe(true);
  });

  it('does not open when disabled', () => {
    renderSelect(<BasicSelect disabled />);
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.queryByRole('listbox')).toBeNull();
  });
});

describe('Select.Item', () => {
  it('renders items with role="option"', () => {
    renderSelect(<BasicSelect />);
    fireEvent.click(screen.getByRole('combobox'));
    const options = screen.getAllByRole('option');
    expect(options.length).toBe(3);
  });

  it('disabled item has aria-disabled', () => {
    renderSelect(<BasicSelect />);
    fireEvent.click(screen.getByRole('combobox'));
    const disabledItem = screen.getByText('Cherry (disabled)').closest('[role="option"]');
    expect(disabledItem?.getAttribute('aria-disabled')).toBe('true');
  });

  it('does not call onValueChange for disabled item', () => {
    const onValueChange = jest.fn();
    renderSelect(<BasicSelect onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Cherry (disabled)'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('selected item has aria-selected', () => {
    renderSelect(<BasicSelect />);
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Apple'));
    fireEvent.click(screen.getByRole('combobox'));
    const appleOption = screen.getByText('Apple').closest('[role="option"]');
    expect(appleOption?.getAttribute('aria-selected')).toBe('true');
  });
});

describe('Select trigger a11y', () => {
  it('has role="combobox"', () => {
    renderSelect(<BasicSelect />);
    expect(screen.getByRole('combobox')).toBeTruthy();
  });

  it('has aria-expanded=false when closed', () => {
    renderSelect(<BasicSelect />);
    expect(screen.getByRole('combobox').getAttribute('aria-expanded')).toBe('false');
  });

  it('has aria-expanded=true when open', () => {
    renderSelect(<BasicSelect />);
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('combobox').getAttribute('aria-expanded')).toBe('true');
  });

  it('has aria-haspopup="listbox"', () => {
    renderSelect(<BasicSelect />);
    expect(screen.getByRole('combobox').getAttribute('aria-haspopup')).toBe('listbox');
  });
});

describe('Select FieldContext integration', () => {
  it('picks up aria-describedby from Field', () => {
    renderSelect(
      <Field id="sel-field">
        <Field.Control>
          <BasicSelect />
        </Field.Control>
        <Field.Description>Choose wisely</Field.Description>
      </Field>,
    );
    expect(screen.getByRole('combobox').getAttribute('aria-describedby')).toBe('sel-field-description');
  });

  it('picks up aria-invalid from Field', () => {
    renderSelect(
      <Field id="sel-field" isInvalid>
        <Field.Control>
          <BasicSelect />
        </Field.Control>
      </Field>,
    );
    expect(screen.getByRole('combobox').getAttribute('aria-invalid')).toBe('true');
  });

  it('picks up disabled from FieldContext', () => {
    renderSelect(
      <Field id="sel-field" isDisabled>
        <BasicSelect />
      </Field>,
    );
    expect((screen.getByRole('combobox') as HTMLButtonElement).disabled).toBe(true);
  });
});
