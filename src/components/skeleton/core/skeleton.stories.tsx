import type { Meta, StoryObj } from '@storybook/react-vite';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320, padding: 16, border: '1px solid #eee', borderRadius: 8 }}>
      <Skeleton width={60} height={60} borderRadius="50%" />
      <Skeleton width="100%" height={16} />
      <Skeleton width="80%" height={14} />
      <Skeleton width="60%" height={14} />
    </div>
  ),
};
