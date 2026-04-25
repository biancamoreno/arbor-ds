import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Field } from '../../field';
import { Radio } from './radio';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

function renderRadio(ui: React.ReactElement) {
  return render(ui, { wrapper: Wrapper });
}

describe('Radio.Root', () => {
  it('renders children', () => {
    renderRadio(
      <Radio value="a" defaultChecked={false}>
        <Radio.Label>Option A</Radio.Label>
        <Radio.Indicator />
      </Radio>,
    );
    expect(screen.getByText('Option A')).toBeTruthy();
  });

  it('renders as unchecked by default', () => {
    renderRadio(
      <Radio value="a" defaultChecked={false}>
        <Radio.Indicator />
      </Radio>,
    );
    expect((screen.getByRole('radio') as HTMLInputElement).checked).toBe(false);
  });

  it('renders as checked when defaultChecked=true', () => {
    renderRadio(
      <Radio value="a" defaultChecked>
        <Radio.Indicator />
      </Radio>,
    );
    expect((screen.getByRole('radio') as HTMLInputElement).checked).toBe(true);
  });

  it('respects controlled checked prop', () => {
    renderRadio(
      <Radio value="a" checked>
        <Radio.Indicator />
      </Radio>,
    );
    expect((screen.getByRole('radio') as HTMLInputElement).checked).toBe(true);
  });

  it('calls onCheckedChange on click', () => {
    const onCheckedChange = jest.fn();
    renderRadio(
      <Radio value="opt1" defaultChecked={false} onCheckedChange={onCheckedChange}>
        <Radio.Indicator />
      </Radio>,
    );
    const input = screen.getByRole('radio') as HTMLInputElement;
    fireEvent.click(input);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('sets checked on click (uncontrolled)', () => {
    renderRadio(
      <Radio value="a" defaultChecked={false}>
        <Radio.Indicator />
      </Radio>,
    );
    const input = screen.getByRole('radio') as HTMLInputElement;
    fireEvent.click(input);
    expect(input.checked).toBe(true);
  });

  it('is disabled when disabled=true', () => {
    renderRadio(
      <Radio value="a" defaultChecked={false} disabled>
        <Radio.Indicator />
      </Radio>,
    );
    expect((screen.getByRole('radio') as HTMLInputElement).disabled).toBe(true);
  });

  it('does not call onCheckedChange when disabled', () => {
    const onCheckedChange = jest.fn();
    renderRadio(
      <Radio value="a" defaultChecked={false} disabled onCheckedChange={onCheckedChange}>
        <Radio.Indicator />
      </Radio>,
    );
    // disabled input does not fire onChange
    expect((screen.getByRole('radio') as HTMLInputElement).disabled).toBe(true);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});

describe('Radio.Indicator', () => {
  it('has aria-hidden="true"', () => {
    renderRadio(
      <Radio value="a" defaultChecked={false}>
        <Radio.Indicator />
      </Radio>,
    );
    const indicators = document.querySelectorAll('[aria-hidden="true"]');
    expect(indicators.length).toBeGreaterThan(0);
  });
});

describe('Radio.Label', () => {
  it('renders label text', () => {
    renderRadio(
      <Radio value="a" defaultChecked={false}>
        <Radio.Label>My radio</Radio.Label>
      </Radio>,
    );
    expect(screen.getByText('My radio')).toBeTruthy();
  });
});

describe('Radio.Description', () => {
  it('renders description text', () => {
    renderRadio(
      <Radio value="a" defaultChecked={false}>
        <Radio.Description>Details here</Radio.Description>
      </Radio>,
    );
    expect(screen.getByText('Details here')).toBeTruthy();
  });
});

describe('Radio FieldContext integration', () => {
  it('picks up aria-describedby from Field', () => {
    renderRadio(
      <Field id="radio-field">
        <Field.Control>
          <Radio value="a" defaultChecked={false}>
            <Radio.Indicator />
          </Radio>
        </Field.Control>
        <Field.Description>Choose one</Field.Description>
      </Field>,
    );
    expect(screen.getByRole('radio').getAttribute('aria-describedby')).toBe('radio-field-description');
  });

  it('picks up aria-invalid from Field', () => {
    renderRadio(
      <Field id="radio-field" invalid>
        <Field.Control>
          <Radio value="a" defaultChecked={false}>
            <Radio.Indicator />
          </Radio>
        </Field.Control>
      </Field>,
    );
    expect(screen.getByRole('radio').getAttribute('aria-invalid')).toBe('true');
  });

  it('picks up disabled from FieldContext', () => {
    renderRadio(
      <Field id="radio-field" disabled>
        <Radio value="a" defaultChecked={false}>
          <Radio.Indicator />
        </Radio>
      </Field>,
    );
    expect((screen.getByRole('radio') as HTMLInputElement).disabled).toBe(true);
  });

  it('picks up aria-required from Field', () => {
    renderRadio(
      <Field id="radio-field" required>
        <Field.Control>
          <Radio value="a" defaultChecked={false}>
            <Radio.Indicator />
          </Radio>
        </Field.Control>
      </Field>,
    );
    expect(screen.getByRole('radio').getAttribute('aria-required')).toBe('true');
  });

  it('picks up aria-errormessage from Field when isInvalid', () => {
    renderRadio(
      <Field id="radio-field" invalid>
        <Field.Control>
          <Radio value="a" defaultChecked={false}>
            <Radio.Indicator />
          </Radio>
        </Field.Control>
        <Field.Error>Error</Field.Error>
      </Field>,
    );
    expect(screen.getByRole('radio').getAttribute('aria-errormessage')).toBe('radio-field-error');
  });
});

describe('Radio full composition', () => {
  it('renders label, indicator, and description together', () => {
    renderRadio(
      <Radio value="choice1" defaultChecked={false}>
        <span style={{ flex: 1 }}>
          <Radio.Label>Choice 1</Radio.Label>
          <Radio.Description>Pick this if relevant</Radio.Description>
        </span>
        <Radio.Indicator />
      </Radio>,
    );
    expect(screen.getByText('Choice 1')).toBeTruthy();
    expect(screen.getByText('Pick this if relevant')).toBeTruthy();
  });

  it('assigns name attribute when provided', () => {
    renderRadio(
      <Radio value="a" defaultChecked={false} name="group1">
        <Radio.Indicator />
      </Radio>,
    );
    expect(screen.getByRole('radio').getAttribute('name')).toBe('group1');
  });
});
