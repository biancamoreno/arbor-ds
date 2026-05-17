import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Menu } from './menu';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

function renderMenu(ui: React.ReactElement) {
  return render(ui, { wrapper: Wrapper });
}

function BasicMenu({ onSelect }: { onSelect?: (item: string) => void }) {
  return (
    <Menu.Root accessibilityLabel="Options menu">
      <Menu.Trigger asChild>
        <button type="button">Options</button>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Item onSelect={() => onSelect?.('edit')}>Edit</Menu.Item>
        <Menu.Item onSelect={() => onSelect?.('copy')}>Copy</Menu.Item>
        <Menu.Separator />
        <Menu.Item onSelect={() => onSelect?.('delete')}>Delete</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  );
}

describe('Menu', () => {
  it('renders trigger and no menu when closed', () => {
    renderMenu(<BasicMenu />);

    expect(screen.getByText('Options')).toBeTruthy();
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('opens when trigger is clicked', () => {
    renderMenu(<BasicMenu />);

    fireEvent.click(screen.getByText('Options'));
    expect(screen.getByRole('menu')).toBeTruthy();
    expect(screen.getByText('Edit')).toBeTruthy();
    expect(screen.getByText('Copy')).toBeTruthy();
  });

  it('closes when Escape is pressed', () => {
    renderMenu(<BasicMenu />);

    fireEvent.click(screen.getByText('Options'));

    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('calls onSelect and closes when item is clicked', () => {
    const onSelect = jest.fn();
    renderMenu(<BasicMenu onSelect={onSelect} />);

    fireEvent.click(screen.getByText('Options'));
    fireEvent.click(screen.getByText('Edit'));

    expect(onSelect).toHaveBeenCalledWith('edit');
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('renders separator with role=separator', () => {
    renderMenu(<BasicMenu />);

    fireEvent.click(screen.getByText('Options'));
    expect(screen.getByRole('separator')).toBeTruthy();
  });

  it('sets aria-haspopup and aria-expanded on trigger', () => {
    renderMenu(<BasicMenu />);

    const trigger = screen.getByText('Options');
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('disabled items have aria-disabled', () => {
    renderMenu(
      <Menu.Root>
        <Menu.Trigger asChild>
          <button type="button">Open</button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item disabled>Disabled item</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
    );

    fireEvent.click(screen.getByText('Open'));
    const item = screen.getByRole('menuitem');
    expect(item.getAttribute('aria-disabled')).toBe('true');
  });

  it('toggles open/close on subsequent trigger clicks', () => {
    renderMenu(<BasicMenu />);

    const trigger = screen.getByText('Options');

    fireEvent.click(trigger);
    expect(screen.getByRole('menu')).toBeTruthy();

    fireEvent.click(trigger);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('pointerdown on trigger does not dismiss the open menu', () => {
    renderMenu(<BasicMenu />);

    const trigger = screen.getByText('Options');
    fireEvent.click(trigger);
    expect(screen.getByRole('menu')).toBeTruthy();

    fireEvent.pointerDown(trigger);
    expect(screen.getByRole('menu')).toBeTruthy();
  });

  it('renders menu label', () => {
    renderMenu(
      <Menu.Root defaultOpen>
        <Menu.Content>
          <Menu.Label>Section title</Menu.Label>
          <Menu.Item>Item</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
    );

    expect(screen.getByText('Section title')).toBeTruthy();
  });

  it('aria-orientation is vertical on menu container', () => {
    renderMenu(<BasicMenu />);
    fireEvent.click(screen.getByText('Options'));
    expect(screen.getByRole('menu').getAttribute('aria-orientation')).toBe('vertical');
  });

  it('aria-controls on trigger points to menu content id when open', () => {
    renderMenu(<BasicMenu />);
    const trigger = screen.getByText('Options');
    expect(trigger.getAttribute('aria-controls')).toBeNull();
    fireEvent.click(trigger);
    const menu = screen.getByRole('menu');
    expect(trigger.getAttribute('aria-controls')).toBe(menu.getAttribute('id'));
  });

  // Regressão B2: foco inicial vai pro primeiro item habilitado.
  it('focuses first enabled item when opened', () => {
    renderMenu(
      <Menu.Root>
        <Menu.Trigger asChild>
          <button type="button">Open</button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item disabled>Disabled</Menu.Item>
          <Menu.Item>First enabled</Menu.Item>
          <Menu.Item>Second</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
    );

    fireEvent.click(screen.getByText('Open'));
    const items = screen.getAllByRole('menuitem');
    expect(document.activeElement).toBe(items[1]);
  });

  // Regressão B1: ArrowDown/ArrowUp navegam (passando direto pelo disabled).
  it('ArrowDown moves focus to next enabled item, wraps around, skips disabled', () => {
    renderMenu(
      <Menu.Root>
        <Menu.Trigger asChild>
          <button type="button">Open</button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item>A</Menu.Item>
          <Menu.Item disabled>Disabled</Menu.Item>
          <Menu.Item>C</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
    );

    fireEvent.click(screen.getByText('Open'));
    const menu = screen.getByRole('menu');
    const [a, , c] = screen.getAllByRole('menuitem');

    expect(document.activeElement).toBe(a);

    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(c); // pulou disabled

    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(a); // wrap

    fireEvent.keyDown(menu, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(c); // wrap up
  });

  // Regressão B1: Home/End funcionam mesmo no primeiro abrir.
  it('Home and End jump to first/last enabled item', () => {
    renderMenu(
      <Menu.Root>
        <Menu.Trigger asChild>
          <button type="button">Open</button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item>A</Menu.Item>
          <Menu.Item>B</Menu.Item>
          <Menu.Item>C</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
    );

    fireEvent.click(screen.getByText('Open'));
    const menu = screen.getByRole('menu');
    const [a, , c] = screen.getAllByRole('menuitem');

    fireEvent.keyDown(menu, { key: 'End' });
    expect(document.activeElement).toBe(c);

    fireEvent.keyDown(menu, { key: 'Home' });
    expect(document.activeElement).toBe(a);
  });

  // Regressão B3: árvore ARIA limpa — filhos diretos de role="menu" são role="menuitem"/separator
  // (sem wrapper div tabIndex=-1 do antigo FocusScope).
  it('menu has no orphan wrapper between role="menu" and its items (ARIA tree)', () => {
    renderMenu(<BasicMenu />);
    fireEvent.click(screen.getByText('Options'));

    const menu = screen.getByRole('menu');
    const directChildren = Array.from(menu.children) as HTMLElement[];
    for (const child of directChildren) {
      const role = child.getAttribute('role');
      expect(['menuitem', 'separator', 'presentation', 'group']).toContain(role);
    }
  });

  // Item string envolto em <Text variant="bodyMedium"> (tipografia canônica DS).
  it('wraps string children in Text', () => {
    renderMenu(<BasicMenu />);
    fireEvent.click(screen.getByText('Options'));
    const items = screen.getAllByRole('menuitem');
    const firstItemText = items[0].querySelector('span');
    expect(firstItemText).toBeTruthy();
    expect(firstItemText?.textContent).toBe('Edit');
  });

  // ReactNode children NÃO recebe wrapper extra — consumer responsável.
  it('preserves ReactNode children without extra wrapper', () => {
    renderMenu(
      <Menu defaultOpen>
        <Menu.Content>
          <Menu.Item>
            <div data-testid="custom">Custom</div>
          </Menu.Item>
        </Menu.Content>
      </Menu>,
    );
    const custom = screen.getByTestId('custom');
    // Pai direto do `custom` é o Box[role="menuitem"] — sem Text intermediário.
    expect(custom.parentElement?.getAttribute('role')).toBe('menuitem');
  });

  // G3: onSelect recebe event; preventDefault() impede o close (toggle pattern).
  it('onSelect receives event; preventDefault keeps menu open', () => {
    const onSelect = jest.fn((e: { preventDefault: () => void }) => {
      e.preventDefault();
    });
    renderMenu(
      <Menu.Root>
        <Menu.Trigger asChild>
          <button type="button">Open</button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item onSelect={onSelect}>Toggle</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
    );

    fireEvent.click(screen.getByText('Open'));
    fireEvent.click(screen.getByText('Toggle'));

    expect(onSelect).toHaveBeenCalled();
    expect(screen.queryByRole('menu')).toBeTruthy(); // menu permanece aberto
  });

  // G3: sem preventDefault → menu fecha normalmente.
  it('onSelect without preventDefault closes the menu', () => {
    const onSelect = jest.fn();
    renderMenu(
      <Menu.Root>
        <Menu.Trigger asChild>
          <button type="button">Open</button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item onSelect={onSelect}>Action</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
    );

    fireEvent.click(screen.getByText('Open'));
    fireEvent.click(screen.getByText('Action'));

    expect(onSelect).toHaveBeenCalled();
    expect(screen.queryByRole('menu')).toBeNull();
  });

  // G1: ArrowDown/Enter no trigger fechado abre o menu.
  it('ArrowDown on closed trigger opens menu', () => {
    renderMenu(<BasicMenu />);
    const trigger = screen.getByText('Options');
    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    expect(screen.getByRole('menu')).toBeTruthy();
  });

  it('ArrowUp on closed trigger opens menu', () => {
    renderMenu(<BasicMenu />);
    const trigger = screen.getByText('Options');
    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'ArrowUp' });
    expect(screen.getByRole('menu')).toBeTruthy();
  });

  // G6: trigger asChild com disabled child não abre o menu.
  it('disabled trigger child does not open menu', () => {
    renderMenu(
      <Menu.Root>
        <Menu.Trigger asChild>
          <button type="button" disabled>Disabled</button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item>Item</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
    );

    fireEvent.click(screen.getByText('Disabled'));
    expect(screen.queryByRole('menu')).toBeNull();
  });

  // U6: tone='critical' renderiza item sem crash; visual validado via story.
  // (Recipe variant aplica color/background via engine — verificação de estilo
  //  em JSDOM é frágil porque CSS de pseudo-states não computa.)
  it('tone=critical renders without crash', () => {
    renderMenu(
      <Menu.Root>
        <Menu.Trigger asChild>
          <button type="button">Open</button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item tone="critical">Excluir</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
    );
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Excluir')).toBeTruthy();
  });

  // U7: startIcon string renderiza <Icon> themado.
  it('startIcon as IconName renders Icon component', () => {
    renderMenu(
      <Menu.Root>
        <Menu.Trigger asChild>
          <button type="button">Open</button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item startIcon="Pencil">Editar</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
    );
    fireEvent.click(screen.getByText('Open'));
    const item = screen.getByRole('menuitem');
    // Icon do DS sempre renderiza <svg>; valida presença.
    expect(item.querySelector('svg')).toBeTruthy();
  });

  // Regressão B3: foco volta pro trigger ao fechar (useRestoreFocus).
  it('restores focus to trigger on close', () => {
    renderMenu(<BasicMenu />);
    const trigger = screen.getByText('Options');
    trigger.focus();
    fireEvent.click(trigger);

    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    expect(document.activeElement).toBe(trigger);
  });
});
