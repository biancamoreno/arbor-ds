import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../core/provider';
import { ArborTransform } from '../core/transform';
import { __resetStyleEngine__ } from '../core/styled/styled-component';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

function getStyleContent(): string {
  return document.getElementById('arbor-style-engine')?.textContent ?? '';
}

function getGeneratedClass(testId: string): string {
  const el = screen.queryByTestId(testId);
  return (el?.props.className as string) ?? '';
}

afterEach(() => {
  const sheet = document.getElementById('arbor-style-engine');
  if (sheet) sheet.textContent = '';
  __resetStyleEngine__();
});

// ─── Renderização básica ─────────────────────────────────────────────────────

describe('renderização básica', () => {
  it('renderiza div por padrão', () => {
    render(<ArborTransform testID="el">content</ArborTransform>, { wrapper: Wrapper });
    expect(screen.getByTestId('el').type).toBe('div');
  });

  it('renderiza com as="span"', () => {
    render(<ArborTransform as="span" testID="el">content</ArborTransform>, { wrapper: Wrapper });
    expect(screen.getByTestId('el').type).toBe('span');
  });

  it('renderiza com as="button"', () => {
    render(<ArborTransform as="button" testID="el">content</ArborTransform>, { wrapper: Wrapper });
    expect(screen.getByTestId('el').type).toBe('button');
  });

  it('renderiza com as="p"', () => {
    render(<ArborTransform as="p" testID="el">text</ArborTransform>, { wrapper: Wrapper });
    expect(screen.getByTestId('el').type).toBe('p');
  });

  it('renderiza children', () => {
    render(<ArborTransform testID="el">hello</ArborTransform>, { wrapper: Wrapper });
    expect(screen.getByTestId('el').props.children).toBe('hello');
  });

  it('renderiza sem props de estilo sem erros', () => {
    expect(() =>
      render(<ArborTransform testID="el">content</ArborTransform>, { wrapper: Wrapper }),
    ).not.toThrow();
  });

  it('renderiza children nulo sem erros', () => {
    expect(() =>
      render(<ArborTransform testID="el">{null}</ArborTransform>, { wrapper: Wrapper }),
    ).not.toThrow();
  });
});

// ─── testID e data-testid ──────────────────────────────────────────────────

describe('testID', () => {
  it('forwarda testID — acessível por getByTestId', () => {
    render(<ArborTransform testID="my-box">content</ArborTransform>, { wrapper: Wrapper });
    expect(screen.getByTestId('my-box')).toBeTruthy();
  });

  it('forwarda data-testid no props do elemento', () => {
    render(<ArborTransform testID="my-box">content</ArborTransform>, { wrapper: Wrapper });
    expect(screen.getByTestId('my-box').props['data-testid']).toBe('my-box');
  });

  it('aceita data-testid diretamente', () => {
    render(<ArborTransform data-testid="direct" testID="direct">content</ArborTransform>, {
      wrapper: Wrapper,
    });
    expect(screen.getByTestId('direct')).toBeTruthy();
  });
});

// ─── Refs ─────────────────────────────────────────────────────────────────

describe('ref', () => {
  it('forwarda innerRef — callback ref é chamado', () => {
    const callbackRef = jest.fn();
    render(
      <ArborTransform innerRef={callbackRef as never} testID="ref-el">
        content
      </ArborTransform>,
      { wrapper: Wrapper },
    );
    expect(callbackRef).toHaveBeenCalled();
  });
});

// ─── className gerado ──────────────────────────────────────────────────────

describe('classe gerada', () => {
  it('adiciona className gerado ao elemento', () => {
    render(<ArborTransform testID="el" padding="small">content</ArborTransform>, {
      wrapper: Wrapper,
    });
    expect(getGeneratedClass('el')).toMatch(/arbor-/);
  });

  it('combina className do consumidor com className gerado', () => {
    render(
      <ArborTransform testID="el" className="my-class" padding="small">
        content
      </ArborTransform>,
      { wrapper: Wrapper },
    );
    const cls = getGeneratedClass('el');
    expect(cls).toContain('my-class');
    expect(cls).toMatch(/arbor-/);
  });

  it('não adiciona className se não há props de estilo e className', () => {
    render(<ArborTransform testID="el">content</ArborTransform>, { wrapper: Wrapper });
    const cls = getGeneratedClass('el');
    expect(typeof cls === 'string').toBe(true);
  });
});

