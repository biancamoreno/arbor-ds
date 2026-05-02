import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex } from '../../core';
import { Skeleton } from './skeleton';

const meta = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    width: { control: 'text' },
    height: { control: 'text' },
    borderRadius: { control: 'text' },
    lines: { control: { type: 'number', min: 1, max: 10 } },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj;

export const Line: Story = {
  args: { width: 200, height: 16 },
};

export const Circle: Story = {
  args: { width: 48, height: 48, borderRadius: '50%' },
};

export const MultiLine: Story = {
  args: { width: 300, height: 14, lines: 4 },
};

export const CardSkeleton: Story = {
  render: () => (
    <Flex
      flexDirection="column"
      gap="small"
      width={320}
      padding="medium"
      borderWidth="hairline"
      borderStyle="solid"
      borderColor="border.subtle"
      borderRadius="medium"
    >
      <Skeleton width={60} height={60} borderRadius="50%" />
      <Skeleton width="100%" height={16} />
      <Skeleton width="80%" height={14} />
      <Skeleton width="60%" height={14} />
    </Flex>
  ),
};

export const SuppressedAnnouncement: Story = {
  args: { width: 200, height: 16, label: false },
  parameters: {
    docs: {
      description: {
        story: 'Use `label={false}` quando o consumidor já anuncia o estado de carregamento (ex: container com `aria-busy`).',
      },
    },
  },
};
