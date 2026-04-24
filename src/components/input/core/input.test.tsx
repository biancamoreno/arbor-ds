import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Field } from '../../field';
import { TextInput } from './textinput';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

function renderInput(ui: React.ReactElement) {
  return render(ui, { wrapper: Wrapper });
}

describe('TextInput standalone', () => {
  it('renders an input element', () => {
    renderInput(<TextInput />);
    expect(screen.getByRole('textbox')).toBeTruthy();
  });

  it('renders with placeholder', () => {
    renderInput(<TextInput placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('renders label when provided', () => {
    renderInput(<TextInput label="Full name" />);
    expect(screen.getByText('Full name')).toBeTruthy();
  });

  it('renders error message when provided', () => {
    renderInput(<TextInput error="Required field" />);
    expect(screen.getByText('Required field')).toBeTruthy();
  });

  it('renders helperText when provided', () => {
    renderInput(<TextInput helperText="Max 100 chars" />);
    expect(screen.getByText('Max 100 chars')).toBeTruthy();
  });

  it('calls onChange on input change', () => {
    const onChange = jest.fn();
    renderInput(<TextInput onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('calls onValueChange with the new value', () => {
    const onValueChange = jest.fn();
    renderInput(<TextInput onValueChange={onValueChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'world' } });
    expect(onValueChange).toHaveBeenCalledWith('world');
  });

  it('is disabled when disabled=true', () => {
    renderInput(<TextInput disabled />);
    expect((screen.getByRole('textbox') as HTMLInputElement).disabled).toBe(true);
  });

  it('shows clearable button when clearable=true and value is set', () => {
    renderInput(<TextInput clearable value="abc" onChange={() => {}} />);
    expect(screen.getByLabelText('Limpar')).toBeTruthy();
  });

  it('clears value when clear button clicked', () => {
    const onChange = jest.fn();
    const onValueChange = jest.fn();
    renderInput(<TextInput clearable value="abc" onChange={onChange} onValueChange={onValueChange} />);
    fireEvent.click(screen.getByLabelText('Limpar'));
    expect(onValueChange).toHaveBeenCalledWith('');
  });

  it('does not show clearable button when no value', () => {
    renderInput(<TextInput clearable value="" onChange={() => {}} />);
    expect(screen.queryByLabelText('Limpar')).toBeNull();
  });

  it('renders leftIcon when provided', () => {
    renderInput(<TextInput leftIcon={<span data-testid="left-icon">@</span>} />);
    expect(screen.getByTestId('left-icon')).toBeTruthy();
  });

  it('renders rightIcon when provided', () => {
    renderInput(<TextInput rightIcon={<span data-testid="right-icon">✓</span>} />);
    expect(screen.getByTestId('right-icon')).toBeTruthy();
  });

  it('renders with size sm', () => {
    renderInput(<TextInput size="sm" />);
    expect(screen.getByRole('textbox')).toBeTruthy();
  });

  it('renders with size md (default)', () => {
    renderInput(<TextInput />);
    expect(screen.getByRole('textbox')).toBeTruthy();
  });

  it('renders with size lg', () => {
    renderInput(<TextInput size="lg" />);
    expect(screen.getByRole('textbox')).toBeTruthy();
  });

  it('renders with filled variant', () => {
    renderInput(<TextInput variant="filled" />);
    expect(screen.getByRole('textbox')).toBeTruthy();
  });

  it('forwards ref to input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    renderInput(<TextInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});

describe('TextInput FieldContext integration', () => {
  it('picks up id from Field context', () => {
    renderInput(
      <Field id="name-field">
        <Field.Control>
          <TextInput />
        </Field.Control>
      </Field>,
    );
    expect(screen.getByRole('textbox').getAttribute('id')).toBe('name-field');
  });

  it('picks up aria-describedby from Field when Field.Description is present', () => {
    renderInput(
      <Field id="name-field">
        <Field.Control>
          <TextInput />
        </Field.Control>
        <Field.Description>Enter your name</Field.Description>
      </Field>,
    );
    expect(screen.getByRole('textbox').getAttribute('aria-describedby')).toBe('name-field-description');
  });

  it('does NOT set aria-describedby when Field.Description is absent', () => {
    renderInput(
      <Field id="name-field">
        <Field.Control>
          <TextInput />
        </Field.Control>
      </Field>,
    );
    expect(screen.getByRole('textbox').getAttribute('aria-describedby')).toBeNull();
  });

  it('picks up aria-invalid from Field', () => {
    renderInput(
      <Field id="name-field" invalid>
        <Field.Control>
          <TextInput />
        </Field.Control>
      </Field>,
    );
    expect(screen.getByRole('textbox').getAttribute('aria-invalid')).toBe('true');
  });

  it('picks up aria-errormessage from Field when invalid AND Field.Error exists', () => {
    renderInput(
      <Field id="name-field" invalid>
        <Field.Control>
          <TextInput />
        </Field.Control>
        <Field.Error>Field is required</Field.Error>
      </Field>,
    );
    expect(screen.getByRole('textbox').getAttribute('aria-errormessage')).toBe('name-field-error');
  });

  it('picks up disabled from FieldContext', () => {
    renderInput(
      <Field id="name-field" disabled>
        <Field.Control>
          <TextInput />
        </Field.Control>
      </Field>,
    );
    expect((screen.getByRole('textbox') as HTMLInputElement).disabled).toBe(true);
  });

  it('picks up aria-required from Field', () => {
    renderInput(
      <Field id="name-field" required>
        <Field.Control>
          <TextInput />
        </Field.Control>
      </Field>,
    );
    expect(screen.getByRole('textbox').getAttribute('aria-required')).toBe('true');
  });

  it('works WITHOUT Field.Control wrapper (Field-aware consumes context directly)', () => {
    renderInput(
      <Field id="direct" invalid required>
        <Field.Error>err</Field.Error>
        <TextInput />
      </Field>,
    );
    const input = screen.getByRole('textbox');
    expect(input.getAttribute('id')).toBe('direct');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-required')).toBe('true');
    expect(input.getAttribute('aria-errormessage')).toBe('direct-error');
  });

  it('does not render FieldShell label when inside Field context', () => {
    renderInput(
      <Field id="name-field">
        <Field.Label>From context</Field.Label>
        <Field.Control>
          <TextInput label="This should not appear" />
        </Field.Control>
      </Field>,
    );
    expect(screen.queryByText('This should not appear')).toBeNull();
    expect(screen.getByText('From context')).toBeTruthy();
  });
});
