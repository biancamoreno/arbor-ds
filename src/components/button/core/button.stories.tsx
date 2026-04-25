import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button, IconButton } from '../core';
import { Flex } from '../../core';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: { type: 'select' }, options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: { type: 'select' }, options: ['sm', 'md', 'lg'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  args: { children: 'Botão primário', variant: 'primary', size: 'md' },
};

export const Secondary: Story = {
  args: { children: 'Botão secundário', variant: 'secondary', size: 'md' },
};

export const Ghost: Story = {
  args: { children: 'Botão ghost', variant: 'ghost', size: 'md' },
};

export const Danger: Story = {
  args: { children: 'Excluir', variant: 'danger', size: 'md' },
};

export const Loading: Story = {
  args: { children: 'Salvando...', variant: 'primary', loading: true },
};

export const Disabled: Story = {
  args: { children: 'Desabilitado', variant: 'primary', disabled: true },
};

export const Sizes: Story = {
  render: () => (
    <Flex gap="12px" alignItems="center">
      <Button size="sm">Pequeno</Button>
      <Button size="md">Médio</Button>
      <Button size="lg">Grande</Button>
    </Flex>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <Flex gap="12px">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </Flex>
  ),
};

export const IconButtonExample: Story = {
  render: () => (
    <Flex gap="8px">
      <IconButton aria-label="Fechar" shape="circle">✕</IconButton>
      <IconButton aria-label="Adicionar" shape="square">+</IconButton>
    </Flex>
  ),
};
