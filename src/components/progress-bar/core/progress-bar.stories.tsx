import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex } from '../../core';
import { ProgressBar } from './progress-bar';

const meta = {
  title: 'Feedback/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    progress: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    size: { control: { type: 'select' }, options: ['small', 'medium', 'large'] },
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
    <Flex flexDirection="column" gap="small" width={400}>
      {(['brand', 'success', 'warning', 'critical'] as const).map((tone) => (
        <ProgressBar key={tone} progress={65} tone={tone} label={`Progresso ${tone}`} />
      ))}
    </Flex>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Flex flexDirection="column" gap="small" width={400}>
      <ProgressBar progress={50} size="small" label="Small" />
      <ProgressBar progress={50} size="medium" label="Medium" />
      <ProgressBar progress={50} size="large" label="Large" />
    </Flex>
  ),
};

export const Complete: Story = {
  args: { progress: 100, tone: 'success', label: 'Concluído' },
};

export const Indeterminate: Story = {
  args: { progress: 0, indeterminate: true, label: 'Carregando...' },
  parameters: {
    docs: {
      description: {
        story: 'Variant indeterminada — para operações sem progresso conhecido. **Atenção:** atualmente a animação **só funciona em web**; em RN o fill fica estático (PB-5 — pendente split `.native.tsx`).',
      },
    },
  },
};
