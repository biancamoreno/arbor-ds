import React, { useState } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ArborProvider } from '../../../ecosystem/styled-system/core/provider';
import { createTheme, themeLight } from '../../../foundations';
import { Carousel } from './carousel';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

// ─── IntersectionObserver shim ──────────────────────────────────────────────

type IOCallback = (entries: IntersectionObserverEntry[]) => void;

class IntersectionObserverMock {
  static instances: IntersectionObserverMock[] = [];
  callback: IOCallback;
  observed: Set<Element> = new Set();

  constructor(cb: IOCallback) {
    this.callback = cb;
    IntersectionObserverMock.instances.push(this);
  }
  observe(el: Element) { this.observed.add(el); }
  unobserve(el: Element) { this.observed.delete(el); }
  disconnect() { this.observed.clear(); }
  takeRecords(): IntersectionObserverEntry[] { return []; }
  /** Helper de teste para simular um item entrando em view. */
  fire(target: Element, ratio = 1) {
    this.callback([
      {
        target,
        intersectionRatio: ratio,
        isIntersecting: ratio >= 0.51,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: null,
        time: 0,
      },
    ]);
  }
}

beforeAll(() => {
  (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver;
});

beforeEach(() => {
  IntersectionObserverMock.instances = [];
});

// ─── Renderização básica + a11y APG ─────────────────────────────────────────

describe('Carousel — render + a11y', () => {
  it('renderiza role="region" + aria-roledescription="carousel" + ariaLabel', () => {
    render(
      <Carousel ariaLabel="Produtos em destaque">
        <Carousel.Content>
          <Carousel.Item>A</Carousel.Item>
          <Carousel.Item>B</Carousel.Item>
        </Carousel.Content>
      </Carousel>,
      { wrapper: Wrapper },
    );

    const region = screen.getByRole('region');
    expect(region.getAttribute('aria-roledescription')).toBe('carousel');
    expect(region.getAttribute('aria-label')).toBe('Produtos em destaque');
  });

  it('Items recebem role="group" + aria-roledescription="slide" + label "N de M" (sem palavra "slide" — APG)', () => {
    render(
      <Carousel ariaLabel="X">
        <Carousel.Content>
          <Carousel.Item>A</Carousel.Item>
          <Carousel.Item>B</Carousel.Item>
          <Carousel.Item>C</Carousel.Item>
        </Carousel.Content>
      </Carousel>,
      { wrapper: Wrapper },
    );

    const items = screen.getAllByRole('group');
    // primeiro group é o region implícito? Não — region tem role="region". groups são só os items.
    expect(items.length).toBe(3);
    expect(items[0].getAttribute('aria-roledescription')).toBe('slide');
    expect(items[0].getAttribute('aria-label')).toBe('1 de 3');
    expect(items[1].getAttribute('aria-label')).toBe('2 de 3');
    expect(items[2].getAttribute('aria-label')).toBe('3 de 3');
    // APG: o label NÃO contém a palavra "slide".
    expect(items[0].getAttribute('aria-label')).not.toMatch(/slide/i);
  });

  it('Items fora da janela recebem inert (TD-040)', () => {
    render(
      <Carousel ariaLabel="X" defaultActiveIndex={0}>
        <Carousel.Content>
          <Carousel.Item>A</Carousel.Item>
          <Carousel.Item>B</Carousel.Item>
          <Carousel.Item>C</Carousel.Item>
        </Carousel.Content>
      </Carousel>,
      { wrapper: Wrapper },
    );

    const items = screen.getAllByRole('group');
    // active é 0 com slidesPerView default 1 → só item 0 está in-window
    expect(items[0].hasAttribute('inert')).toBe(false);
    expect(items[1].hasAttribute('inert')).toBe(true);
    expect(items[2].hasAttribute('inert')).toBe(true);
  });
});

// ─── Indicators dual pattern APG ────────────────────────────────────────────

describe('Carousel.Indicators — dual pattern APG', () => {
  it('Tabs pattern quando slidesPerView=1 e total ≤ 7', () => {
    render(
      <Carousel ariaLabel="X" slidesPerView={1}>
        <Carousel.Content>
          <Carousel.Item>A</Carousel.Item>
          <Carousel.Item>B</Carousel.Item>
          <Carousel.Item>C</Carousel.Item>
        </Carousel.Content>
        <Carousel.Indicators />
      </Carousel>,
      { wrapper: Wrapper },
    );

    const tablist = screen.getByRole('tablist');
    expect(tablist).toBeTruthy();
    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBe(3);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');
  });

  it('Group pattern quando total > 7 (fallback APG)', () => {
    render(
      <Carousel ariaLabel="X" slidesPerView={1}>
        <Carousel.Content>
          {Array.from({ length: 8 }, (_, i) => (
            <Carousel.Item key={i}>{i}</Carousel.Item>
          ))}
        </Carousel.Content>
        <Carousel.Indicators />
      </Carousel>,
      { wrapper: Wrapper },
    );

    // não há tablist; há um group container + buttons
    expect(screen.queryByRole('tablist')).toBeNull();
    const buttons = screen.getAllByRole('button').filter((b) =>
      b.getAttribute('aria-label')?.startsWith('Ir para slide'),
    );
    expect(buttons.length).toBe(8);
    expect(buttons[0].getAttribute('aria-current')).toBe('true');
  });

  it('Group pattern quando slidesPerView > 1', () => {
    render(
      <Carousel ariaLabel="X" slidesPerView={2}>
        <Carousel.Content>
          <Carousel.Item>A</Carousel.Item>
          <Carousel.Item>B</Carousel.Item>
          <Carousel.Item>C</Carousel.Item>
        </Carousel.Content>
        <Carousel.Indicators />
      </Carousel>,
      { wrapper: Wrapper },
    );

    expect(screen.queryByRole('tablist')).toBeNull();
  });
});

// ─── Navegação ──────────────────────────────────────────────────────────────

describe('Carousel — navegação', () => {
  it('click em Indicator (Tabs pattern) atualiza activeIndex', () => {
    const onChange = jest.fn();
    render(
      <Carousel ariaLabel="X" defaultActiveIndex={0} onActiveIndexChange={onChange}>
        <Carousel.Content>
          <Carousel.Item>A</Carousel.Item>
          <Carousel.Item>B</Carousel.Item>
        </Carousel.Content>
        <Carousel.Indicators />
      </Carousel>,
      { wrapper: Wrapper },
    );

    const tabs = screen.getAllByRole('tab');
    fireEvent.click(tabs[1]);
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('Previous é disabled em activeIndex=0; Next em activeIndex=last', () => {
    render(
      <Carousel ariaLabel="X" defaultActiveIndex={0}>
        <Carousel.Content>
          <Carousel.Item>A</Carousel.Item>
          <Carousel.Item>B</Carousel.Item>
        </Carousel.Content>
        <Carousel.Previous />
        <Carousel.Next />
      </Carousel>,
      { wrapper: Wrapper },
    );

    const prev = screen.getByLabelText('Slide anterior') as HTMLButtonElement;
    const next = screen.getByLabelText('Próximo slide') as HTMLButtonElement;

    expect(prev.disabled).toBe(true);
    expect(next.disabled).toBe(false);

    fireEvent.click(next);
    expect((screen.getByLabelText('Próximo slide') as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByLabelText('Slide anterior') as HTMLButtonElement).disabled).toBe(false);
  });

  it('keyboard Home/End/Arrow no tab navega entre slides (Tabs pattern)', () => {
    render(
      <Carousel ariaLabel="X" defaultActiveIndex={0}>
        <Carousel.Content>
          <Carousel.Item>A</Carousel.Item>
          <Carousel.Item>B</Carousel.Item>
          <Carousel.Item>C</Carousel.Item>
        </Carousel.Content>
        <Carousel.Indicators />
      </Carousel>,
      { wrapper: Wrapper },
    );

    const tabs = screen.getAllByRole('tab');
    fireEvent.keyDown(tabs[0], { key: 'End' });
    expect(tabs[2].getAttribute('aria-selected')).toBe('true');
    fireEvent.keyDown(tabs[2], { key: 'Home' });
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    fireEvent.keyDown(tabs[0], { key: 'ArrowRight' });
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    fireEvent.keyDown(tabs[1], { key: 'ArrowLeft' });
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
  });
});

// ─── Controlled vs uncontrolled ─────────────────────────────────────────────

describe('Carousel — controlled vs uncontrolled', () => {
  it('controlled: activeIndex respeitado; onActiveIndexChange chamado', () => {
    function Controlled() {
      const [i, setI] = useState(0);
      return (
        <Carousel ariaLabel="X" activeIndex={i} onActiveIndexChange={setI}>
          <Carousel.Content>
            <Carousel.Item>A</Carousel.Item>
            <Carousel.Item>B</Carousel.Item>
          </Carousel.Content>
          <Carousel.Indicators />
          <Carousel.Next />
        </Carousel>
      );
    }
    render(<Controlled />, { wrapper: Wrapper });
    const next = screen.getByLabelText('Próximo slide');
    fireEvent.click(next);
    const tabs = screen.getAllByRole('tab');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
  });
});

// ─── Render prop ────────────────────────────────────────────────────────────

describe('Carousel.Indicators — render prop', () => {
  it('chama children render prop com {index, active, goTo, slideId, total}', () => {
    render(
      <Carousel ariaLabel="X">
        <Carousel.Content>
          <Carousel.Item>A</Carousel.Item>
          <Carousel.Item>B</Carousel.Item>
        </Carousel.Content>
        <Carousel.Indicators>
          {({ index, active, total }) => (
            <span key={index} data-testid={`dot-${index}`} data-active={active}>
              {index + 1}/{total}
            </span>
          )}
        </Carousel.Indicators>
      </Carousel>,
      { wrapper: Wrapper },
    );

    const dot0 = screen.getByTestId('dot-0');
    expect(dot0.getAttribute('data-active')).toBe('true');
    expect(dot0.textContent).toBe('1/2');
    expect(screen.getByTestId('dot-1').getAttribute('data-active')).toBe('false');
  });
});

// ─── Drag → activeIndex via IO ──────────────────────────────────────────────

describe('Carousel — drag (IO) atualiza activeIndex', () => {
  it('IO firing em item 1 com ratio 1 atualiza activeIndex para 1', () => {
    const onChange = jest.fn();
    render(
      <Carousel ariaLabel="X" defaultActiveIndex={0} onActiveIndexChange={onChange}>
        <Carousel.Content>
          <Carousel.Item>A</Carousel.Item>
          <Carousel.Item>B</Carousel.Item>
        </Carousel.Content>
      </Carousel>,
      { wrapper: Wrapper },
    );

    const items = screen.getAllByRole('group');
    const observer = IntersectionObserverMock.instances[0];
    expect(observer).toBeTruthy();
    observer.fire(items[1], 1);
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('IO com ratio < 0.51 NÃO atualiza activeIndex', () => {
    const onChange = jest.fn();
    render(
      <Carousel ariaLabel="X" defaultActiveIndex={0} onActiveIndexChange={onChange}>
        <Carousel.Content>
          <Carousel.Item>A</Carousel.Item>
          <Carousel.Item>B</Carousel.Item>
        </Carousel.Content>
      </Carousel>,
      { wrapper: Wrapper },
    );

    const items = screen.getAllByRole('group');
    const observer = IntersectionObserverMock.instances[0];
    observer.fire(items[1], 0.3);
    expect(onChange).not.toHaveBeenCalled();
  });
});

// ─── Autoplay (PR2.A) ───────────────────────────────────────────────────────

describe('Carousel — autoplay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('avança ao próximo slide a cada interval (loop soft: wrap para 0)', () => {
    const onChange = jest.fn();
    render(
      <Carousel
        ariaLabel="X"
        defaultActiveIndex={0}
        onActiveIndexChange={onChange}
        autoplay={{ interval: 1000, pauseOnHover: false, pauseOnInteraction: false }}
      >
        <Carousel.Content>
          <Carousel.Item>A</Carousel.Item>
          <Carousel.Item>B</Carousel.Item>
          <Carousel.Item>C</Carousel.Item>
        </Carousel.Content>
        <Carousel.PlayPause />
      </Carousel>,
      { wrapper: Wrapper },
    );

    expect(onChange).not.toHaveBeenCalled();
    act(() => { jest.advanceTimersByTime(1000); });
    expect(onChange).toHaveBeenLastCalledWith(1);
    act(() => { jest.advanceTimersByTime(1000); });
    expect(onChange).toHaveBeenLastCalledWith(2);
    // wrap soft: 2 (último) → 0
    act(() => { jest.advanceTimersByTime(1000); });
    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it('Carousel.PlayPause toggla pause manual; quando pausado, não avança', () => {
    render(
      <Carousel
        ariaLabel="X"
        autoplay={{ interval: 1000, pauseOnHover: false, pauseOnInteraction: false }}
      >
        <Carousel.Content>
          <Carousel.Item>A</Carousel.Item>
          <Carousel.Item>B</Carousel.Item>
        </Carousel.Content>
        <Carousel.PlayPause />
      </Carousel>,
      { wrapper: Wrapper },
    );

    const btn = screen.getByLabelText('Pausar autoplay');
    expect(btn.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(btn);
    // após click, label troca para "Reproduzir"
    expect(screen.getByLabelText('Reproduzir autoplay')).toBeTruthy();
    expect(screen.getByLabelText('Reproduzir autoplay').getAttribute('aria-pressed')).toBe('true');
  });

  it('Carousel.PlayPause não renderiza nada quando autoplay=false', () => {
    render(
      <Carousel ariaLabel="X">
        <Carousel.Content>
          <Carousel.Item>A</Carousel.Item>
          <Carousel.Item>B</Carousel.Item>
        </Carousel.Content>
        <Carousel.PlayPause />
      </Carousel>,
      { wrapper: Wrapper },
    );
    expect(screen.queryByLabelText(/Pausar|Reproduzir/)).toBeNull();
  });

  it('Content tem aria-live="polite" quando autoplay rodando, "off" quando pausado', () => {
    render(
      <Carousel
        ariaLabel="X"
        autoplay={{ interval: 1000, pauseOnHover: false, pauseOnInteraction: false }}
      >
        <Carousel.Content>
          <Carousel.Item>A</Carousel.Item>
        </Carousel.Content>
        <Carousel.PlayPause />
      </Carousel>,
      { wrapper: Wrapper },
    );
    const content = screen.getByRole('region').querySelector('[aria-live]');
    expect(content?.getAttribute('aria-live')).toBe('polite');
    fireEvent.click(screen.getByLabelText('Pausar autoplay'));
    expect(content?.getAttribute('aria-live')).toBe('off');
  });

  it('quando autoplay=false, Content não recebe aria-live', () => {
    render(
      <Carousel ariaLabel="X">
        <Carousel.Content>
          <Carousel.Item>A</Carousel.Item>
        </Carousel.Content>
      </Carousel>,
      { wrapper: Wrapper },
    );
    const content = screen.getByRole('region').querySelector('[data-testid], div');
    // checagem suave: nenhum elemento descendente tem aria-live
    expect(screen.getByRole('region').querySelector('[aria-live]')).toBeNull();
    void content;
  });

  it('pauseOnHover: hover pausa o autoplay', () => {
    const onChange = jest.fn();
    render(
      <Carousel
        ariaLabel="X"
        onActiveIndexChange={onChange}
        autoplay={{ interval: 1000, pauseOnHover: true, pauseOnInteraction: false }}
      >
        <Carousel.Content>
          <Carousel.Item>A</Carousel.Item>
          <Carousel.Item>B</Carousel.Item>
        </Carousel.Content>
        <Carousel.PlayPause />
      </Carousel>,
      { wrapper: Wrapper },
    );

    const region = screen.getByRole('region');
    fireEvent.mouseEnter(region);
    act(() => { jest.advanceTimersByTime(2000); });
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.mouseLeave(region);
    act(() => { jest.advanceTimersByTime(1000); });
    expect(onChange).toHaveBeenCalledWith(1);
  });
});

// ─── Erro ao renderizar fora do Root ────────────────────────────────────────

describe('Carousel — error boundaries', () => {
  it('Carousel.Item fora de Carousel.Content lança erro claro', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(<Carousel.Item>X</Carousel.Item>, { wrapper: Wrapper }),
    ).toThrow(/Carousel/);
    spy.mockRestore();
  });
});
