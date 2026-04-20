import type { StorybookConfig } from '@storybook/react-vite';
import type { UserConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
  addons: ['@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {},
  async viteFinal(config: UserConfig) {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...(config.resolve?.alias as Record<string, string>),
          'react-native': 'react-native-web',
        },
      },
    };
  },
};

export default config;
