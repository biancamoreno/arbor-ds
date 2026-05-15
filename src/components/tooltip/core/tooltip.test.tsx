import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Tooltip } from './tooltip';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

function renderTooltip(ui: React.ReactElement) {
  return render(ui, { wrapper: Wrapper });
}

describe('Tooltip', () => {
  it('hides content by default', () => {
    renderTooltip(
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button type="button">Trigger</button>
        </Tooltip.Trigger>
        <Tooltip.Content>Tooltip text</Tooltip.Content>
      </Tooltip.Root>,
    );

    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('shows content on mouseenter', () => {
    renderTooltip(
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button type="button">Trigger</button>
        </Tooltip.Trigger>
        <Tooltip.Content>Tooltip text</Tooltip.Content>
      </Tooltip.Root>,
    );

    fireEvent.mouseEnter(screen.getByRole('button'));
    expect(screen.getByRole('tooltip')).toBeTruthy();
    expect(screen.getByText('Tooltip text')).toBeTruthy();
  });

  it('hides content on mouseleave', () => {
    renderTooltip(
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button type="button">Trigger</button>
        </Tooltip.Trigger>
        <Tooltip.Content>Tooltip text</Tooltip.Content>
      </Tooltip.Root>,
    );

    fireEvent.mouseEnter(screen.getByRole('button'));
    expect(screen.getByRole('tooltip')).toBeTruthy();

    fireEvent.mouseLeave(screen.getByRole('button'));
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('shows content on focus', () => {
    renderTooltip(
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button type="button">Trigger</button>
        </Tooltip.Trigger>
        <Tooltip.Content>Tooltip text</Tooltip.Content>
      </Tooltip.Root>,
    );

    fireEvent.focus(screen.getByRole('button'));
    expect(screen.getByRole('tooltip')).toBeTruthy();
  });

  it('hides content on blur', () => {
    renderTooltip(
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button type="button">Trigger</button>
        </Tooltip.Trigger>
        <Tooltip.Content>Tooltip text</Tooltip.Content>
      </Tooltip.Root>,
    );

    fireEvent.focus(screen.getByRole('button'));
    fireEvent.blur(screen.getByRole('button'));
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('respects disabled state', () => {
    renderTooltip(
      <Tooltip.Root disabled>
        <Tooltip.Trigger asChild>
          <button type="button">Trigger</button>
        </Tooltip.Trigger>
        <Tooltip.Content>Tooltip text</Tooltip.Content>
      </Tooltip.Root>,
    );

    fireEvent.mouseEnter(screen.getByRole('button'));
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('has role=tooltip and aria-describedby on trigger', () => {
    renderTooltip(
      <Tooltip.Root defaultOpen>
        <Tooltip.Trigger asChild>
          <button type="button">Trigger</button>
        </Tooltip.Trigger>
        <Tooltip.Content>Tooltip text</Tooltip.Content>
      </Tooltip.Root>,
    );

    const tooltip = screen.getByRole('tooltip');
    const trigger = screen.getByRole('button');
    expect(trigger.getAttribute('aria-describedby')).toBe(tooltip.getAttribute('id'));
  });

  it('renders content in document.body via portal (escapes overflow:hidden ancestor)', () => {
    renderTooltip(
      <div data-testid="clip" style={{ overflow: 'hidden', width: 50, height: 50 }}>
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger asChild>
            <button type="button">Trigger</button>
          </Tooltip.Trigger>
          <Tooltip.Content>Tooltip text</Tooltip.Content>
        </Tooltip.Root>
      </div>,
    );

    const tooltip = screen.getByRole('tooltip');
    const clip = screen.getByTestId('clip');
    expect(clip.contains(tooltip)).toBe(false);
    expect(document.body.contains(tooltip)).toBe(true);
  });

  it('renders with different placements', () => {
    renderTooltip(
      <Tooltip.Root defaultOpen>
        <Tooltip.Trigger asChild>
          <button type="button">Trigger</button>
        </Tooltip.Trigger>
        <Tooltip.Content placement="bottom">Tooltip below</Tooltip.Content>
      </Tooltip.Root>,
    );

    expect(screen.getByRole('tooltip')).toBeTruthy();
  });

  it('consome a slot recipe tooltip (className gerado pelo motor)', () => {
    renderTooltip(
      <Tooltip.Root defaultOpen>
        <Tooltip.Trigger asChild>
          <button type="button">Trigger</button>
        </Tooltip.Trigger>
        <Tooltip.Content>Tooltip text</Tooltip.Content>
      </Tooltip.Root>,
    );
    const tooltip = screen.getByRole('tooltip');
    // O motor (createStyledComponent) injeta as regras de estilo da recipe
    // em uma <style> em document.head e aplica `class="arbor-N"` no elemento.
    expect(tooltip.className).toMatch(/arbor-/);
    // Regras CSS injetadas devem mencionar paddingInline (consumido via $tooltip.padding.inline).
    const sheet = document.getElementById('arbor-style-engine');
    expect(sheet?.textContent).toMatch(/padding-left|padding-inline/);
    expect(sheet?.textContent).toMatch(/background-color/);
  });

  it('delay prop sobrescreve o token themable de delay.show', () => {
    renderTooltip(
      <Tooltip.Root defaultOpen delay={50}>
        <Tooltip.Trigger asChild>
          <button type="button">Trigger</button>
        </Tooltip.Trigger>
        <Tooltip.Content>Tooltip text</Tooltip.Content>
      </Tooltip.Root>,
    );
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip.style.transitionDelay).toBe('50ms');
  });

  it('prefers-reduced-motion: transition=none (degradação)', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query.includes('reduce'),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;

    try {
      renderTooltip(
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger asChild>
            <button type="button">Trigger</button>
          </Tooltip.Trigger>
          <Tooltip.Content>Tooltip text</Tooltip.Content>
        </Tooltip.Root>,
      );
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.style.transition).toBe('none');
    } finally {
      window.matchMedia = originalMatchMedia;
    }
  });

  it('flipa placement quando o trigger está colado à borda do viewport', async () => {
    // Mock: trigger com getBoundingClientRect que retorna posição colada ao TOP.
    const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
    const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
    const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');

    // Trigger no topo (top=0) + tooltip com altura suposta > top → deve flipar.
    HTMLElement.prototype.getBoundingClientRect = function () {
      // Trigger button no topo absoluto
      if ((this as HTMLElement).tagName === 'BUTTON') {
        return { top: 0, left: 100, right: 200, bottom: 30, width: 100, height: 30, x: 100, y: 0, toJSON: () => ({}) } as DOMRect;
      }
      return originalGetBoundingClientRect.call(this);
    };
    // Tooltip mede 40x80 (altura > top do trigger → não cabe acima).
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, get: () => 80 });
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, get: () => 40 });

    try {
      renderTooltip(
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger asChild>
            <button type="button">Trigger</button>
          </Tooltip.Trigger>
          <Tooltip.Content placement="top">Tooltip text</Tooltip.Content>
        </Tooltip.Root>,
      );

      // Após o useLayoutEffect medir, o tooltip deve aparecer abaixo do trigger
      // (top > 0, com offset). Antes do flip, seria top < 0.
      await new Promise<void>((resolve) => setTimeout(resolve, 50));
      const tooltip = screen.getByRole('tooltip');
      const topPx = Number((tooltip.style.top as string).toString().replace('px', ''));
      // Pediu placement='top' mas viewport não cabe → flipou para 'bottom' → top > 0.
      expect(topPx).toBeGreaterThan(0);
    } finally {
      HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
      if (originalOffsetWidth) Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
      if (originalOffsetHeight) Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight);
    }
  });

  it('wraps long content into multiple lines (whiteSpace=normal, wordBreak=break-word)', () => {
    renderTooltip(
      <Tooltip.Root defaultOpen>
        <Tooltip.Trigger asChild>
          <button type="button">Trigger</button>
        </Tooltip.Trigger>
        <Tooltip.Content maxWidth={120}>
          Texto longo que deve quebrar em várias linhas dentro do limite maxWidth.
        </Tooltip.Content>
      </Tooltip.Root>,
    );

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip.style.whiteSpace).toBe('normal');
    expect(tooltip.style.wordBreak).toBe('break-word');
  });
});

describe('Tooltip flat API (label prop + children=trigger)', () => {
  it('mounts content on hover via flat API', () => {
    renderTooltip(
      <Tooltip label="Dica útil">
        <button type="button">Trigger</button>
      </Tooltip>,
    );
    expect(screen.queryByRole('tooltip')).toBeNull();
    fireEvent.mouseEnter(screen.getByText('Trigger'));
    expect(screen.getByRole('tooltip')).toBeTruthy();
    expect(screen.getByText('Dica útil')).toBeTruthy();
  });

  it('respects placement prop in flat API', () => {
    renderTooltip(
      <Tooltip label="Right tip" placement="right">
        <button type="button">Trigger</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByText('Trigger'));
    expect(screen.getByRole('tooltip')).toBeTruthy();
  });

  it('compound API continua disponível quando label é undefined', () => {
    renderTooltip(
      <Tooltip>
        <Tooltip.Trigger asChild>
          <button type="button">Compound</button>
        </Tooltip.Trigger>
        <Tooltip.Content>Custom content</Tooltip.Content>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByText('Compound'));
    expect(screen.getByRole('tooltip')).toBeTruthy();
    expect(screen.getByText('Custom content')).toBeTruthy();
  });
});
