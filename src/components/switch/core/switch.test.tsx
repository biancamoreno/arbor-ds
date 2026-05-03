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

  it('calls onCheckedChange when toggled', () => {
    const onCheckedChange = jest.fn();
    renderSwitch(<Switch onCheckedChange={onCheckedChange} aria-label="Toggle" />);
    const track = document.querySelector('[aria-hidden="true"]') as HTMLElement;
    fireEvent.click(track);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('respects controlled checked prop', () => {
    renderSwitch(<Switch checked onCheckedChange={() => {}} aria-label="Toggle" />);
    expect(getSwitch().checked).toBe(true);
  });

  it('updates controlled state via onCheckedChange', () => {
    const onCheckedChange = jest.fn();
    renderSwitch(<Switch checked={false} onCheckedChange={onCheckedChange} aria-label="Toggle" />);
    const track = document.querySelector('[aria-hidden="true"]') as HTMLElement;
    fireEvent.click(track);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('is disabled when disabled=true', () => {
    renderSwitch(<Switch disabled aria-label="Toggle" />);
    expect((getSwitch() as HTMLInputElement).disabled).toBe(true);
  });

  it('does not toggle when disabled', () => {
    const onCheckedChange = jest.fn();
    renderSwitch(<Switch disabled onCheckedChange={onCheckedChange} aria-label="Toggle" />);
    const track = document.querySelector('[aria-hidden="true"]') as HTMLElement;
    fireEvent.click(track);
    expect(onCheckedChange).not.toHaveBeenCalled();
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

  it('picks up aria-errormessage from Field when invalid', () => {
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

describe('Switch slot recipe (RFC-0017)', () => {
  it('produces different track classNames for sm vs lg (recipe is consumed)', () => {
    const { unmount } = renderSwitch(<Switch size="sm" aria-label="t-sm" />);
    const smTrack = (document.querySelector('[aria-hidden="true"]') as HTMLElement).className;
    unmount();

    renderSwitch(<Switch size="lg" aria-label="t-lg" />);
    const lgTrack = (document.querySelector('[aria-hidden="true"]') as HTMLElement).className;

    expect(smTrack).not.toEqual(lgTrack);
  });

  it('createTheme override on switch recipe injects custom styles', () => {
    const overriddenTheme = createTheme(themeLight, {
      components: {
        switch: {
          slots: ['root', 'track', 'thumb'],
          base: {
            track: { borderRadius: 'huge' },
          },
          variants: {},
          defaultVariants: {},
        },
      },
    });

    render(
      <ArborProvider theme={overriddenTheme}>
        <Switch aria-label="themed" />
      </ArborProvider>,
    );

    const allStyles = Array.from(document.head.querySelectorAll('style'))
      .map(node => node.textContent ?? '')
      .join(' ');
    expect(allStyles).toMatch(/border-radius:\s*32px/);
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

describe('Switch accessibility — visible focus (TD-014, WCAG 2.4.7)', () => {
  it('emits :has(:focus-visible) outline rule on the root', () => {
    renderSwitch(<Switch aria-label="Toggle" />);
    const rootClass = (getSwitch().parentElement as HTMLElement).className;
    const sheet = document.getElementById('arbor-style-engine')?.textContent ?? '';
    const focusRule = new RegExp(`\\.${rootClass.split(' ').pop()}:has\\(:focus-visible\\)\\{[^}]*outline`);
    expect(sheet).toMatch(focusRule);
  });
});

describe('Switch accessibility — touch target (TD-016, WCAG 2.5.5)', () => {
  it.each(['sm', 'md', 'lg'] as const)('track has 44x44 hit-area overlay in size %s', size => {
    renderSwitch(<Switch size={size} aria-label="Toggle" />);
    const track = document.querySelector('[aria-hidden="true"]') as HTMLElement;
    const trackClass = track.className.split(' ').pop()!;
    const sheet = document.getElementById('arbor-style-engine')?.textContent ?? '';
    const beforeRule = new RegExp(`\\.${trackClass}::before\\{[^}]*min-width:44px[^}]*min-height:44px`);
    expect(sheet).toMatch(beforeRule);
  });
});
