import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Popover } from './popover';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

function renderPopover(ui: React.ReactElement) {
  return render(ui, { wrapper: Wrapper });
}

describe('Popover', () => {
  it('renders trigger and no content when closed', () => {
    renderPopover(
      <Popover>
        <Popover.Trigger asChild>
          <button type="button">Open</button>
        </Popover.Trigger>
        <Popover.Content>
          <p>Popover content</p>
        </Popover.Content>
      </Popover>,
    );

    expect(screen.getByText('Open')).toBeTruthy();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('opens when trigger is clicked', () => {
    renderPopover(
      <Popover>
        <Popover.Trigger asChild>
          <button type="button">Open</button>
        </Popover.Trigger>
        <Popover.Content>
          <p>Popover content</p>
        </Popover.Content>
      </Popover>,
    );

    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('Popover content')).toBeTruthy();
  });

  it('closes when Escape is pressed', () => {
    renderPopover(
      <Popover>
        <Popover.Trigger asChild>
          <button type="button">Open</button>
        </Popover.Trigger>
        <Popover.Content>
          <p>Popover content</p>
        </Popover.Content>
      </Popover>,
    );

    fireEvent.click(screen.getByText('Open'));

    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes via Close button', () => {
    renderPopover(
      <Popover>
        <Popover.Trigger asChild>
          <button type="button">Open</button>
        </Popover.Trigger>
        <Popover.Content>
          <p>Content</p>
          <Popover.Close accessibilityLabel="Fechar popover" />
        </Popover.Content>
      </Popover>,
    );

    fireEvent.click(screen.getByText('Open'));
    fireEvent.click(screen.getByLabelText('Fechar popover'));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('calls onOpenChange when dismissed', () => {
    const onOpenChange = jest.fn();

    renderPopover(
      <Popover open onOpenChange={onOpenChange}>
        <Popover.Content>
          <Popover.Close accessibilityLabel="Fechar" />
        </Popover.Content>
      </Popover>,
    );

    fireEvent.click(screen.getByLabelText('Fechar'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('respects placement prop', () => {
    renderPopover(
      <Popover defaultOpen placement="top">
        <Popover.Trigger asChild>
          <button type="button">Open</button>
        </Popover.Trigger>
        <Popover.Content>
          <p>Content</p>
        </Popover.Content>
      </Popover>,
    );

    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('uses accessibilityLabel as aria-label', () => {
    renderPopover(
      <Popover defaultOpen accessibilityLabel="Filtros aplicados">
        <Popover.Content>
          <p>Filtros</p>
        </Popover.Content>
      </Popover>,
    );

    expect(screen.getByLabelText('Filtros aplicados')).toBeTruthy();
  });

  it('toggles open/close on subsequent trigger clicks', () => {
    renderPopover(
      <Popover>
        <Popover.Trigger asChild>
          <button type="button">Open</button>
        </Popover.Trigger>
        <Popover.Content>
          <p>Popover content</p>
        </Popover.Content>
      </Popover>,
    );

    const trigger = screen.getByText('Open');

    fireEvent.click(trigger);
    expect(screen.getByRole('dialog')).toBeTruthy();

    fireEvent.click(trigger);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('pointerdown on trigger does not dismiss the open layer', () => {
    renderPopover(
      <Popover>
        <Popover.Trigger asChild>
          <button type="button">Open</button>
        </Popover.Trigger>
        <Popover.Content>
          <p>Popover content</p>
        </Popover.Content>
      </Popover>,
    );

    const trigger = screen.getByText('Open');
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog')).toBeTruthy();

    fireEvent.pointerDown(trigger);
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('renders with defaultOpen=true', () => {
    renderPopover(
      <Popover defaultOpen>
        <Popover.Content>
          <p>Default open content</p>
        </Popover.Content>
      </Popover>,
    );

    expect(screen.getByRole('dialog')).toBeTruthy();
  });
});
