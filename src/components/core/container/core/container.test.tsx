import { render, screen } from '@testing-library/react';
import { ArborProvider } from '../../../../ecosystem';
import { themeLight } from '../../../../foundations';
import { __resetStyleEngine__ } from '../../../../ecosystem/styled-system/core/styled/styled-component';
import { Container } from './container';

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

// NOTA: `marginInline`/`paddingInline` passados pelo Container não estão
// no whitelist do transform atual e são silenciosamente descartados. O teste
// reflete o observável hoje — ver follow-up.

describe('Container', () => {
  it('renderiza children', () => {
    render(<Container>conteúdo</Container>, { wrapper });
    expect(screen.getByText('conteúdo')).toBeTruthy();
  });

  it('aplica display:block e width:100% por default', () => {
    render(
      <Container>
        <span data-testid="child">x</span>
      </Container>,
      { wrapper },
    );
    const css = getGeneratedCss();
    expect(css).toMatch(/display:block/);
    expect(css).toMatch(/width:100%/);
  });

  it('centerContent sobrepõe display para flex+column+alignItems:center', () => {
    render(
      <Container centerContent>
        <span data-testid="child">x</span>
      </Container>,
      { wrapper },
    );
    const css = getGeneratedCss();
    expect(css).toMatch(/display:flex/);
    expect(css).toMatch(/flex-direction:column/);
    expect(css).toMatch(/align-items:center/);
  });

  it('maxWidth="md" resolve para o valor do breakpoint do tema (768px)', () => {
    render(
      <Container maxWidth="md">
        <span data-testid="c">x</span>
      </Container>,
      { wrapper },
    );
    expect(getGeneratedCss()).toMatch(/max-width:768px/);
  });

  it('aceita polimorfismo via `as="section"`', () => {
    render(
      <Container as="section">
        <span data-testid="c">x</span>
      </Container>,
      { wrapper },
    );
    const child = screen.getByTestId('c');
    expect(child.parentElement?.tagName).toBe('SECTION');
  });
});
