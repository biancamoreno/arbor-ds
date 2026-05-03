import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex } from '../../core';
import { Spinner } from './spinner';

const meta = {
  title: 'Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: { type: 'select' }, options: ['small', 'medium', 'large'] },
    color: { control: 'color' },
    label: { control: 'text' },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { size: 'medium', label: 'Carregando' },
};

export const Sizes: Story = {
  render: () => (
    <Flex gap="medium" alignItems="center">
      <Spinner size="small" />
      <Spinner size="medium" />
      <Spinner size="large" />
    </Flex>
  ),
};

export const CustomColor: Story = {
  args: { size: 'medium', color: '#10b981', label: 'Processando' },
};
