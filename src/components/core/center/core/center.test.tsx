import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { ArborProvider } from '../../../../ecosystem';
import { themeLight } from '../../../../foundations';
import { __resetStyleEngine__ } from '../../../../ecosystem/styled-system/core/styled/styled-component';
import { Center } from './center';

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

describe('Center', () => {
  it('renderiza children', () => {
    render(<Center testID="root">conteúdo</Center>, { wrapper });
    expect(screen.getByTestId('root').textContent).toBe('conteúdo');
  });

  it('aplica display:flex + alignItems:center + justifyContent:center', () => {
    render(<Center testID="c" />, { wrapper });
    const css = getGeneratedCss();
    expect(css).toMatch(/display:flex/);
    expect(css).toMatch(/align-items:center/);
    expect(css).toMatch(/justify-content:center/);
  });

  it('forwarda ref canônico', () => {
    const ref = createRef<HTMLElement>();
    render(<Center ref={ref} testID="ref" />, { wrapper });
    expect(ref.current).toBe(screen.getByTestId('ref'));
  });

  it('aceita polimorfismo via `as`', () => {
    render(<Center as="section" testID="s" />, { wrapper });
    expect(screen.getByTestId('s').tagName).toBe('SECTION');
  });
});
