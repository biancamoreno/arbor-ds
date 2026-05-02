import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Flex } from '../../core';
import { Badge } from './badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    tone: {
      control: { type: 'select' },
      options: ['neutral', 'brand', 'success', 'warning', 'critical', 'info'],
    },
    variant: { control: { type: 'select' }, options: ['solid', 'subtle'] },
    size: { control: { type: 'select' }, options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { children: 'Novo', tone: 'brand', variant: 'solid' },
};

export const AllTones: Story = {
  render: () => (
    <Flex gap="small" flexWrap="wrap">
      {(['neutral', 'brand', 'success', 'warning', 'critical', 'info'] as const).map((tone) => (
        <Badge key={tone} tone={tone}>{tone}</Badge>
      ))}
    </Flex>
  ),
};

export const Subtle: Story = {
  render: () => (
    <Flex gap="small" flexWrap="wrap">
      {(['neutral', 'brand', 'success', 'warning', 'critical', 'info'] as const).map((tone) => (
        <Badge key={tone} tone={tone} variant="subtle">{tone}</Badge>
      ))}
    </Flex>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Flex gap="small" alignItems="center">
      <Badge size="sm" tone="brand">SM</Badge>
      <Badge size="md" tone="brand">MD</Badge>
    </Flex>
  ),
};

export const WithAnchor: Story = {
  render: () => (
    <Badge.Anchor badge={<Badge tone="critical" size="sm">3</Badge>}>
      <Flex
        width={40}
        height={40}
        backgroundColor="background.subtle"
        borderRadius="medium"
        alignItems="center"
        justifyContent="center"
      >
        <Box as="span">🔔</Box>
      </Flex>
    </Badge.Anchor>
  ),
};