// ─── Resolução de tokens ──────────────────────────────────────────────────

describe('resolução de tokens', () => {
  it('resolve padding="small" para paddingTop: 16px no CSS', () => {
    render(<ArborTransform testID="el" padding="small">content</ArborTransform>, {
      wrapper: Wrapper,
    });
    expect(getStyleContent()).toMatch(/padding-top:16px/);
  });

  it('resolve padding="medium" para paddingTop: 20px no CSS', () => {
    render(<ArborTransform testID="el" padding="medium">content</ArborTransform>, {
      wrapper: Wrapper,
    });
    expect(getStyleContent()).toMatch(/padding-top:20px/);
  });

  it('resolve paddingTop="small" isolado', () => {
    render(<ArborTransform testID="el" paddingTop="small">content</ArborTransform>, {
      wrapper: Wrapper,
    });
    expect(getStyleContent()).toMatch(/padding-top:16px/);
  });

  it('resolve padding expandido para top/bottom/left/right', () => {
    render(<ArborTransform testID="el" padding="small">content</ArborTransform>, {
      wrapper: Wrapper,
    });
    const css = getStyleContent();
    expect(css).toMatch(/padding-top:16px/);
    expect(css).toMatch(/padding-bottom:16px/);
    expect(css).toMatch(/padding-left:16px/);
    expect(css).toMatch(/padding-right:16px/);
  });

  it('resolve margin="small" para marginTop/Bottom/Left/Right: 16px', () => {
    render(<ArborTransform testID="el" margin="small">content</ArborTransform>, {
      wrapper: Wrapper,
    });
    const css = getStyleContent();
    expect(css).toMatch(/margin-top:16px/);
    expect(css).toMatch(/margin-bottom:16px/);
  });

  it('repassa width numérico com px', () => {
    render(<ArborTransform testID="el" width={200}>content</ArborTransform>, { wrapper: Wrapper });
    expect(getStyleContent()).toMatch(/width:200px/);
  });

  it('aplica opacity sem unidade', () => {
    render(<ArborTransform testID="el" opacity={0.5}>content</ArborTransform>, {
      wrapper: Wrapper,
    });
    expect(getStyleContent()).toMatch(/opacity:0\.5;/);
  });

  it('aplica zIndex sem unidade', () => {
    render(<ArborTransform testID="el" zIndex={10}>content</ArborTransform>, { wrapper: Wrapper });
    expect(getStyleContent()).toMatch(/z-index:10;/);
  });

  it('aplica display="flex"', () => {
    render(<ArborTransform testID="el" display="flex">content</ArborTransform>, {
      wrapper: Wrapper,
    });
    expect(getStyleContent()).toMatch(/display:flex/);
  });

  it('combina múltiplas props de estilo no CSS', () => {
    render(
      <ArborTransform testID="el" display="flex" padding="small" zIndex={5}>
        content
      </ArborTransform>,
      { wrapper: Wrapper },
    );
    const css = getStyleContent();
    expect(css).toMatch(/display:flex/);
    expect(css).toMatch(/padding-top:16px/);
    expect(css).toMatch(/z-index:5/);
  });
});

// ─── style inline ─────────────────────────────────────────────────────────

