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

function getInput(): HTMLInputElement {
  return screen.getByRole('checkbox') as HTMLInputElement;
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
        <Checkbox.Indicator />
      </Checkbox.Root>,
    );
    expect(getInput().checked).toBe(false);
  });

  it('renders checked when defaultChecked=true', () => {
    renderCb(
      <Checkbox.Root defaultChecked onCheckedChange={() => {}}>
        <Checkbox.Indicator />
      </Checkbox.Root>,
    );
    expect(getInput().checked).toBe(true);
  });

  it('toggles state on click (uncontrolled)', () => {
    renderCb(
      <Checkbox.Root defaultChecked={false} onCheckedChange={() => {}}>
        <Checkbox.Indicator />
      </Checkbox.Root>,
    );
    const input = getInput();
    fireEvent.click(input);
    expect(input.checked).toBe(true);
  });

  it('calls onCheckedChange when toggled', () => {
    const onCheckedChange = jest.fn();
    renderCb(
      <Checkbox.Root defaultChecked={false} onCheckedChange={onCheckedChange}>
        <Checkbox.Indicator />
      </Checkbox.Root>,
    );
    fireEvent.click(getInput());
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('respects controlled checked prop', () => {
    renderCb(
      <Checkbox.Root checked onCheckedChange={() => {}}>
        <Checkbox.Indicator />
      </Checkbox.Root>,
    );
    expect(getInput().checked).toBe(true);
  });

  it('renders as disabled when disabled=true', () => {
    renderCb(
      <Checkbox.Root defaultChecked={false} onCheckedChange={() => {}} disabled>
        <Checkbox.Indicator />
      </Checkbox.Root>,
    );
    expect(getInput().disabled).toBe(true);
  });

  it('does not toggle when disabled', () => {
    const onCheckedChange = jest.fn();
    renderCb(
      <Checkbox.Root defaultChecked={false} onCheckedChange={onCheckedChange} disabled>
        <Checkbox.Indicator />
      </Checkbox.Root>,
    );
    fireEvent.click(getInput());
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('sets indeterminate on native input', () => {
    renderCb(
      <Checkbox.Root defaultChecked={false} onCheckedChange={() => {}} indeterminate>
        <Checkbox.Indicator />
      </Checkbox.Root>,
    );
    expect(getInput().indeterminate).toBe(true);
  });

  it('renders an input[type=checkbox] in the Root', () => {
    renderCb(
      <Checkbox.Root defaultChecked={false} onCheckedChange={() => {}}>
        <Checkbox.Indicator />
      </Checkbox.Root>,
    );
    expect(getInput().getAttribute('type')).toBe('checkbox');
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

  it('renders Check icon when checked', () => {
    const { container } = renderCb(
      <Checkbox.Root defaultChecked onCheckedChange={() => {}}>
        <Checkbox.Indicator />
      </Checkbox.Root>,
    );
    expect(container.querySelector('svg.lucide-check')).toBeTruthy();
  });

  it('renders Minus icon when indeterminate', () => {
    const { container } = renderCb(
      <Checkbox.Root defaultChecked={false} onCheckedChange={() => {}} indeterminate>
        <Checkbox.Indicator />
      </Checkbox.Root>,
    );
    expect(container.querySelector('svg.lucide-minus')).toBeTruthy();
  });

  it('renders no glyph in idle state', () => {
    const { container } = renderCb(
      <Checkbox.Root defaultChecked={false} onCheckedChange={() => {}}>
        <Checkbox.Indicator />
      </Checkbox.Root>,
    );
    expect(container.querySelector('svg')).toBeNull();
  });
});

describe('Checkbox slot recipe (RFC-0017)', () => {
  it('accepts size prop without runtime error', () => {
    renderCb(
      <Checkbox.Root size="small" defaultChecked={false} onCheckedChange={() => {}}>
        <Checkbox.Indicator />
      </Checkbox.Root>,
    );
    expect(getInput()).toBeTruthy();
  });

  it('produces different indicator classNames for different sizes (recipe is consumed)', () => {
    const { container, unmount } = renderCb(
      <Checkbox.Root size="small" defaultChecked={false} onCheckedChange={() => {}}>
        <Checkbox.Indicator />
      </Checkbox.Root>,
    );
    const smClass = (container.querySelector('[aria-hidden="true"]') as HTMLElement).className;
    unmount();

    const { container: container2 } = renderCb(
      <Checkbox.Root size="large" defaultChecked={false} onCheckedChange={() => {}}>
        <Checkbox.Indicator />
      </Checkbox.Root>,
    );
    const lgClass = (container2.querySelector('[aria-hidden="true"]') as HTMLElement).className;

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
          <Checkbox.Indicator />
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
            <Checkbox.Indicator />
          </Checkbox.Root>
        </Field.Control>
        <Field.Description>Helper</Field.Description>
      </Field>,
    );
    expect(getInput().getAttribute('aria-describedby')).toBe('cb-field-description');
  });

  it('receives aria-invalid from Field context', () => {
    renderCb(
      <Field id="cb-field" invalid>
        <Field.Control>
          <Checkbox.Root defaultChecked={false} onCheckedChange={() => {}}>
            <Checkbox.Indicator />
          </Checkbox.Root>
        </Field.Control>
      </Field>,
    );
    expect(getInput().getAttribute('aria-invalid')).toBe('true');
  });

  it('receives disabled from Field context', () => {
    renderCb(
      <Field id="cb-field" disabled>
        <Checkbox.Root defaultChecked={false} onCheckedChange={() => {}}>
          <Checkbox.Indicator />
        </Checkbox.Root>
      </Field>,
    );
    expect(getInput().disabled).toBe(true);
  });

  it('receives aria-required from Field context', () => {
    renderCb(
      <Field id="cb-field" required>
        <Field.Control>
          <Checkbox.Root defaultChecked={false} onCheckedChange={() => {}}>
            <Checkbox.Indicator />
          </Checkbox.Root>
        </Field.Control>
      </Field>,
    );
    expect(getInput().getAttribute('aria-required')).toBe('true');
  });
});

describe('Checkbox accessibility — visible focus (TD-014, WCAG 2.4.7)', () => {
  it('emits :has(:focus-visible) outline rule for the root', () => {
    const { container } = renderCb(
      <Checkbox.Root defaultChecked={false} onCheckedChange={() => {}}>
        <Checkbox.Indicator />
      </Checkbox.Root>,
    );
    const rootClass = (container.querySelector('label') as HTMLElement).className;
    const sheet = document.getElementById('arbor-style-engine')?.textContent ?? '';
    const lastClass = rootClass.split(' ').pop() ?? '';
    const focusRule = new RegExp(`\\.${lastClass}:has\\(:focus-visible\\)\\{[^}]*outline`);
    expect(sheet).toMatch(focusRule);
  });
});
