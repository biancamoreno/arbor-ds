import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Tag } from './tag';

const meta = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    tone: { control: { type: 'select' }, options: ['neutral', 'brand'] },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { children: 'Tag padrão', tone: 'neutral' },
};

export const Brand: Story = {
  args: { children: 'Tag brand', tone: 'brand' },
};

export const Selected: Story = {
  args: { children: 'Selecionada', selected: true },
};

export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Tag tone="neutral">Neutral</Tag>
      <Tag tone="brand">Brand</Tag>
      <Tag tone="neutral" selected>Selecionada</Tag>
      <Tag disabled>Desabilitada</Tag>
    </div>
  ),
};