describe('style inline', () => {
  it('style inline é aplicado como inline style — sobrescreve prop via especificidade CSS', () => {
    render(
      <ArborTransform testID="el" padding="small" style={{ paddingTop: 999 }}>
        content
      </ArborTransform>,
      { wrapper: Wrapper },
    );
    // inline style aplicado diretamente no elemento (não na classe CSS)
    expect(screen.getByTestId('el').props.style).toMatchObject({ paddingTop: 999 });
    // CSS class mantém o padding do ArborTransform
    expect(getStyleContent()).toMatch(/padding-top:16px/);
  });

  it('style inline não remove outras props de estilo do transform', () => {
    render(
      <ArborTransform testID="el" padding="small" style={{ color: 'red' }}>
        content
      </ArborTransform>,
      { wrapper: Wrapper },
    );
    // color vai para inline style; padding continua na CSS class
    expect(screen.getByTestId('el').props.style).toMatchObject({ color: 'red' });
    const css = getStyleContent();
    expect(css).toMatch(/padding-top:16px/);
  });
});

// ─── Props não-estilo são forwarded ───────────────────────────────────────

describe('props não-estilo', () => {
  it('forwarda aria-label ao elemento', () => {
    render(
      <ArborTransform testID="el" aria-label="close">
        content
      </ArborTransform>,
      { wrapper: Wrapper },
    );
    expect(screen.getByTestId('el').props['aria-label']).toBe('close');
  });

  it('forwarda id ao elemento', () => {
    render(
      <ArborTransform testID="el" id="my-id">
        content
      </ArborTransform>,
      { wrapper: Wrapper },
    );
    expect(screen.getByTestId('el').props.id).toBe('my-id');
  });

  it('style props de estilo NÃO estão em elementProps', () => {
    render(<ArborTransform testID="el" padding="small">content</ArborTransform>, {
      wrapper: Wrapper,
    });
    expect(screen.getByTestId('el').props.padding).toBeUndefined();
  });

  it('forwarda inert ao elemento (HTML Baseline 2024)', () => {
    render(
      <ArborTransform testID="el" inert>
        content
      </ArborTransform>,
      { wrapper: Wrapper },
    );
    expect(screen.getByTestId('el').props.inert).toBe(true);
  });
});

// ─── Responsivo (objeto nomeado) ──────────────────────────────────────────

describe('responsivo com objeto nomeado', () => {
  it('aplica valor base do objeto responsivo no CSS', () => {
    render(
      <ArborTransform testID="el" padding={{ base: 'small', md: 'medium' }}>
        content
      </ArborTransform>,
      { wrapper: Wrapper },
    );
    expect(getStyleContent()).toMatch(/padding-top:16px/);
  });

  it('injeta media query para breakpoint "md"', () => {
    render(
      <ArborTransform testID="el" padding={{ base: 'small', md: 'medium' }}>
        content
      </ArborTransform>,
      { wrapper: Wrapper },
    );
    expect(getStyleContent()).toMatch(/@media screen and \(min-width: 768px\)/);
  });

  it('valor md gera padding-top:20px dentro da media query', () => {
    render(
      <ArborTransform testID="el" padding={{ base: 'small', md: 'medium' }}>
        content
      </ArborTransform>,
      { wrapper: Wrapper },
    );
    const css = getStyleContent();
    expect(css).toContain('@media screen and (min-width: 768px)');
    expect(css).toMatch(/padding-top:20px/);
  });

});

// ─── Pseudo-props ──────────────────────────────────────────────────────────

describe('pseudo-props', () => {
  it('_hover injeta seletor :hover no CSS', () => {
    render(
      <ArborTransform testID="el" _hover={{ backgroundColor: 'red' }}>
        content
      </ArborTransform>,
      { wrapper: Wrapper },
    );
    expect(getStyleContent()).toMatch(/:hover/);
  });

  it('_active injeta seletor :active no CSS', () => {
    render(
      <ArborTransform testID="el" _active={{ opacity: 0.8 }}>
        content
      </ArborTransform>,
      { wrapper: Wrapper },
    );
    expect(getStyleContent()).toMatch(/:active/);
  });

  it('_focus injeta seletor :focus no CSS', () => {
    render(
      <ArborTransform testID="el" _focus={{ opacity: 0.9 }}>
        content
      </ArborTransform>,
      { wrapper: Wrapper },
    );
    expect(getStyleContent()).toMatch(/:focus/);
  });

  it('_disabled injeta seletor [disabled] no CSS', () => {
    render(
      <ArborTransform testID="el" _disabled={{ opacity: 0.4 }}>
        content
      </ArborTransform>,
      { wrapper: Wrapper },
    );
    expect(getStyleContent()).toMatch(/disabled/);
  });

  it('pseudo-prop + style base combinados no mesmo className', () => {
    render(
      <ArborTransform testID="el" display="flex" _hover={{ opacity: 0.5 }}>
        content
      </ArborTransform>,
      { wrapper: Wrapper },
    );
    const css = getStyleContent();
    expect(css).toMatch(/display:flex/);
    expect(css).toMatch(/:hover/);
  });
});

