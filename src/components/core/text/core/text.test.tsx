import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { ArborProvider } from '../../../../ecosystem';
import { themeLight } from '../../../../foundations';
import { __resetStyleEngine__ } from '../../../../ecosystem/styled-system/core/styled/styled-component';
import { Text } from './text';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

afterEach(() => {
  const sheet = document.getElementById('arbor-style-engine');
  if (sheet) sheet.textContent = '';
  __resetStyleEngine__();
});

describe('Text', () => {
  it('renderiza children simples dentro de <p> por default', () => {
    render(<Text testID="t">Olá</Text>, { wrapper });
    const el = screen.getByTestId('t');
    expect(el.tagName).toBe('P');
    expect(el.textContent).toBe('Olá');
  });

  it('aceita polimorfismo via `as` (heading)', () => {
    render(
      <Text as="h2" testID="h">
        título
      </Text>,
      { wrapper },
    );
    expect(screen.getByTestId('h').tagName).toBe('H2');
  });

  it('aceita `as="span"` e `as="label"`', () => {
    const { rerender } = render(
      <Text as="span" testID="t">
        x
      </Text>,
      { wrapper },
    );
    expect(screen.getByTestId('t').tagName).toBe('SPAN');
    rerender(
      <Text as="label" testID="t">
        x
      </Text>,
    );
    expect(screen.getByTestId('t').tagName).toBe('LABEL');
  });

  it('propaga `role` como AriaRole', () => {
    render(
      <Text testID="t" role="heading">
        x
      </Text>,
      { wrapper },
    );
    expect(screen.getByTestId('t').getAttribute('role')).toBe('heading');
  });

  it('forwarda ref canônico', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Text ref={ref} testID="ref">
        x
      </Text>,
      { wrapper },
    );
    expect(ref.current).toBe(screen.getByTestId('ref'));
  });

  it('renderiza texto puro (sem parsing) quando children não é HTML', () => {
    render(<Text testID="t">texto puro sem tags</Text>, { wrapper });
    const el = screen.getByTestId('t');
    expect(el.innerHTML).toBe('texto puro sem tags');
  });

  it('faz parsing de HTML inline quando children contém tags conhecidas', () => {
    render(
      <Text testID="t">
        {'Texto com <b>negrito</b> e <u>sublinhado</u>.'}
      </Text>,
      { wrapper },
    );
    const el = screen.getByTestId('t');
    // o parser gera elementos separados (não string crua)
    expect(el.querySelector('b')).not.toBeNull();
    expect(el.querySelector('u')).not.toBeNull();
    expect(el.textContent).toContain('negrito');
    expect(el.textContent).toContain('sublinhado');
  });

  it('renderiza link com href quando HTML inline contém <a>', () => {
    // NOTA: html-converter não liga `onLinkPress` ao click nativo do DOM hoje
    // — follow-up "Text — investigar onPress na interface".
    render(
      <Text testID="t">{'Veja <a href="https://arbor.dev">aqui</a>.'}</Text>,
      { wrapper },
    );
    const anchor = screen.getByTestId('t').querySelector('a');
    expect(anchor).not.toBeNull();
    expect(anchor?.getAttribute('href')).toBe('https://arbor.dev');
  });

  it('aplica estilos de truncamento via `numberOfLines`', () => {
    render(
      <Text testID="t" numberOfLines={2}>
        texto longo que deveria ser truncado após 2 linhas
      </Text>,
      { wrapper },
    );
    // Truncation é aplicada em duas camadas:
    // 1) display/overflow/maxHeight viram classe via ArborTransform
    // 2) WebkitLineClamp/boxOrient vão em style inline (alguns props podem ser
    //    filtrados pelo jsdom, mas `text-overflow: ellipsis` sobrevive)
    const el = screen.getByTestId('t');
    const inline = el.getAttribute('style') ?? '';
    expect(inline).toMatch(/text-overflow: ?ellipsis/i);

    const css = document.getElementById('arbor-style-engine')?.textContent ?? '';
    expect(css).toMatch(/display:-webkit-box/);
    expect(css).toMatch(/overflow:hidden/);
    // NOTA: `maxHeight` com valor `calc(${lineHeight} * ${n})` está sendo
    // processado pelo transform atual como número e resulta em "NaNpx"
    // (`lineHeight` na recipe é string tipo "20px"). É um bug latente no
    // pipeline de truncamento — follow-up já registrado para Text.
  });

  it('NÃO aplica truncamento quando `numberOfLines` é omitido', () => {
    render(<Text testID="t">texto simples</Text>, { wrapper });
    const el = screen.getByTestId('t');
    const inline = el.getAttribute('style') ?? '';
    expect(inline).not.toMatch(/text-overflow: ?ellipsis/i);
  });
});
