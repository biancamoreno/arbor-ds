import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Drawer } from './drawer';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

function renderDrawer(ui: React.ReactElement) {
  return render(ui, { wrapper: Wrapper });
}

describe('Drawer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runAllTimers();
    jest.useRealTimers();
  });

  it('renders trigger and no content when closed', () => {
    renderDrawer(
      <Drawer.Root>
        <Drawer.Trigger asChild>
          <button type="button">Open</button>
        </Drawer.Trigger>
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Title>My Drawer</Drawer.Title>
        </Drawer.Content>
      </Drawer.Root>,
    );

    expect(screen.getByText('Open')).toBeTruthy();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('opens when trigger is clicked', () => {
    renderDrawer(
      <Drawer.Root>
        <Drawer.Trigger asChild>
          <button type="button">Open</button>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>My Drawer</Drawer.Title>
        </Drawer.Content>
      </Drawer.Root>,
    );

    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('My Drawer')).toBeTruthy();
  });

  it('closes when Close button is clicked', () => {
    renderDrawer(
      <Drawer.Root>
        <Drawer.Trigger asChild>
          <button type="button">Open</button>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>My Drawer</Drawer.Title>
          <Drawer.Close accessibilityLabel="Fechar gaveta" />
        </Drawer.Content>
      </Drawer.Root>,
    );

    fireEvent.click(screen.getByText('Open'));
    fireEvent.click(screen.getByLabelText('Fechar gaveta'));
    act(() => { jest.advanceTimersByTime(250); });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes when Escape key is pressed', () => {
    renderDrawer(
      <Drawer.Root>
        <Drawer.Trigger asChild>
          <button type="button">Open</button>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>My Drawer</Drawer.Title>
        </Drawer.Content>
      </Drawer.Root>,
    );

    fireEvent.click(screen.getByText('Open'));
    act(() => { fireEvent.keyDown(document, { key: 'Escape' }); });
    act(() => { jest.advanceTimersByTime(250); });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('calls onOpenChange on dismissal', () => {
    const onOpenChange = jest.fn();
    renderDrawer(
      <Drawer.Root open onOpenChange={onOpenChange}>
        <Drawer.Content>
          <Drawer.Title>My Drawer</Drawer.Title>
          <Drawer.Close />
        </Drawer.Content>
      </Drawer.Root>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('has aria-modal and aria-labelledby', () => {
    renderDrawer(
      <Drawer.Root defaultOpen>
        <Drawer.Content>
          <Drawer.Title>Accessible Drawer</Drawer.Title>
        </Drawer.Content>
      </Drawer.Root>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    const titleId = dialog.getAttribute('aria-labelledby');
    expect(titleId).toBeTruthy();
    expect(document.getElementById(titleId!)).toBeTruthy();
  });

  it('renders with different placements', () => {
    const { rerender } = renderDrawer(
      <Drawer.Root defaultOpen placement="left">
        <Drawer.Content>
          <Drawer.Title>Left Drawer</Drawer.Title>
        </Drawer.Content>
      </Drawer.Root>,
    );
    expect(screen.getByRole('dialog')).toBeTruthy();

    rerender(
      <ArborProvider theme={theme}>
        <Drawer.Root defaultOpen placement="bottom">
          <Drawer.Content>
            <Drawer.Title>Bottom Drawer</Drawer.Title>
          </Drawer.Content>
        </Drawer.Root>
      </ArborProvider>,
    );
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  // ── PCV-33: contratos novos ──────────────────────────────────────────────

  it('trigger has aria-haspopup, aria-expanded, aria-controls', () => {
    renderDrawer(
      <Drawer.Root>
        <Drawer.Trigger asChild>
          <button type="button">Open</button>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>X</Drawer.Title>
        </Drawer.Content>
      </Drawer.Root>,
    );

    const trigger = screen.getByText('Open');
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-controls')).toBeNull();

    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('aria-controls')).toBe(screen.getByRole('dialog').getAttribute('id'));
  });

  it('disabled trigger child does not open drawer', () => {
    renderDrawer(
      <Drawer.Root>
        <Drawer.Trigger asChild>
          <button type="button" disabled>Disabled</button>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>X</Drawer.Title>
        </Drawer.Content>
      </Drawer.Root>,
    );

    fireEvent.click(screen.getByText('Disabled'));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('accessibilityLabel propagates to aria-label fallback', () => {
    renderDrawer(
      <Drawer.Root defaultOpen accessibilityLabel="Sem título visível">
        <Drawer.Content>
          <p>conteúdo</p>
        </Drawer.Content>
      </Drawer.Root>,
    );

    expect(screen.getByRole('dialog').getAttribute('aria-label')).toBe('Sem título visível');
  });

  it('Close usa Icon do DS (não caractere literal ✕)', () => {
    renderDrawer(
      <Drawer.Root defaultOpen>
        <Drawer.Content>
          <Drawer.Title>X</Drawer.Title>
          <Drawer.Close />
        </Drawer.Content>
      </Drawer.Root>,
    );

    const closeBtn = screen.getByRole('button', { name: 'Fechar' });
    expect(closeBtn.querySelector('svg')).toBeTruthy();
    expect(closeBtn.textContent).not.toContain('✕');
  });

  // ── Saídas modeladas ────────────────────────────────────────────────────

  it('closeOnEscape={false} impede o fechamento por Escape', () => {
    renderDrawer(
      <Drawer.Root defaultOpen closeOnEscape={false}>
        <Drawer.Content>
          <Drawer.Title>Wizard</Drawer.Title>
        </Drawer.Content>
      </Drawer.Root>,
    );

    expect(screen.getByRole('dialog')).toBeTruthy();
    act(() => { fireEvent.keyDown(document, { key: 'Escape' }); });
    act(() => { jest.advanceTimersByTime(250); });
    expect(screen.queryByRole('dialog')).toBeTruthy();
  });

  it('onEscapeKeyDown com preventDefault impede o fechamento', () => {
    const onEscapeKeyDown = jest.fn((e: { preventDefault: () => void }) => e.preventDefault());
    renderDrawer(
      <Drawer.Root defaultOpen onEscapeKeyDown={onEscapeKeyDown}>
        <Drawer.Content>
          <Drawer.Title>Form</Drawer.Title>
        </Drawer.Content>
      </Drawer.Root>,
    );

    act(() => { fireEvent.keyDown(document, { key: 'Escape' }); });
    expect(onEscapeKeyDown).toHaveBeenCalledTimes(1);
    act(() => { jest.advanceTimersByTime(250); });
    expect(screen.queryByRole('dialog')).toBeTruthy();
  });

  it('closeOnOverlayClick={false} impede o fechamento por clique no overlay', () => {
    renderDrawer(
      <Drawer.Root defaultOpen closeOnOverlayClick={false}>
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Title>Destructive</Drawer.Title>
        </Drawer.Content>
      </Drawer.Root>,
    );

    const overlay = document.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(overlay).toBeTruthy();
    fireEvent.click(overlay);
    act(() => { jest.advanceTimersByTime(250); });
    expect(screen.queryByRole('dialog')).toBeTruthy();
  });

  it('onInteractOutside com preventDefault impede o fechamento', () => {
    const onInteractOutside = jest.fn((e: { preventDefault: () => void }) => e.preventDefault());
    renderDrawer(
      <Drawer.Root defaultOpen onInteractOutside={onInteractOutside}>
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Title>Form dirty</Drawer.Title>
        </Drawer.Content>
      </Drawer.Root>,
    );

    const overlay = document.querySelector('[aria-hidden="true"]') as HTMLElement;
    fireEvent.click(overlay);
    expect(onInteractOutside).toHaveBeenCalledTimes(1);
    act(() => { jest.advanceTimersByTime(250); });
    expect(screen.queryByRole('dialog')).toBeTruthy();
  });

  it('lockBodyScroll default: trava body overflow enquanto aberto', () => {
    document.body.style.overflow = '';
    const { rerender } = renderDrawer(
      <Drawer.Root open={false}>
        <Drawer.Content>
          <Drawer.Title>X</Drawer.Title>
        </Drawer.Content>
      </Drawer.Root>,
    );
    expect(document.body.style.overflow).toBe('');

    rerender(
      <ArborProvider theme={theme}>
        <Drawer.Root open>
          <Drawer.Content>
            <Drawer.Title>X</Drawer.Title>
          </Drawer.Content>
        </Drawer.Root>
      </ArborProvider>,
    );
    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <ArborProvider theme={theme}>
        <Drawer.Root open={false}>
          <Drawer.Content>
            <Drawer.Title>X</Drawer.Title>
          </Drawer.Content>
        </Drawer.Root>
      </ArborProvider>,
    );
    expect(document.body.style.overflow).toBe('');
  });

  // ── RFC-0043: API plana ──────────────────────────────────────────────────

  it('API plana monta Header (title+description) + Body (children) + Footer', () => {
    renderDrawer(
      <Drawer
        defaultOpen
        title="Filtros"
        description="Refine a busca."
        footer={<button type="button">Aplicar</button>}
      >
        <p>Conteúdo do drawer.</p>
      </Drawer>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeTruthy();
    expect(screen.getByText('Filtros')).toBeTruthy();
    expect(screen.getByText('Refine a busca.')).toBeTruthy();
    expect(screen.getByText('Conteúdo do drawer.')).toBeTruthy();
    expect(screen.getByText('Aplicar')).toBeTruthy();
    const titleId = dialog.getAttribute('aria-labelledby');
    const descId = dialog.getAttribute('aria-describedby');
    expect(document.getElementById(titleId!)?.textContent).toBe('Filtros');
    expect(document.getElementById(descId!)?.textContent).toBe('Refine a busca.');
  });

  it("role='alertdialog' aplica role correto no content", () => {
    renderDrawer(
      <Drawer
        defaultOpen
        role="alertdialog"
        title="Sair sem salvar?"
        description="Suas alterações serão perdidas."
      />,
    );

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('alertdialog')).toBeTruthy();
  });

  it('initialFocusRef foca o elemento indicado ao abrir', () => {
    function Harness() {
      const inputRef = React.useRef<HTMLInputElement>(null);
      return (
        <Drawer defaultOpen title="Filtros" initialFocusRef={inputRef}>
          <input type="text" defaultValue="ignored" />
          <input ref={inputRef} type="text" defaultValue="focused" data-testid="target" />
        </Drawer>
      );
    }

    renderDrawer(<Harness />);
    act(() => { jest.advanceTimersByTime(50); });
    expect(document.activeElement).toBe(screen.getByTestId('target'));
  });

  it('API plana sem props planas e com children delega para Root', () => {
    renderDrawer(
      <Drawer>
        <Drawer.Trigger asChild>
          <button type="button">Open</button>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Compound</Drawer.Title>
        </Drawer.Content>
      </Drawer>,
    );

    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('Compound')).toBeTruthy();
  });

  it('API plana com trigger ReactElement embala em Drawer.Trigger asChild', () => {
    renderDrawer(
      <Drawer
        trigger={<button type="button">Filtros</button>}
        title="Filtros"
      />,
    );

    const trigger = screen.getByText('Filtros');
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('compound expõe Header/Body/Footer slots', () => {
    renderDrawer(
      <Drawer.Root defaultOpen>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Cabeçalho</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <p>Corpo</p>
          </Drawer.Body>
          <Drawer.Footer>
            <button type="button">Ação</button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>,
    );

    expect(screen.getByText('Cabeçalho')).toBeTruthy();
    expect(screen.getByText('Corpo')).toBeTruthy();
    expect(screen.getByText('Ação')).toBeTruthy();
  });
});
