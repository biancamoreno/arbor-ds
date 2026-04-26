import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Field } from '../../field';
import { Radio } from './radio';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

describe('Radio (native)', () => {
  it('exposes accessibilityRole="radio"', () => {
    render(
      <Radio value="a" defaultChecked={false}>
        <Radio.Indicator />
      </Radio>,
      { wrapper: Wrapper },
    );
    expect(screen.getByRole('radio')).toBeTruthy();
  });

  it('reflects defaultChecked in accessibilityState', () => {
    render(
      <Radio value="a" defaultChecked>
        <Radio.Indicator />
      </Radio>,
      { wrapper: Wrapper },
    );
    expect(screen.getByRole('radio').props.accessibilityState.checked).toBe(true);
  });

  it('reflects controlled checked prop', () => {
    render(
      <Radio value="a" checked onCheckedChange={() => {}}>
        <Radio.Indicator />
      </Radio>,
      { wrapper: Wrapper },
    );
    expect(screen.getByRole('radio').props.accessibilityState.checked).toBe(true);
  });

  it('fires onCheckedChange(true) when pressed', () => {
    const onCheckedChange = jest.fn();
    render(
      <Radio value="a" defaultChecked={false} onCheckedChange={onCheckedChange}>
        <Radio.Indicator />
      </Radio>,
      { wrapper: Wrapper },
    );
    fireEvent.press(screen.getByRole('radio'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('does not fire onCheckedChange when disabled', () => {
    const onCheckedChange = jest.fn();
    render(
      <Radio value="a" defaultChecked={false} disabled onCheckedChange={onCheckedChange}>
        <Radio.Indicator />
      </Radio>,
      { wrapper: Wrapper },
    );
    fireEvent.press(screen.getByRole('radio'));
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(screen.getByRole('radio').props.accessibilityState.disabled).toBe(true);
  });

  it('renders Radio.Label content', () => {
    render(
      <Radio value="a" defaultChecked={false}>
        <Radio.Label>Option A</Radio.Label>
      </Radio>,
      { wrapper: Wrapper },
    );
    expect(screen.getByText('Option A')).toBeTruthy();
  });

  it('renders Radio.Description content', () => {
    render(
      <Radio value="a" defaultChecked={false}>
        <Radio.Description>Pick this one</Radio.Description>
      </Radio>,
      { wrapper: Wrapper },
    );
    expect(screen.getByText('Pick this one')).toBeTruthy();
  });
});

describe('Radio FieldContext integration (native)', () => {
  it('inherits disabled from FieldContext', () => {
    render(
      <Field id="rf" disabled>
        <Radio value="a" defaultChecked={false}>
          <Radio.Indicator />
        </Radio>
      </Field>,
      { wrapper: Wrapper },
    );
    expect(screen.getByRole('radio').props.accessibilityState.disabled).toBe(true);
  });

  it('connects Label to Radio via accessibilityLabelledBy', () => {
    render(
      <Field id="rf">
        <Field.Label>Choose</Field.Label>
        <Radio value="a" defaultChecked={false}>
          <Radio.Indicator />
        </Radio>
      </Field>,
      { wrapper: Wrapper },
    );
    expect(screen.getByRole('radio').props.accessibilityLabelledBy).toBe('rf-label');
  });

  it('uses Field fieldId as nativeID', () => {
    render(
      <Field id="rf">
        <Radio value="a" defaultChecked={false}>
          <Radio.Indicator />
        </Radio>
      </Field>,
      { wrapper: Wrapper },
    );
    expect(screen.getByRole('radio').props.nativeID).toBe('rf');
  });
});
