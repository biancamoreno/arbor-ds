import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Image as RNImage, ImageBackground as RNImageBackground } from 'react-native';
import { createTheme, themeLight } from '../../../../foundations';
import { ArborProvider } from '../../../../ecosystem/styled-system';
import { Image } from './image';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

describe('Image (native)', () => {
  it('renders RNImage with normalized source for mode="img"', () => {
    render(
      <Image mode="img" source="https://example.com/a.png" alt="alt text" />,
      { wrapper: Wrapper },
    );
    const node = screen.UNSAFE_getByType(RNImage);
    expect(node.props.source).toEqual({ uri: 'https://example.com/a.png' });
    expect(node.props.accessibilityLabel).toBe('alt text');
  });

  it('uses RNImageBackground when mode="background"', () => {
    render(
      <Image mode="background" source="https://example.com/a.png" alt="bg">
        <></>
      </Image>,
      { wrapper: Wrapper },
    );
    expect(screen.UNSAFE_getByType(RNImageBackground)).toBeTruthy();
  });
});
