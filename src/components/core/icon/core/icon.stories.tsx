import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from './icon';
import { IconShowcase } from './icon-showcase';
import { Flex } from '../../flex';
import { Text } from '../../text';

const meta = {
  title: '🌳 Arbor DS/Foundations/Icons',
  component: Icon,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    name: { control: 'text' },
    size: { control: 'number' },
    color: { control: 'color' },
    strokeWidth: {
      control: { type: 'select' },
      options: [1, 1.5, 1.75, 2],
    },
    decorative: { control: 'boolean' },
    'aria-label': { control: 'text' },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj;

export const Library: Story = {
  render: () => <IconShowcase />,
  parameters: { layout: 'fullscreen' },
};

export const Single: Story = {
  args: {
    name: 'Check',
    size: 24,
    color: 'currentColor',
    strokeWidth: 1.75,
    decorative: true,
  },
};

export const Decorative: Story = {
  args: {
    name: 'Check',
    size: 24,
    decorative: true,
  },
};

export const Semantic: Story = {
  args: {
    name: 'Check',
    size: 24,
    decorative: false,
    'aria-label': 'Confirmado',
  },
};

export const SizeVariants: Story = {
  render: () => (
    <Flex alignItems="center" gap="16px">
      {([16, 20, 24, 32, 48] as const).map((s) => (
        <Flex key={s} flexDirection="column" alignItems="center" gap="4px">
          <Icon name="Star" size={s} decorative />
          <Text as="span" fontSize={11} color="#6b7280">{s}px</Text>
        </Flex>
      ))}
    </Flex>
  ),
};

export const StrokeVariants: Story = {
  render: () => (
    <Flex alignItems="center" gap="24px">
      {([1, 1.5, 1.75, 2] as const).map((sw) => (
        <Flex key={sw} flexDirection="column" alignItems="center" gap="4px">
          <Icon name="Circle" size="lg" strokeWidth={sw} decorative />
          <Text as="span" fontSize={11} color="#6b7280">{sw}</Text>
        </Flex>
      ))}
    </Flex>
  ),
};
