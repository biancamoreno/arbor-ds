import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { ArborProvider } from '../../../../ecosystem';
import { themeLight } from '../../../../foundations';
import { __resetStyleEngine__ } from '../../../../ecosystem/styled-system/core/styled/styled-component';
import { Spacer } from './spacer';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

function getGeneratedCss(): string {
  return document.getElementById('arbor-style-engine')?.textContent ?? '';
}

afterEach(() => {
  const sheet = document.getElementById('arbor-style-engine');
  if (sheet) sheet.textContent = '';
  __resetStyleEngine__();
});

// NOTA: `justifySelf` passado pelo Spacer não está no whitelist do transform
// atual e é descartado silenciosamente — follow-up aberto. `alignSelf` é OK.

describe('Spacer', () => {
  it('expande flex:1 para flex-grow/shrink:1 + flex-basis:0', () => {
    render(<Spacer testID="s" />, { wrapper });
    const css = getGeneratedCss();
    expect(css).toMatch(/flex-grow:1/);
    expect(css).toMatch(/flex-shrink:1/);
    expect(css).toMatch(/flex-basis:0/);
  });

  it('aplica align-self:stretch por default', () => {
    render(<Spacer testID="s" />, { wrapper });
    expect(getGeneratedCss()).toMatch(/align-self:stretch/);
  });

  it('forwarda ref canônico', () => {
    const ref = createRef<HTMLElement>();
    render(<Spacer ref={ref} testID="ref" />, { wrapper });
    expect(ref.current).toBe(screen.getByTestId('ref'));
  });

  it('aceita polimorfismo via `as`', () => {
    render(<Spacer as="span" testID="s" />, { wrapper });
    expect(screen.getByTestId('s').tagName).toBe('SPAN');
  });
});
