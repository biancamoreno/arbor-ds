import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Field } from '../../field';
import { Checkbox } from './checkbox';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

function renderCb(ui: React.ReactElement) {
  return render(ui, { wrapper: Wrapper });
}

describe('Checkbox compound anatomy', () => {
  it('renders Checkbox.Root with children', () => {
    renderCb(
      <Checkbox.Root defaultChecked={false} onChange={() => {}}>
        <Checkbox.Indicator />
        <Checkbox.Label>Accept terms</Checkbox.Label>
      </Checkbox.Root>,
    );
    expect(screen.getByText('Accept terms')).toBeTruthy();
  });

  it('renders unchecked by default', () => {
    renderCb(
      <Checkbox.Root defaultChecked={false} onChange={() => {}}>
        <Checkbox.Indicator data-testid="cb" />
      </Checkbox.Root>,
    );
    expect((screen.getByTestId('cb') as HTMLInputElement).checked).toBe(false);
  });

  it('renders checked when defaultChecked=true', () => {
    renderCb(
      <Checkbox.Root defaultChecked onChange={() => {}}>
        <Checkbox.Indicator data-testid="cb" />
      </Checkbox.Root>,
    );
    expect((screen.getByTestId('cb') as HTMLInputElement).checked).toBe(true);
  });

  it('toggles state on click (uncontrolled)', () => {
    renderCb(
      <Checkbox.Root defaultChecked={false} onChange={() => {}}>
        <Checkbox.Indicator data-testid="cb" />
      </Checkbox.Root>,
    );
    const input = screen.getByTestId('cb') as HTMLInputElement;
    fireEvent.click(input);
    expect(input.checked).toBe(true);
  });

  it('calls onChange when toggled', () => {
    const onChange = jest.fn();
    renderCb(
      <Checkbox.Root defaultChecked={false} onChange={onChange}>
        <Checkbox.Indicator data-testid="cb" />
      </Checkbox.Root>,
    );
    fireEvent.click(screen.getByTestId('cb'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('respects controlled checked prop', () => {
    renderCb(
      <Checkbox.Root checked onChange={() => {}}>
        <Checkbox.Indicator data-testid="cb" />
      </Checkbox.Root>,
    );
    expect((screen.getByTestId('cb') as HTMLInputElement).checked).toBe(true);
  });

  it('renders as disabled when disabled=true', () => {
    renderCb(
      <Checkbox.Root defaultChecked={false} onChange={() => {}} disabled>
        <Checkbox.Indicator data-testid="cb" />
      </Checkbox.Root>,
    );
    expect((screen.getByTestId('cb') as HTMLInputElement).disabled).toBe(true);
  });

  it('does not toggle when disabled', () => {
    const onChange = jest.fn();
    renderCb(
      <Checkbox.Root defaultChecked={false} onChange={onChange} disabled>
        <Checkbox.Indicator data-testid="cb" />
      </Checkbox.Root>,
    );
    fireEvent.click(screen.getByTestId('cb'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('sets indeterminate on native input', () => {
    renderCb(
      <Checkbox.Root defaultChecked={false} onChange={() => {}} indeterminate>
        <Checkbox.Indicator data-testid="cb" />
      </Checkbox.Root>,
    );
    expect((screen.getByTestId('cb') as HTMLInputElement).indeterminate).toBe(true);
  });

  it('Checkbox.Indicator has type="checkbox"', () => {
    renderCb(
      <Checkbox.Root defaultChecked={false} onChange={() => {}}>
        <Checkbox.Indicator data-testid="cb" />
      </Checkbox.Root>,
    );
    expect(screen.getByTestId('cb').getAttribute('type')).toBe('checkbox');
  });

  it('Checkbox.Label renders children', () => {
    renderCb(
      <Checkbox.Root defaultChecked={false} onChange={() => {}}>
        <Checkbox.Indicator />
        <Checkbox.Label>My label</Checkbox.Label>
      </Checkbox.Root>,
    );
    expect(screen.getByText('My label')).toBeTruthy();
  });

  it('Checkbox.Description renders children', () => {
    renderCb(
      <Checkbox.Root defaultChecked={false} onChange={() => {}}>
        <Checkbox.Indicator />
        <Checkbox.Description>Extra info</Checkbox.Description>
      </Checkbox.Root>,
    );
    expect(screen.getByText('Extra info')).toBeTruthy();
  });
});

describe('Checkbox FieldContext integration', () => {
  it('receives aria-describedby from Field context', () => {
    renderCb(
      <Field id="cb-field">
        <Field.Control>
          <Checkbox.Root defaultChecked={false} onChange={() => {}}>
            <Checkbox.Indicator data-testid="cb" />
          </Checkbox.Root>
        </Field.Control>
        <Field.Description>Helper</Field.Description>
      </Field>,
    );
    expect(screen.getByTestId('cb').getAttribute('aria-describedby')).toBe('cb-field-description');
  });

  it('receives aria-invalid from Field context', () => {
    renderCb(
      <Field id="cb-field" invalid>
        <Field.Control>
          <Checkbox.Root defaultChecked={false} onChange={() => {}}>
            <Checkbox.Indicator data-testid="cb" />
          </Checkbox.Root>
        </Field.Control>
      </Field>,
    );
    expect(screen.getByTestId('cb').getAttribute('aria-invalid')).toBe('true');
  });

  it('receives disabled from Field context', () => {
    renderCb(
      <Field id="cb-field" disabled>
        <Checkbox.Root defaultChecked={false} onChange={() => {}}>
          <Checkbox.Indicator data-testid="cb" />
        </Checkbox.Root>
      </Field>,
    );
    expect((screen.getByTestId('cb') as HTMLInputElement).disabled).toBe(true);
  });

  it('receives aria-required from Field context', () => {
    renderCb(
      <Field id="cb-field" required>
        <Field.Control>
          <Checkbox.Root defaultChecked={false} onChange={() => {}}>
            <Checkbox.Indicator data-testid="cb" />
          </Checkbox.Root>
        </Field.Control>
      </Field>,
    );
    expect(screen.getByTestId('cb').getAttribute('aria-required')).toBe('true');
  });
});

describe('Checkbox legacy API', () => {
  it('renders label prop', () => {
    renderCb(<Checkbox label="Legacy label" onChange={() => {}} />);
    expect(screen.getByText('Legacy label')).toBeTruthy();
  });

  it('renders description prop', () => {
    renderCb(<Checkbox label="L" description="Legacy desc" onChange={() => {}} />);
    expect(screen.getByText('Legacy desc')).toBeTruthy();
  });

  it('renders checked state via checked prop', () => {
    renderCb(<Checkbox checked onChange={() => {}} data-testid="legacy-cb" />);
    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(true);
  });
});
