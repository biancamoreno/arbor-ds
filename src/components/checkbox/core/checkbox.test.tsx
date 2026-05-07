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
      <Checkbox.Root defaultChecked={false} onCheckedChange={() => {}}>
        <Checkbox.Indicator />
        <Checkbox.Label>Accept terms</Checkbox.Label>
      </Checkbox.Root>,
    );
    expect(screen.getByText('Accept terms')).toBeTruthy();
  });

  it('renders unchecked by default', () => {
    renderCb(
      <Checkbox.Root defaultChecked={false} onCheckedChange={() => {}}>
        <Checkbox.Indicator data-testid="cb" />
      </Checkbox.Root>,
    );
    expect((screen.getByTestId('cb') as HTMLInputElement).checked).toBe(false);
  });

  it('renders checked when defaultChecked=true', () => {
    renderCb(
      <Checkbox.Root defaultChecked onCheckedChange={() => {}}>
        <Checkbox.Indicator data-testid="cb" />
      </Checkbox.Root>,
    );
    expect((screen.getByTestId('cb') as HTMLInputElement).checked).toBe(true);
  });

  it('toggles state on click (uncontrolled)', () => {
    renderCb(
      <Checkbox.Root defaultChecked={false} onCheckedChange={() => {}}>
        <Checkbox.Indicator data-testid="cb" />
      </Checkbox.Root>,
    );
    const input = screen.getByTestId('cb') as HTMLInputElement;
    fireEvent.click(input);
    expect(input.checked).toBe(true);
  });

  it('calls onCheckedChange when toggled', () => {
    const onCheckedChange = jest.fn();
    renderCb(
      <Checkbox.Root defaultChecked={false} onCheckedChange={onCheckedChange}>
        <Checkbox.Indicator data-testid="cb" />
      </Checkbox.Root>,
    );
    fireEvent.click(screen.getByTestId('cb'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('respects controlled checked prop', () => {
    renderCb(
      <Checkbox.Root checked onCheckedChange={() => {}}>
        <Checkbox.Indicator data-testid="cb" />
      </Checkbox.Root>,
    );
    expect((screen.getByTestId('cb') as HTMLInputElement).checked).toBe(true);
  });

  it('renders as disabled when disabled=true', () => {
    renderCb(
      <Checkbox.Root defaultChecked={false} onCheckedChange={() => {}} disabled>
        <Checkbox.Indicator data-testid="cb" />
      </Checkbox.Root>,
    );
    expect((screen.getByTestId('cb') as HTMLInputElement).disabled).toBe(true);
  });

  it('does not toggle when disabled', () => {
    const onCheckedChange = jest.fn();
    renderCb(
      <Checkbox.Root defaultChecked={false} onCheckedChange={onCheckedChange} disabled>
        <Checkbox.Indicator data-testid="cb" />
      </Checkbox.Root>,
    );
    fireEvent.click(screen.getByTestId('cb'));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('sets indeterminate on native input', () => {
    renderCb(
      <Checkbox.Root defaultChecked={false} onCheckedChange={() => {}} indeterminate>
        <Checkbox.Indicator data-testid="cb" />
      </Checkbox.Root>,
    );
    expect((screen.getByTestId('cb') as HTMLInputElement).indeterminate).toBe(true);
  });

  it('Checkbox.Indicator has type="checkbox"', () => {
    renderCb(
      <Checkbox.Root defaultChecked={false} onCheckedChange={() => {}}>
        <Checkbox.Indicator data-testid="cb" />
      </Checkbox.Root>,
    );
    expect(screen.getByTestId('cb').getAttribute('type')).toBe('checkbox');
  });

  it('Checkbox.Label renders children', () => {
    renderCb(
      <Checkbox.Root defaultChecked={false} onCheckedChange={() => {}}>
        <Checkbox.Indicator />
        <Checkbox.Label>My label</Checkbox.Label>
      </Checkbox.Root>,
    );
    expect(screen.getByText('My label')).toBeTruthy();
  });

  it('Checkbox.Description renders children', () => {
    renderCb(
      <Checkbox.Root defaultChecked={false} onCheckedChange={() => {}}>
        <Checkbox.Indicator />
        <Checkbox.Description>Extra info</Checkbox.Description>
      </Checkbox.Root>,
    );
    expect(screen.getByText('Extra info')).toBeTruthy();
  });
});

describe('Checkbox slot recipe (RFC-0017)', () => {
  it('accepts size prop without runtime error', () => {
    renderCb(
      <Checkbox.Root size="small" defaultChecked={false} onCheckedChange={() => {}}>
        <Checkbox.Indicator data-testid="cb" />
      </Checkbox.Root>,
    );
    expect(screen.getByTestId('cb')).toBeTruthy();
  });

  it('produces different classNames for different sizes (recipe is consumed)', () => {
    const { unmount } = renderCb(
      <Checkbox.Root size="small" defaultChecked={false} onCheckedChange={() => {}}>
        <Checkbox.Indicator data-testid="cb-sm" />
      </Checkbox.Root>,
    );
    const smClass = (screen.getByTestId('cb-sm') as HTMLInputElement).className;
    unmount();

    renderCb(
      <Checkbox.Root size="large" defaultChecked={false} onCheckedChange={() => {}}>
        <Checkbox.Indicator data-testid="cb-lg" />
      </Checkbox.Root>,
    );
    const lgClass = (screen.getByTestId('cb-lg') as HTMLInputElement).className;

    expect(smClass).not.toEqual(lgClass);
  });

  it('createTheme override on checkbox recipe injects custom styles', () => {
    const overriddenTheme = createTheme(themeLight, {
      recipes: {
        checkbox: {
          slots: ['root', 'indicator', 'label', 'description'],
          base: {
            indicator: { borderRadius: 'huge' },
          },
          variants: {},
          defaultVariants: {},
        },
      },
    });

    render(
      <ArborProvider theme={overriddenTheme}>
        <Checkbox.Root defaultChecked={false} onCheckedChange={() => {}}>
          <Checkbox.Indicator data-testid="cb-themed" />
        </Checkbox.Root>
      </ArborProvider>,
    );

    const allStyles = Array.from(document.head.querySelectorAll('style'))
      .map(node => node.textContent ?? '')
      .join(' ');
    expect(allStyles).toMatch(/border-radius:\s*32px/);
  });
});

describe('Checkbox FieldContext integration', () => {
  it('receives aria-describedby from Field context', () => {
    renderCb(
      <Field id="cb-field">
        <Field.Control>
          <Checkbox.Root defaultChecked={false} onCheckedChange={() => {}}>
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
          <Checkbox.Root defaultChecked={false} onCheckedChange={() => {}}>
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
        <Checkbox.Root defaultChecked={false} onCheckedChange={() => {}}>
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
          <Checkbox.Root defaultChecked={false} onCheckedChange={() => {}}>
            <Checkbox.Indicator data-testid="cb" />
          </Checkbox.Root>
        </Field.Control>
      </Field>,
    );
    expect(screen.getByTestId('cb').getAttribute('aria-required')).toBe('true');
  });
});

describe('Checkbox accessibility — visible focus (TD-014, WCAG 2.4.7)', () => {
  it('emits :focus-visible outline rule for the indicator', () => {
    renderCb(
      <Checkbox.Root defaultChecked={false} onCheckedChange={() => {}}>
        <Checkbox.Indicator data-testid="cb" />
      </Checkbox.Root>,
    );
    const indicatorClass = (screen.getByTestId('cb') as HTMLInputElement).className;
    const sheet = document.getElementById('arbor-style-engine')?.textContent ?? '';
    const focusRule = new RegExp(`\\.${indicatorClass.split(' ').pop()}:focus-visible\\{[^}]*outline`);
    expect(sheet).toMatch(focusRule);
  });
});
