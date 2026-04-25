import React from 'react';
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

// TD-009 — divergência arquitetural conhecida.
// Estes casos descrevem o contrato esperado para paridade com a versão web.
// Habilitar (remover .skip) quando TD-009 for resolvido.
describe.skip('Field parity gaps tracked by TD-009 (native)', () => {
  it('Field.Control should inject nativeID matching fieldId on its child (TD-009)', () => {
    // No web, Field.Control injeta `id={fieldId}` no controle via slots/control.
    // Em native, Field.Control hoje é apenas <Box>{children}</Box> — não injeta nada.
  });

  it('Field.Label should expose accessibilityLabelledBy chain to the control (TD-009)', () => {
    // Web wirea via htmlFor + slot Field.Control id.
    // Native ainda não conecta Label ↔ Control via accessibilityLabelledBy.
  });

  it('Field.Control should inject accessibilityState.disabled when disabled (TD-009)', () => {
    // Web injeta `disabled` HTML; o equivalente native seria
    // accessibilityState={{ disabled: true }}.
  });
});
