import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { ArborProvider } from '../../../../ecosystem';
import { themeLight } from '../../../../foundations';
import { __resetStyleEngine__ } from '../../../../ecosystem/styled-system/core/styled/styled-component';
import { Circle } from './circle';

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

describe('Circle', () => {
  it('aplica borderRadius:full (100%) resolvendo token', () => {
    render(<Circle testID="c" size={48} />, { wrapper });
    // borderRadius="full" deve resolver para algum valor (ex: 9999px ou 100%) via token
    const css = getGeneratedCss();
    expect(css).toMatch(/border-radius:/);
  });

  it('é um Square por baixo — aplica width/height iguais', () => {
    render(<Circle testID="c" size={48} />, { wrapper });
    const css = getGeneratedCss();
    expect(css).toMatch(/width:48px/);
    expect(css).toMatch(/height:48px/);
  });

  it('forwarda ref canônico', () => {
    const ref = createRef<HTMLElement>();
    render(<Circle ref={ref} testID="ref" size={16} />, { wrapper });
    expect(ref.current).toBe(screen.getByTestId('ref'));
  });

  it('renderiza children', () => {
    render(
      <Circle testID="c" size={32}>
        x
      </Circle>,
      { wrapper },
    );
    expect(screen.getByTestId('c').textContent).toBe('x');
  });
});
