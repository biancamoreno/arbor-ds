import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { ArborProvider } from '../../../../ecosystem';
import { themeLight } from '../../../../foundations';
import { __resetStyleEngine__ } from '../../../../ecosystem/styled-system/core/styled/styled-component';
import { Flex } from './flex';

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

describe('Flex', () => {
  it('renderiza children como div por default', () => {
    render(<Flex testID="root">conteúdo</Flex>, { wrapper });
    const el = screen.getByTestId('root');
    expect(el.tagName).toBe('DIV');
    expect(el.textContent).toBe('conteúdo');
  });

  it('aplica display:flex e flex-direction:row por default', () => {
    render(<Flex testID="default" />, { wrapper });
    const css = getGeneratedCss();
    expect(css).toMatch(/display:flex/);
    expect(css).toMatch(/flex-direction:row/);
  });

  it('respeita flexDirection="column"', () => {
    render(<Flex testID="col" flexDirection="column" />, { wrapper });
    expect(getGeneratedCss()).toMatch(/flex-direction:column/);
  });

  it('alias `flexDir` tem precedência sobre `flexDirection`', () => {
    render(<Flex testID="alias" flexDirection="row" flexDir="column" />, { wrapper });
    expect(getGeneratedCss()).toMatch(/flex-direction:column/);
  });

  it('forwarda ref canônico para o elemento DOM', () => {
    const ref = createRef<HTMLElement>();
    render(<Flex ref={ref} testID="ref" />, { wrapper });
    expect(ref.current).not.toBeNull();
    expect(ref.current).toBe(screen.getByTestId('ref'));
  });

  it('aceita polimorfismo via `as`', () => {
    render(<Flex as="section" testID="section" />, { wrapper });
    expect(screen.getByTestId('section').tagName).toBe('SECTION');
  });
});
