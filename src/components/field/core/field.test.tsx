import React from 'react';
import { render, screen } from '@testing-library/react';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Field } from './field';
import { markFieldAware } from '../utils/is-field-aware';
import { useFieldContext } from '../context/field-context';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

function renderField(ui: React.ReactElement) {
  return render(ui, { wrapper: Wrapper });
}

describe('Field.Root', () => {
  it('renders children', () => {
    renderField(<Field>hello</Field>);
    expect(screen.getByText('hello')).toBeTruthy();
  });

  it('auto-generates an id for fieldId when none provided', () => {
    renderField(
      <Field>
        <Field.Label>Name</Field.Label>
        <Field.Control>
          <input data-testid="input" />
        </Field.Control>
      </Field>,
    );
    const label = screen.getByText('Name').closest('label');
    const input = screen.getByTestId('input');
    expect(label?.getAttribute('for')).toBeTruthy();
    expect(input.getAttribute('id')).toBe(label?.getAttribute('for'));
  });

  it('uses provided id', () => {
    renderField(
      <Field id="my-field">
        <Field.Label>Name</Field.Label>
        <Field.Control>
          <input data-testid="input" />
        </Field.Control>
      </Field>,
    );
    const label = screen.getByText('Name').closest('label');
    expect(label?.getAttribute('for')).toBe('my-field');
    expect(screen.getByTestId('input').getAttribute('id')).toBe('my-field');
  });
});

describe('Field.Label', () => {
  it('renders as label element with htmlFor', () => {
    renderField(
      <Field id="f1">
        <Field.Label>Email</Field.Label>
      </Field>,
    );
    const label = screen.getByText('Email').closest('label');
    expect(label).toBeTruthy();
    expect(label?.getAttribute('for')).toBe('f1');
  });

  it('appends * indicator when required', () => {
    renderField(
      <Field id="f1" required>
        <Field.Label>Email</Field.Label>
      </Field>,
    );
    expect(screen.getByText('*', { exact: false })).toBeTruthy();
  });

  it('does not append * when not required', () => {
    renderField(
      <Field id="f1">
        <Field.Label>Email</Field.Label>
      </Field>,
    );
    expect(screen.queryByText('*', { exact: false })).toBeNull();
  });

  it('applies error color style when invalid', () => {
    renderField(
      <Field id="f1" invalid>
        <Field.Label>Email</Field.Label>
      </Field>,
    );
    expect(screen.getByText('Email')).toBeTruthy();
  });
});

describe('Field.Control (RFC-0014)', () => {
  it('injects id prop from context', () => {
    renderField(
      <Field id="ctrl-field">
        <Field.Control>
          <input data-testid="ctrl" />
        </Field.Control>
      </Field>,
    );
    expect(screen.getByTestId('ctrl').getAttribute('id')).toBe('ctrl-field');
  });

  it('does NOT inject aria-describedby when no Field.Description is rendered', () => {
    renderField(
      <Field id="f2">
        <Field.Control>
          <input data-testid="ctrl" />
        </Field.Control>
      </Field>,
    );
    expect(screen.getByTestId('ctrl').getAttribute('aria-describedby')).toBeNull();
  });

  it('injects aria-describedby when Field.Description is rendered', () => {
    renderField(
      <Field id="f2">
        <Field.Description>Helper</Field.Description>
        <Field.Control>
          <input data-testid="ctrl" />
        </Field.Control>
      </Field>,
    );
    expect(screen.getByTestId('ctrl').getAttribute('aria-describedby')).toBe('f2-description');
  });

  it('injects aria-invalid when invalid', () => {
    renderField(
      <Field id="f3" invalid>
        <Field.Control>
          <input data-testid="ctrl" />
        </Field.Control>
      </Field>,
    );
    expect(screen.getByTestId('ctrl').getAttribute('aria-invalid')).toBe('true');
  });

  it('injects aria-errormessage only when invalid AND Field.Error is rendered', () => {
    renderField(
      <Field id="f3" invalid>
        <Field.Error>Oops</Field.Error>
        <Field.Control>
          <input data-testid="ctrl" />
        </Field.Control>
      </Field>,
    );
    expect(screen.getByTestId('ctrl').getAttribute('aria-errormessage')).toBe('f3-error');
  });

  it('does NOT inject aria-errormessage when invalid but no Field.Error exists', () => {
    renderField(
      <Field id="f3-lone" invalid>
        <Field.Control>
          <input data-testid="ctrl" />
        </Field.Control>
      </Field>,
    );
    expect(screen.getByTestId('ctrl').getAttribute('aria-errormessage')).toBeNull();
  });

  it('does not inject aria-invalid when not invalid', () => {
    renderField(
      <Field id="f4">
        <Field.Control>
          <input data-testid="ctrl" />
        </Field.Control>
      </Field>,
    );
    expect(screen.getByTestId('ctrl').getAttribute('aria-invalid')).toBeNull();
  });

  it('injects disabled when disabled', () => {
    renderField(
      <Field id="f5" disabled>
        <Field.Control>
          <input data-testid="ctrl" />
        </Field.Control>
      </Field>,
    );
    expect((screen.getByTestId('ctrl') as HTMLInputElement).disabled).toBe(true);
  });

  it('injects aria-required when required', () => {
    renderField(
      <Field id="f6" required>
        <Field.Control>
          <input data-testid="ctrl" />
        </Field.Control>
      </Field>,
    );
    expect(screen.getByTestId('ctrl').getAttribute('aria-required')).toBe('true');
  });

  it('renders children as-is when no context', () => {
    render(
      <Wrapper>
        <Field.Control>
          <input data-testid="standalone" />
        </Field.Control>
      </Wrapper>,
    );
    expect(screen.getByTestId('standalone')).toBeTruthy();
  });

  it('does NOT inject anything when child is Field-aware (marker present)', () => {
    function FieldAwareInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
      const ctx = useFieldContext();
      return <input data-testid="aware" id={ctx?.fieldId} {...props} />;
    }
    markFieldAware(FieldAwareInput);

    renderField(
      <Field id="aware-field" invalid required>
        <Field.Error>Err</Field.Error>
        <Field.Control>
          <FieldAwareInput data-extra="keep" />
        </Field.Control>
      </Field>,
    );

    const el = screen.getByTestId('aware');
    expect(el.getAttribute('id')).toBe('aware-field');
    expect(el.getAttribute('aria-invalid')).toBeNull();
    expect(el.getAttribute('aria-required')).toBeNull();
    expect(el.getAttribute('aria-errormessage')).toBeNull();
    expect(el.getAttribute('data-extra')).toBe('keep');
  });
});

