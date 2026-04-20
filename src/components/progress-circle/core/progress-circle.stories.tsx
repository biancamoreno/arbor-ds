import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressCircle } from './progress-circle';

const meta = {
  title: 'Feedback/ProgressCircle',
  component: ProgressCircle,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    progress: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    size: { control: { type: 'number', min: 24, max: 200 } },
    strokeWidth: { control: { type: 'number', min: 2, max: 20 } },
    tone: { control: { type: 'select' }, options: ['brand', 'success', 'warning', 'critical'] },
    label: { control: 'text' },
  },
} satisfies Meta<typeof ProgressCircle>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { progress: 65, tone: 'brand', label: 'Progresso' },
};

export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      {(['brand', 'success', 'warning', 'critical'] as const).map((tone) => (
        <ProgressCircle key={tone} progress={75} tone={tone} label={tone} />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <ProgressCircle progress={50} size={32} label="32px" />
      <ProgressCircle progress={50} size={56} label="56px" />
      <ProgressCircle progress={50} size={80} label="80px" />
      <ProgressCircle progress={50} size={120} label="120px" />
    </div>
  ),
};
