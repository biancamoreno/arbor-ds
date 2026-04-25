import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { TabBar } from './tab-bar';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

function renderTabs(props?: { active?: string; onChange?: (v: string) => void }) {
  const { active = 'home', onChange = () => {} } = props ?? {};
  return render(
    <TabBar value={active} onChange={onChange}>
      <TabBar.Item value="home" icon="House" label="Home" />
      <TabBar.Item value="search" icon="Search" label="Search" />
      <TabBar.Item value="profile" icon="User" label="Profile" disabled />
    </TabBar>,
    { wrapper: Wrapper },
  );
}

describe('TabBar (native)', () => {
  it('marks the active item with accessibilityState.selected', () => {
    renderTabs({ active: 'search' });
    const tabs = screen.getAllByRole('tab');
    const search = tabs.find((t) => t.props.accessibilityLabel === 'Search')!;
    const home = tabs.find((t) => t.props.accessibilityLabel === 'Home')!;
    expect(search.props.accessibilityState.selected).toBe(true);
    expect(home.props.accessibilityState.selected).toBe(false);
  });

  it('calls onChange with the item value when pressed', () => {
    const onChange = jest.fn();
    renderTabs({ onChange });
    const tabs = screen.getAllByRole('tab');
    const search = tabs.find((t) => t.props.accessibilityLabel === 'Search')!;
    fireEvent.press(search);
    expect(onChange).toHaveBeenCalledWith('search');
  });

  it('does not call onChange when disabled item is pressed', () => {
    const onChange = jest.fn();
    renderTabs({ onChange });
    const tabs = screen.getAllByRole('tab');
    const profile = tabs.find((t) => t.props.accessibilityLabel === 'Profile')!;
    fireEvent.press(profile);
    expect(onChange).not.toHaveBeenCalled();
    expect(profile.props.accessibilityState.disabled).toBe(true);
  });
});
