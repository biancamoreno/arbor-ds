import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { NavBar } from './nav-bar';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

describe('NavBar (native)', () => {
  it('renders the title prop', () => {
    render(<NavBar title="Inbox" />, { wrapper: Wrapper });
    expect(screen.getByText('Inbox')).toBeTruthy();
  });

  it('renders start and end slots', () => {
    render(
      <NavBar
        title="Inbox"
        start={<Text>back</Text>}
        end={<Text>more</Text>}
      />,
      { wrapper: Wrapper },
    );
    expect(screen.getByText('back')).toBeTruthy();
    expect(screen.getByText('more')).toBeTruthy();
  });

  it('center slot overrides the title prop', () => {
    render(
      <NavBar title="Should be hidden" center={<Text>Custom Center</Text>} />,
      { wrapper: Wrapper },
    );
    expect(screen.getByText('Custom Center')).toBeTruthy();
    expect(screen.queryByText('Should be hidden')).toBeNull();
  });
});
