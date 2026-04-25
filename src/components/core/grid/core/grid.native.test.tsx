import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../../foundations';
import { ArborProvider } from '../../../../ecosystem/styled-system';
import { Grid } from './grid';
import { Text } from '../../text';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

describe('Grid (native)', () => {
  it('renders children', () => {
    render(
      <Grid>
        <Text>cell-a</Text>
        <Text>cell-b</Text>
      </Grid>,
      { wrapper: Wrapper },
    );
    expect(screen.getByText('cell-a')).toBeTruthy();
    expect(screen.getByText('cell-b')).toBeTruthy();
  });
});
