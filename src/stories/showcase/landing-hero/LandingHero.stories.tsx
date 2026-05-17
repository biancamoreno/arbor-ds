import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArborProvider } from '../../../ecosystem';
import { themeLight, themeDark } from '../../../foundations';
import { LandingHero } from './LandingHero';

const meta = {
  title: 'Showcase/Landing Hero',
  component: LandingHero,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Demo de landing/hero (RFC-0041 PR3). Stress-test de personalidade e ' +
          'hierarquia tipográfica. Sem `extendTheme()`, sem cor literal, sem `style={{}}` ' +
          'para CSS coberto pelo sistema. Cross-platform por construção (Image/Box/Flex/Card).',
      },
    },
  },
} satisfies Meta<typeof LandingHero>;

export default meta;
type Story = StoryObj<typeof LandingHero>;

export const Light: Story = {
  name: 'Tema claro (default)',
  render: () => (
    <ArborProvider theme={themeLight}>
      <LandingHero />
    </ArborProvider>
  ),
};

export const Dark: Story = {
  name: 'Tema escuro',
  render: () => (
    <ArborProvider theme={themeDark}>
      <LandingHero />
    </ArborProvider>
  ),
};
