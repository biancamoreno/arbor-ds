import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { ArborProvider } from '../../../../ecosystem';
import { themeLight } from '../../../../foundations';
import { __resetStyleEngine__ } from '../../../../ecosystem/styled-system/core/styled/styled-component';
import { Square } from './square';

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

describe('Square', () => {
  it('aplica width e height iguais a `size`', () => {
    render(<Square testID="s" size={64} />, { wrapper });
    const css = getGeneratedCss();
    expect(css).toMatch(/width:64px/);
    expect(css).toMatch(/height:64px/);
  });

  it('aplica flexGrow:0 e flexShrink:0', () => {
    render(<Square testID="s" size={32} />, { wrapper });
    const css = getGeneratedCss();
    expect(css).toMatch(/flex-grow:0/);
    expect(css).toMatch(/flex-shrink:0/);
  });

  it('centerContent=true (default) centraliza conteúdo', () => {
    render(<Square testID="s" size={32} />, { wrapper });
    const css = getGeneratedCss();
    expect(css).toMatch(/align-items:center/);
    expect(css).toMatch(/justify-content:center/);
  });

  it('centerContent=false não injeta alignItems/justifyContent', () => {
    render(<Square testID="s" size={32} centerContent={false} />, { wrapper });
    const css = getGeneratedCss();
    // sem centralização — ainda é flex, mas sem align/justify:center em uma classe nova
    expect(css).not.toMatch(/align-items:center/);
    expect(css).not.toMatch(/justify-content:center/);
  });

  it('forwarda ref canônico', () => {
    const ref = createRef<HTMLElement>();
    render(<Square ref={ref} testID="ref" size={16} />, { wrapper });
    expect(ref.current).toBe(screen.getByTestId('ref'));
  });

  it('renderiza children', () => {
    render(
      <Square testID="s" size={32}>
        conteúdo
      </Square>,
      { wrapper },
    );
    expect(screen.getByTestId('s').textContent).toBe('conteúdo');
  });
});
