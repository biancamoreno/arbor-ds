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
          <Drawer.Close label="Fechar gaveta" />
        </Drawer.Content>
      </Drawer.Root>,
    );

    fireEvent.click(screen.getByText('Open'));
    fireEvent.click(screen.getByLabelText('Fechar gaveta'));

    // aguarda a animação de saída (200ms) terminar
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

    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    // aguarda a animação de saída
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
});
