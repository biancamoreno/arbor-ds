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
          <Dialog.Close label="Fechar diálogo" />
        </Dialog.Content>
      </Dialog.Root>,
    );

    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByRole('dialog')).toBeTruthy();

    fireEvent.click(screen.getByLabelText('Fechar diálogo'));
    act(() => { jest.advanceTimersByTime(250); });
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

    act(() => { jest.advanceTimersByTime(250); });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('calls onClose when dialog is dismissed', () => {
    const onClose = jest.fn();

    renderDialog(
      <Dialog.Root open onClose={onClose}>
        <Dialog.Content>
          <Dialog.Title>My Dialog</Dialog.Title>
          <Dialog.Close />
        </Dialog.Content>
      </Dialog.Root>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(onClose).toHaveBeenCalledTimes(1);
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
});