describe('Field.Description', () => {
  it('renders children', () => {
    renderField(
      <Field id="fd">
        <Field.Description>Helper text</Field.Description>
      </Field>,
    );
    expect(screen.getByText('Helper text')).toBeTruthy();
  });

  it('has id matching descriptionId', () => {
    renderField(
      <Field id="fd">
        <Field.Description>Helper text</Field.Description>
      </Field>,
    );
    const el = screen.getByText('Helper text');
    expect(el.getAttribute('id')).toBe('fd-description');
  });
});

describe('Field.Error', () => {
  it('renders when invalid is true', () => {
    renderField(
      <Field id="fe" invalid>
        <Field.Error>Something went wrong</Field.Error>
      </Field>,
    );
    expect(screen.getByText('Something went wrong')).toBeTruthy();
  });

  it('does not render when invalid is false', () => {
    renderField(
      <Field id="fe">
        <Field.Error>Something went wrong</Field.Error>
      </Field>,
    );
    expect(screen.queryByText('Something went wrong')).toBeNull();
  });

  it('has role="alert"', () => {
    renderField(
      <Field id="fe" invalid>
        <Field.Error>Error!</Field.Error>
      </Field>,
    );
    expect(screen.getByRole('alert')).toBeTruthy();
  });

  it('has id matching errorId', () => {
    renderField(
      <Field id="fe" invalid>
        <Field.Error>Error!</Field.Error>
      </Field>,
    );
    expect(screen.getByRole('alert').getAttribute('id')).toBe('fe-error');
  });

  it('renders outside context without invalid guard', () => {
    render(
      <Wrapper>
        <Field.Error>Orphan error</Field.Error>
      </Wrapper>,
    );
    expect(screen.getByText('Orphan error')).toBeTruthy();
  });
});

describe('Field full composition', () => {
  it('wires label, control, description and error together', () => {
    renderField(
      <Field id="full" invalid required>
        <Field.Label>Email</Field.Label>
        <Field.Control>
          <input data-testid="email-input" type="email" />
        </Field.Control>
        <Field.Description>Enter your email</Field.Description>
        <Field.Error>Email is invalid</Field.Error>
      </Field>,
    );

    const label = screen.getByText('Email').closest('label');
    const input = screen.getByTestId('email-input');
    const description = screen.getByText('Enter your email');
    const error = screen.getByRole('alert');

    expect(label?.getAttribute('for')).toBe('full');
    expect(input.getAttribute('id')).toBe('full');
    expect(input.getAttribute('aria-describedby')).toBe('full-description');
    expect(input.getAttribute('aria-errormessage')).toBe('full-error');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-required')).toBe('true');
    expect(description.getAttribute('id')).toBe('full-description');
    expect(error.getAttribute('id')).toBe('full-error');
  });
});
