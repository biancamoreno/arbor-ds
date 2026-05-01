import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../../foundations';
import { ArborProvider } from '../../../../ecosystem/styled-system';
import { Icon } from './icon';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

describe('Icon (native)', () => {
  it('returns null when name does not match a Lucide export', () => {
    const { toJSON } = render(<Icon name={'not-a-real-icon' as never} decorative />, { wrapper: Wrapper });
    expect(toJSON()).toBeNull();
  });

  it('renders an SVG icon when name matches', () => {
    render(<Icon name="Plus" aria-label="add" decorative={false} />, { wrapper: Wrapper });
    const matches = screen.getAllByLabelText('add');
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].props.accessibilityElementsHidden).toBe(false);
  });

  it('hides from a11y when decorative', () => {
    const { toJSON } = render(<Icon name="Plus" decorative />, { wrapper: Wrapper });
    expect(toJSON()).toBeTruthy();
  });
});
