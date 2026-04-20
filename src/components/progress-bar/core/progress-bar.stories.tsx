import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from './progress-bar';

const meta = {
  title: 'Feedback/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    progress: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    size: { control: { type: 'select' }, options: ['sm', 'md', 'lg'] },
    tone: { control: { type: 'select' }, options: ['brand', 'success', 'warning', 'critical'] },
    label: { control: 'text' },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { progress: 60, tone: 'brand', label: 'Progresso' },
};

export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 400 }}>
      {(['brand', 'success', 'warning', 'critical'] as const).map((tone) => (
        <ProgressBar key={tone} progress={65} tone={tone} label={`Progresso ${tone}`} />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 400 }}>
      <ProgressBar progress={50} size="sm" label="SM" />
      <ProgressBar progress={50} size="md" label="MD" />
      <ProgressBar progress={50} size="lg" label="LG" />
    </div>
  ),
};

export const Complete: Story = {
  args: { progress: 100, tone: 'success', label: 'Concluído' },
};
