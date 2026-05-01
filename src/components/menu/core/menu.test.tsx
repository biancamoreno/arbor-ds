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
    <Menu.Root>
      <Menu.Trigger asChild>
        <button type="button">Options</button>
      </Menu.Trigger>
      <Menu.Content label="Options menu">
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
});
