import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Field } from '../../field';
import { Switch } from './switch';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

function renderSwitch(ui: React.ReactElement) {
  return render(ui, { wrapper: Wrapper });
}

function getSwitch() {
  return screen.getByRole('switch') as HTMLInputElement;
}

describe('Switch', () => {
  it('renders a switch input', () => {
    renderSwitch(<Switch aria-label="Toggle" />);
    expect(getSwitch()).toBeTruthy();
  });

  it('is unchecked by default', () => {
    renderSwitch(<Switch aria-label="Toggle" />);
    expect(getSwitch().checked).toBe(false);
  });

  it('is checked when defaultChecked=true', () => {
    renderSwitch(<Switch defaultChecked aria-label="Toggle" />);
    expect(getSwitch().checked).toBe(true);
  });

  it('toggles on track click (uncontrolled)', () => {
    renderSwitch(<Switch aria-label="Toggle" />);
    const track = document.querySelector('[aria-hidden="true"]') as HTMLElement;
    fireEvent.click(track);
    expect(getSwitch().checked).toBe(true);
  });

  it('calls onChange when toggled', () => {
    const onChange = jest.fn();
    renderSwitch(<Switch onChange={onChange} aria-label="Toggle" />);
    const track = document.querySelector('[aria-hidden="true"]') as HTMLElement;
    fireEvent.click(track);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('respects controlled checked prop', () => {
    renderSwitch(<Switch checked onChange={() => {}} aria-label="Toggle" />);
    expect(getSwitch().checked).toBe(true);
  });

  it('updates controlled state via onChange', () => {
    const onChange = jest.fn();
    renderSwitch(<Switch checked={false} onChange={onChange} aria-label="Toggle" />);
    const track = document.querySelector('[aria-hidden="true"]') as HTMLElement;
    fireEvent.click(track);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('is disabled when disabled=true', () => {
    renderSwitch(<Switch disabled aria-label="Toggle" />);
    expect((getSwitch() as HTMLInputElement).disabled).toBe(true);
  });

  it('does not toggle when disabled', () => {
    const onChange = jest.fn();
    renderSwitch(<Switch disabled onChange={onChange} aria-label="Toggle" />);
    const track = document.querySelector('[aria-hidden="true"]') as HTMLElement;
    fireEvent.click(track);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('has aria-label when provided', () => {
    renderSwitch(<Switch aria-label="Notifications" />);
    expect(getSwitch().getAttribute('aria-label')).toBe('Notifications');
  });

  it('has aria-checked reflecting state', () => {
    renderSwitch(<Switch defaultChecked aria-label="Toggle" />);
    expect(getSwitch().getAttribute('aria-checked')).toBe('true');
  });

  it('renders children alongside track', () => {
    renderSwitch(<Switch aria-label="Toggle"><span>Enable</span></Switch>);
    expect(screen.getByText('Enable')).toBeTruthy();
  });

  it('has role="switch" on the input', () => {
    renderSwitch(<Switch aria-label="Toggle" />);
    expect(screen.getByRole('switch')).toBeTruthy();
  });
});

describe('Switch FieldContext integration', () => {
  it('picks up aria-describedby from Field', () => {
    renderSwitch(
      <Field id="sw-field">
        <Field.Control>
          <Switch aria-label="Toggle" />
        </Field.Control>
        <Field.Description>Some description</Field.Description>
      </Field>,
    );
    expect(getSwitch().getAttribute('aria-describedby')).toBe('sw-field-description');
  });

  it('picks up aria-invalid from Field', () => {
    renderSwitch(
      <Field id="sw-field" invalid>
        <Field.Control>
          <Switch aria-label="Toggle" />
        </Field.Control>
      </Field>,
    );
    expect(getSwitch().getAttribute('aria-invalid')).toBe('true');
  });

  it('picks up disabled from FieldContext', () => {
    renderSwitch(
      <Field id="sw-field" disabled>
        <Switch aria-label="Toggle" />
      </Field>,
    );
    expect((getSwitch() as HTMLInputElement).disabled).toBe(true);
  });

  it('picks up aria-required from Field', () => {
    renderSwitch(
      <Field id="sw-field" required>
        <Field.Control>
          <Switch aria-label="Toggle" />
        </Field.Control>
      </Field>,
    );
    expect(getSwitch().getAttribute('aria-required')).toBe('true');
  });

  it('picks up aria-errormessage from Field when isInvalid', () => {
    renderSwitch(
      <Field id="sw-field" invalid>
        <Field.Control>
          <Switch aria-label="Toggle" />
        </Field.Control>
        <Field.Error>Error</Field.Error>
      </Field>,
    );
    expect(getSwitch().getAttribute('aria-errormessage')).toBe('sw-field-error');
  });

  it('uses fieldId as id from Field context', () => {
    renderSwitch(
      <Field id="sw-field">
        <Field.Control>
          <Switch aria-label="Toggle" />
        </Field.Control>
      </Field>,
    );
    expect(getSwitch().getAttribute('id')).toBe('sw-field');
  });
});

describe('Switch sizes', () => {
  it('renders sm size', () => {
    renderSwitch(<Switch size="sm" aria-label="Toggle" />);
    expect(getSwitch()).toBeTruthy();
  });

  it('renders md size (default)', () => {
    renderSwitch(<Switch aria-label="Toggle" />);
    expect(getSwitch()).toBeTruthy();
  });

  it('renders lg size', () => {
    renderSwitch(<Switch size="lg" aria-label="Toggle" />);
    expect(getSwitch()).toBeTruthy();
  });
});
