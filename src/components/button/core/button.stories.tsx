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
    size: { control: { type: 'select' }, options: ['small', 'medium', 'large'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  args: { children: 'Botão primário', variant: 'primary', size: 'medium' },
};

export const Secondary: Story = {
  args: { children: 'Botão secundário', variant: 'secondary', size: 'medium' },
};

export const Ghost: Story = {
  args: { children: 'Botão ghost', variant: 'ghost', size: 'medium' },
};

export const Danger: Story = {
  args: { children: 'Excluir', variant: 'danger', size: 'medium' },
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
      <Button size="small">Pequeno</Button>
      <Button size="medium">Médio</Button>
      <Button size="large">Grande</Button>
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
