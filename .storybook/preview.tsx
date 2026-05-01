import React from 'react';
import type { Preview } from '@storybook/react-vite';
import { ArborProvider } from '../src/ecosystem';
import { themeLight, themeDark } from '../src/foundations';
import { themeProductB } from './themes';

const themeMap = {
  light: themeLight,
  dark: themeDark,
  productB: themeProductB,
} as const;

type ThemeKey = keyof typeof themeMap;

const backgroundMap: Record<ThemeKey, string> = {
  light: '#ffffff',
  dark: '#1a1a1a',
  productB: '#ffffff',
};

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const key = ((context.globals as Record<string, string>)['theme'] ?? 'light') as ThemeKey;
      const theme = themeMap[key] ?? themeLight;
      return (
        <ArborProvider theme={theme}>
          <div style={{ padding: 16, minHeight: '100%', background: backgroundMap[key] ?? '#ffffff' }}>
            <Story />
          </div>
        </ArborProvider>
      );
    },
  ],
  globalTypes: {
    theme: {
      name: 'Theme',
      defaultValue: 'light',
      toolbar: {
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'productB', title: 'Product B (violet)' },
        ],
        showName: true,
      },
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
