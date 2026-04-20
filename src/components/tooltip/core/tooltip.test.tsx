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
});
