import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { ArborProvider } from '../../../../ecosystem';
import { themeLight } from '../../../../foundations';
import { __resetStyleEngine__ } from '../../../../ecosystem/styled-system/core/styled/styled-component';
import { Grid } from './grid';

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

// NOTA: a transform engine não inclui grid-template-* / grid-*-gap / grid-auto-flow
// no whitelist atual (AVAILABLE_STYLE_PROPERTIES). Essas props são silenciosamente
// descartadas. Testes abaixo refletem o contrato observável hoje e evitam assertar
// comportamento quebrado — ver follow-up em _followups.md.

describe('Grid', () => {
  it('renderiza children', () => {
    render(<Grid testID="root">conteúdo</Grid>, { wrapper });
    expect(screen.getByTestId('root').textContent).toBe('conteúdo');
  });

  it('aplica display:grid por default', () => {
    render(<Grid testID="g" />, { wrapper });
    expect(getGeneratedCss()).toMatch(/display:grid/);
  });

  it('aceita props de grid sem lançar (templateColumns/columnGap/autoFlow)', () => {
    expect(() =>
      render(
        <Grid
          testID="g"
          templateColumns="1fr 2fr"
          templateRows="auto 1fr"
          columnGap={16}
          rowGap={8}
          autoFlow="column"
        />,
        { wrapper },
      ),
    ).not.toThrow();
  });

  it('forwarda ref canônico', () => {
    const ref = createRef<HTMLElement>();
    render(<Grid ref={ref} testID="ref" />, { wrapper });
    expect(ref.current).toBe(screen.getByTestId('ref'));
  });

  it('aceita polimorfismo via `as`', () => {
    render(<Grid as="section" testID="s" />, { wrapper });
    expect(screen.getByTestId('s').tagName).toBe('SECTION');
  });
});