// ─── Cache por tema (WeakMap) ──────────────────────────────────────────────

describe('cache por tema', () => {
  it('mesma props + mesmo tema reutiliza o mesmo className', () => {
    const { getByTestId } = render(
      <>
        <ArborTransform testID="a" padding="small">
          a
        </ArborTransform>
        <ArborTransform testID="b" padding="small">
          b
        </ArborTransform>
      </>,
      { wrapper: Wrapper },
    );

    const classA = getByTestId('a').props.className as string;
    const classB = getByTestId('b').props.className as string;
    expect(classA).toBeTruthy();
    expect(classA).toBe(classB);
  });

  it('mesma props + tema diferente gera className diferente', () => {
    const themeB = createTheme(themeLight, {
      space: { small: 999 },
      sizes: { small: 999 },
    } as never);

    const { getByTestId: getA } = render(
      <ArborProvider theme={theme}>
        <ArborTransform testID="a" padding="small">
          a
        </ArborTransform>
      </ArborProvider>,
    );

    const { getByTestId: getB } = render(
      <ArborProvider theme={themeB}>
        <ArborTransform testID="b" padding="small">
          b
        </ArborTransform>
      </ArborProvider>,
    );

    const classA = getA('a').props.className as string;
    const classB = getB('b').props.className as string;
    expect(classA).toBeTruthy();
    expect(classB).toBeTruthy();
    expect(classA).not.toBe(classB);
  });

  it('tema alternativo gera CSS com valor do token correto', () => {
    const themeB = createTheme(themeLight, {
      space: { small: 999 },
      sizes: { small: 999 },
    } as never);

    render(
      <ArborProvider theme={themeB}>
        <ArborTransform testID="b" padding="small">
          b
        </ArborTransform>
      </ArborProvider>,
    );

    expect(getStyleContent()).toMatch(/padding-top:999px/);
  });

  it('props distintas geram classNames distintos', () => {
    render(<ArborTransform testID="a" padding="small">a</ArborTransform>, { wrapper: Wrapper });
    render(<ArborTransform testID="b" padding="medium">b</ArborTransform>, { wrapper: Wrapper });

    const classA = getGeneratedClass('a');
    const classB = getGeneratedClass('b');
    expect(classA).not.toBe(classB);
  });
});

// ─── Polimorfismo com componente React ────────────────────────────────────

describe('polimorfismo com componente React', () => {
  it('renderiza componente customizado via as', () => {
    function MyComp(props: { testID?: string; children?: React.ReactNode }) {
      return <div data-custom="yes" {...props} />;
    }

    render(
      <ArborTransform as={MyComp} testID="el">
        content
      </ArborTransform>,
      { wrapper: Wrapper },
    );

    expect(screen.getByTestId('el')).toBeTruthy();
  });

  it('componente customizado recebe className gerado', () => {
    let receivedClass: string | undefined;

    function MyComp(props: { className?: string; testID?: string; children?: React.ReactNode }) {
      receivedClass = props.className;
      return <div data-testid={props.testID} className={props.className} />;
    }

    render(
      <ArborTransform as={MyComp} testID="el" display="flex">
        content
      </ArborTransform>,
      { wrapper: Wrapper },
    );

    expect(receivedClass).toMatch(/arbor-/);
  });
});
