import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Dialog } from './dialog';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

function renderDialog(ui: React.ReactElement) {
  return render(ui, { wrapper: Wrapper });
}

describe('Dialog', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runAllTimers();
    jest.useRealTimers();
  });

  it('renders trigger and no content when closed', () => {
    renderDialog(
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button type="button">Open</button>
        </Dialog.Trigger>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>My Dialog</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>,
    );

    expect(screen.getByText('Open')).toBeTruthy();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('opens when trigger is clicked', () => {
    renderDialog(
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button type="button">Open</button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>My Dialog</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>,
    );

    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('My Dialog')).toBeTruthy();
  });

  it('closes when Close button is clicked', () => {
    renderDialog(
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button type="button">Open</button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>My Dialog</Dialog.Title>
          <Dialog.Close accessibilityLabel="Fechar diálogo" />
        </Dialog.Content>
      </Dialog.Root>,
    );

    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByRole('dialog')).toBeTruthy();

    fireEvent.click(screen.getByLabelText('Fechar diálogo'));
    act(() => { jest.advanceTimersByTime(200); });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes when Escape key is pressed', () => {
    renderDialog(
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button type="button">Open</button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>My Dialog</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>,
    );

    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByRole('dialog')).toBeTruthy();

    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    act(() => { jest.advanceTimersByTime(200); });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('calls onOpenChange when state toggles', () => {
    const onOpenChange = jest.fn();

    renderDialog(
      <Dialog.Root onOpenChange={onOpenChange}>
        <Dialog.Trigger asChild>
          <button type="button">Open</button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Controlled</Dialog.Title>
          <Dialog.Close />
        </Dialog.Content>
      </Dialog.Root>,
    );

    fireEvent.click(screen.getByText('Open'));
    expect(onOpenChange).toHaveBeenCalledWith(true);

    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('has aria-modal and correct aria attributes', () => {
    renderDialog(
      <Dialog.Root defaultOpen>
        <Dialog.Content>
          <Dialog.Title>Accessible Dialog</Dialog.Title>
          <Dialog.Description>Dialog description</Dialog.Description>
        </Dialog.Content>
      </Dialog.Root>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');

    const titleId = dialog.getAttribute('aria-labelledby');
    const descId = dialog.getAttribute('aria-describedby');

    expect(titleId).toBeTruthy();
    expect(descId).toBeTruthy();
    expect(document.getElementById(titleId!)).toBeTruthy();
    expect(document.getElementById(descId!)).toBeTruthy();
  });

  it('renders children in dialog content', () => {
    renderDialog(
      <Dialog.Root defaultOpen>
        <Dialog.Content>
          <Dialog.Title>Title</Dialog.Title>
          <p>Content inside dialog</p>
        </Dialog.Content>
      </Dialog.Root>,
    );

    expect(screen.getByText('Content inside dialog')).toBeTruthy();
  });

  it('renders with defaultOpen=true', () => {
    renderDialog(
      <Dialog.Root defaultOpen>
        <Dialog.Content>
          <Dialog.Title>Default Open</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>,
    );

    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  // ── Regressões/novos contratos ──────────────────────────────────────────

  // PCV-32: trigger expõe aria-haspopup="dialog" + aria-expanded + aria-controls.
  it('trigger has aria-haspopup, aria-expanded, aria-controls', () => {
    renderDialog(
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button type="button">Open</button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>X</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>,
    );

    const trigger = screen.getByText('Open');
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-controls')).toBeNull();

    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('aria-controls')).toBe(screen.getByRole('dialog').getAttribute('id'));
  });

  // G6: trigger asChild com disabled child não abre.
  it('disabled trigger child does not open dialog', () => {
    renderDialog(
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button type="button" disabled>Disabled</button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>X</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>,
    );

    fireEvent.click(screen.getByText('Disabled'));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  // PCV-32: accessibilityLabel no Root vira aria-label no content (fallback quando sem Title).
  it('accessibilityLabel propagates to dialog aria-label', () => {
    renderDialog(
      <Dialog.Root defaultOpen accessibilityLabel="Sem título visível">
        <Dialog.Content>
          <p>conteúdo</p>
        </Dialog.Content>
      </Dialog.Root>,
    );

    expect(screen.getByRole('dialog').getAttribute('aria-label')).toBe('Sem título visível');
  });

  // PCV-32: Close usa Icon do DS (não caractere literal ✕).
  it('Close button renders Icon (not literal character)', () => {
    renderDialog(
      <Dialog.Root defaultOpen>
        <Dialog.Content>
          <Dialog.Title>X</Dialog.Title>
          <Dialog.Close />
        </Dialog.Content>
      </Dialog.Root>,
    );

    const closeBtn = screen.getByRole('button', { name: 'Fechar' });
    expect(closeBtn.querySelector('svg')).toBeTruthy();
    expect(closeBtn.textContent).not.toContain('✕');
  });

  // ── PR1: saídas modeladas + composer fix ────────────────────────────────

  it('Close com children compõe o onClick do filho (não sobrescreve)', () => {
    const childOnClick = jest.fn();
    renderDialog(
      <Dialog.Root defaultOpen>
        <Dialog.Content>
          <Dialog.Title>X</Dialog.Title>
          <Dialog.Close>
            <button type="button" onClick={childOnClick}>Salvar</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>,
    );

    fireEvent.click(screen.getByText('Salvar'));
    expect(childOnClick).toHaveBeenCalledTimes(1);
    act(() => { jest.advanceTimersByTime(200); });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('Close com children preserva preventDefault do filho (não fecha)', () => {
    const childOnClick = jest.fn((e: React.MouseEvent) => e.preventDefault());
    renderDialog(
      <Dialog.Root defaultOpen>
        <Dialog.Content>
          <Dialog.Title>X</Dialog.Title>
          <Dialog.Close>
            <button type="button" onClick={childOnClick}>Validar</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>,
    );

    fireEvent.click(screen.getByText('Validar'));
    expect(childOnClick).toHaveBeenCalledTimes(1);
    act(() => { jest.advanceTimersByTime(200); });
    expect(screen.queryByRole('dialog')).toBeTruthy();
  });

  it('closeOnEscape={false} impede o fechamento por Escape', () => {
    renderDialog(
      <Dialog.Root defaultOpen closeOnEscape={false}>
        <Dialog.Content>
          <Dialog.Title>Wizard</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>,
    );

    expect(screen.getByRole('dialog')).toBeTruthy();
    act(() => { fireEvent.keyDown(document, { key: 'Escape' }); });
    act(() => { jest.advanceTimersByTime(200); });
    expect(screen.queryByRole('dialog')).toBeTruthy();
  });

  it('onEscapeKeyDown com preventDefault impede o fechamento', () => {
    const onEscapeKeyDown = jest.fn((e: { preventDefault: () => void }) => e.preventDefault());
    renderDialog(
      <Dialog.Root defaultOpen onEscapeKeyDown={onEscapeKeyDown}>
        <Dialog.Content>
          <Dialog.Title>Form</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>,
    );

    act(() => { fireEvent.keyDown(document, { key: 'Escape' }); });
    expect(onEscapeKeyDown).toHaveBeenCalledTimes(1);
    act(() => { jest.advanceTimersByTime(200); });
    expect(screen.queryByRole('dialog')).toBeTruthy();
  });

  it('closeOnOverlayClick={false} impede o fechamento por clique no overlay', () => {
    renderDialog(
      <Dialog.Root defaultOpen closeOnOverlayClick={false}>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>Destructive</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>,
    );

    const overlay = document.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(overlay).toBeTruthy();
    fireEvent.click(overlay);
    act(() => { jest.advanceTimersByTime(200); });
    expect(screen.queryByRole('dialog')).toBeTruthy();
  });

  it('onInteractOutside com preventDefault impede o fechamento', () => {
    const onInteractOutside = jest.fn((e: { preventDefault: () => void }) => e.preventDefault());
    renderDialog(
      <Dialog.Root defaultOpen onInteractOutside={onInteractOutside}>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>Form dirty</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>,
    );

    const overlay = document.querySelector('[aria-hidden="true"]') as HTMLElement;
    fireEvent.click(overlay);
    expect(onInteractOutside).toHaveBeenCalledTimes(1);
    act(() => { jest.advanceTimersByTime(200); });
    expect(screen.queryByRole('dialog')).toBeTruthy();
  });

  it('lockBodyScroll default: trava body overflow enquanto aberto', () => {
    document.body.style.overflow = '';
    const { rerender } = renderDialog(
      <Dialog.Root open={false}>
        <Dialog.Content>
          <Dialog.Title>X</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>,
    );
    expect(document.body.style.overflow).toBe('');

    rerender(
      <Dialog.Root open>
        <Dialog.Content>
          <Dialog.Title>X</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>,
    );
    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <Dialog.Root open={false}>
        <Dialog.Content>
          <Dialog.Title>X</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>,
    );
    expect(document.body.style.overflow).toBe('');
  });

  it('lockBodyScroll={false} não trava o body', () => {
    document.body.style.overflow = '';
    renderDialog(
      <Dialog.Root defaultOpen lockBodyScroll={false}>
        <Dialog.Content>
          <Dialog.Title>X</Dialog.Title>
        </Dialog.Content>
      </Dialog.Root>,
    );
    expect(document.body.style.overflow).toBe('');
  });

  // ── PR2 (RFC-0043): API plana ───────────────────────────────────────────

  it('API plana monta Header (title+description) + Body (children) + Footer', () => {
    renderDialog(
      <Dialog
        defaultOpen
        title="Editar usuário"
        description="Atualize os dados abaixo."
        footer={<button type="button">Salvar</button>}
      >
        <p>Body livre via children.</p>
      </Dialog>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeTruthy();
    expect(screen.getByText('Editar usuário')).toBeTruthy();
    expect(screen.getByText('Atualize os dados abaixo.')).toBeTruthy();
    expect(screen.getByText('Body livre via children.')).toBeTruthy();
    expect(screen.getByText('Salvar')).toBeTruthy();
    // aria-labelledby aponta para o título e aria-describedby para a descrição.
    const titleId = dialog.getAttribute('aria-labelledby');
    const descId = dialog.getAttribute('aria-describedby');
    expect(document.getElementById(titleId!)?.textContent).toBe('Editar usuário');
    expect(document.getElementById(descId!)?.textContent).toBe('Atualize os dados abaixo.');
  });

  it("role='alertdialog' aplica role correto no content", () => {
    renderDialog(
      <Dialog
        defaultOpen
        role="alertdialog"
        title="Excluir conta"
        description="Esta ação é irreversível."
      />,
    );

    // role plana — deve estar como `alertdialog`, não `dialog`.
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('alertdialog')).toBeTruthy();
  });

  it('initialFocusRef foca o elemento indicado ao abrir', () => {
    function Harness() {
      const inputRef = React.useRef<HTMLInputElement>(null);
      return (
        <Dialog defaultOpen title="Editar" initialFocusRef={inputRef}>
          <input type="text" defaultValue="ignored" />
          <input ref={inputRef} type="text" defaultValue="focused" data-testid="target" />
        </Dialog>
      );
    }

    renderDialog(<Harness />);
    act(() => {
      jest.advanceTimersByTime(50);
    });
    expect(document.activeElement).toBe(screen.getByTestId('target'));
  });

  it('API plana sem props planas e com children compound delega para Root', () => {
    renderDialog(
      <Dialog>
        <Dialog.Trigger asChild>
          <button type="button">Open</button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Compound</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    );

    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('Compound')).toBeTruthy();
  });

  it('API plana com trigger ReactElement embala em Dialog.Trigger asChild', () => {
    renderDialog(
      <Dialog
        trigger={<button type="button">Excluir</button>}
        title="Confirmar"
        footer={<button type="button">OK</button>}
      />,
    );

    const trigger = screen.getByText('Excluir');
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('compound expõe Header/Body/Footer slots', () => {
    renderDialog(
      <Dialog.Root defaultOpen>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Cabeçalho</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <p>Corpo</p>
          </Dialog.Body>
          <Dialog.Footer>
            <button type="button">Ação</button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>,
    );

    expect(screen.getByText('Cabeçalho')).toBeTruthy();
    expect(screen.getByText('Corpo')).toBeTruthy();
    expect(screen.getByText('Ação')).toBeTruthy();
  });

  it('API plana sem description omite aria-describedby do title (title-only)', () => {
    renderDialog(<Dialog defaultOpen title="Apenas título" />);

    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-labelledby')).toBeTruthy();
    // sem `<Dialog.Description>` renderizado → o id referenciado não existe.
    const descId = dialog.getAttribute('aria-describedby');
    expect(document.getElementById(descId!)).toBeNull();
  });
});
