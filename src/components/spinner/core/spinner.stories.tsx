import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from './spinner';

const meta = {
  title: 'Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: { type: 'select' }, options: ['sm', 'md', 'lg'] },
    color: { control: 'color' },
    label: { control: 'text' },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { size: 'md', label: 'Carregando' },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};

export const CustomColor: Story = {
  args: { size: 'md', color: '#10b981', label: 'Processando' },
};
