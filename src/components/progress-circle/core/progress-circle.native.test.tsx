import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { ProgressCircle } from './progress-circle.native';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

describe('ProgressCircle (native)', () => {
  it('renderiza com accessibilityRole="progressbar"', () => {
    render(<ProgressCircle progress={50} label="Carregando" />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Carregando')).toBeTruthy();
  });

  it('expõe accessibilityValue.now quando determinado', () => {
    render(<ProgressCircle progress={40} label="P" />, { wrapper: Wrapper });
    const node = screen.getByLabelText('P');
    expect(node.props.accessibilityValue).toEqual({ min: 0, max: 100, now: 40 });
  });

  it('clamp: progress > 100 vira 100', () => {
    render(<ProgressCircle progress={200} label="Acima" />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Acima').props.accessibilityValue.now).toBe(100);
  });

  it('clamp: progress < 0 vira 0', () => {
    render(<ProgressCircle progress={-5} label="Abaixo" />, { wrapper: Wrapper });
    expect(screen.getByLabelText('Abaixo').props.accessibilityValue.now).toBe(0);
  });

  it('aceita size nominal SP-1 (large → 64px via tokens)', () => {
    render(<ProgressCircle progress={50} size="large" label="S" />, { wrapper: Wrapper });
    const node = screen.getByLabelText('S');
    const flat = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style)
      : node.props.style;
    expect(flat.width).toBe(64);
    expect(flat.height).toBe(64);
  });

  it('aceita strokeWidth customizado sem crashar', () => {
    render(<ProgressCircle progress={50} strokeWidth={8} label="SW" />, { wrapper: Wrapper });
    expect(screen.getByLabelText('SW')).toBeTruthy();
  });

  it.each(['brand', 'success', 'warning', 'critical'] as const)(
    'aceita tone "%s"',
    (tone) => {
      render(<ProgressCircle progress={70} tone={tone} label={`L-${tone}`} />, {
        wrapper: Wrapper,
      });
      expect(screen.getByLabelText(`L-${tone}`)).toBeTruthy();
    },
  );

  it('indeterminate não expõe accessibilityValue', () => {
    render(<ProgressCircle progress={0} indeterminate label="I" />, { wrapper: Wrapper });
    expect(screen.getByLabelText('I').props.accessibilityValue).toBeUndefined();
  });

  it('indeterminate marca accessibilityState.busy', () => {
    render(<ProgressCircle progress={0} indeterminate label="B" />, { wrapper: Wrapper });
    expect(screen.getByLabelText('B').props.accessibilityState).toEqual({ busy: true });
  });

  it('determinado não marca accessibilityState.busy', () => {
    render(<ProgressCircle progress={50} label="D" />, { wrapper: Wrapper });
    expect(screen.getByLabelText('D').props.accessibilityState?.busy).toBeUndefined();
  });

  it('forwarda testID', () => {
    render(<ProgressCircle progress={50} testID="pc" />, { wrapper: Wrapper });
    expect(screen.getByTestId('pc')).toBeTruthy();
  });
});
