import React from 'react';
import { TextInput } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Field } from './field';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

function renderField(ui: React.ReactElement) {
  return render(ui, { wrapper: Wrapper });
}

describe('Field.Root (native)', () => {
  it('renders children', () => {
    renderField(
      <Field>
        <Field.Label>Email</Field.Label>
      </Field>,
    );
    expect(screen.getByText('Email')).toBeTruthy();
  });
});

describe('Field.Label (native)', () => {
  it('renders the label text', () => {
    renderField(
      <Field id="f1">
        <Field.Label>Nome</Field.Label>
      </Field>,
    );
    expect(screen.getByText('Nome')).toBeTruthy();
  });

  it('appends a "*" indicator when the field is required', () => {
    renderField(
      <Field id="f1" required>
        <Field.Label>Nome</Field.Label>
      </Field>,
    );
    expect(screen.getByText(/\*/)).toBeTruthy();
  });

  it('does not append "*" when the field is not required', () => {
    renderField(
      <Field id="f1">
        <Field.Label>Nome</Field.Label>
      </Field>,
    );
    expect(screen.queryByText(/\*/)).toBeNull();
  });

  it('exposes nativeID matching the labelId derived from fieldId', () => {
    renderField(
      <Field id="f1">
        <Field.Label>Nome</Field.Label>
      </Field>,
    );
    expect(screen.getByText('Nome').props.nativeID).toBe('f1-label');
  });
});

describe('Field.Description (native)', () => {
  it('renders children with nativeID matching descriptionId', () => {
    renderField(
      <Field id="fd">
        <Field.Description>Helper</Field.Description>
      </Field>,
    );
    const node = screen.getByText('Helper');
    expect(node.props.nativeID).toBe('fd-description');
  });
});

describe('Field.Error (native)', () => {
  it('does not render when invalid is false', () => {
    renderField(
      <Field id="fe">
        <Field.Error>Oops</Field.Error>
      </Field>,
    );
    expect(screen.queryByText('Oops')).toBeNull();
  });

  it('renders with accessibilityRole="alert" and nativeID errorId when invalid', () => {
    renderField(
      <Field id="fe" invalid>
        <Field.Error>Oops</Field.Error>
      </Field>,
    );
    const node = screen.getByText('Oops');
    expect(node.props.accessibilityRole).toBe('alert');
    expect(node.props.nativeID).toBe('fe-error');
  });
});

describe('Field.Control parity wiring (native, TD-009)', () => {
  it('injects nativeID matching fieldId on its child', () => {
    renderField(
      <Field id="fc">
        <Field.Control>
          <TextInput testID="ctrl" />
        </Field.Control>
      </Field>,
    );
    expect(screen.getByTestId('ctrl').props.nativeID).toBe('fc');
  });

  it('connects Label to Control via accessibilityLabelledBy', () => {
    renderField(
      <Field id="fc">
        <Field.Label>Nome</Field.Label>
        <Field.Control>
          <TextInput testID="ctrl" />
        </Field.Control>
      </Field>,
    );
    expect(screen.getByTestId('ctrl').props.accessibilityLabelledBy).toBe('fc-label');
  });

  it('injects accessibilityState.disabled and editable=false when disabled', () => {
    renderField(
      <Field id="fc" disabled>
        <Field.Control>
          <TextInput testID="ctrl" />
        </Field.Control>
      </Field>,
    );
    const ctrl = screen.getByTestId('ctrl');
    expect(ctrl.props.accessibilityState).toEqual({ disabled: true });
    expect(ctrl.props.editable).toBe(false);
  });

  it('wires accessibilityDescribedBy when description is registered', () => {
    renderField(
      <Field id="fc">
        <Field.Description>Helper</Field.Description>
        <Field.Control>
          <TextInput testID="ctrl" />
        </Field.Control>
      </Field>,
    );
    expect(screen.getByTestId('ctrl').props['aria-describedby']).toBe('fc-description');
  });
});
