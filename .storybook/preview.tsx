import React from 'react';
import type { Preview } from '@storybook/react-vite';
import { ArborProvider } from '../src/ecosystem';
import { themeLight, themeDark } from '../src/foundations';

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const isDark = (context.globals as Record<string, string>)['theme'] === 'dark';
      const theme = isDark ? themeDark : themeLight;
      return (
        <ArborProvider theme={theme}>
          <div style={{ padding: 16, minHeight: '100%', background: isDark ? '#1a1a1a' : '#ffffff' }}>
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
