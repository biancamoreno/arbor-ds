import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Flex, Icon } from '../../core';
import { Chip } from './chip';

const meta = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: { type: 'select' }, options: ['filled', 'outlined', 'subtle'] },
    size: { control: { type: 'select' }, options: ['sm', 'md'] },
    tone: { control: { type: 'select' }, options: ['neutral', 'brand'] },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Chip>
      <Chip.Label>React</Chip.Label>
    </Chip>
  ),
};

export const WithRemove: Story = {
  render: () => (
    <Chip>
      <Chip.Label>TypeScript</Chip.Label>
      <Chip.Remove onClick={fn()} label="Remover TypeScript" />
    </Chip>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Chip>
      <Chip.Icon><Icon name="Tag" size="xsmall" /></Chip.Icon>
      <Chip.Label>Vite</Chip.Label>
    </Chip>
  ),
};

export const Selected: Story = {
  render: () => (
    <Chip selected>
      <Chip.Label>Selecionado</Chip.Label>
    </Chip>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <Flex gap="small">
      {(['filled', 'outlined', 'subtle'] as const).map((variant) => (
        <Chip key={variant} variant={variant}>
          <Chip.Label>{variant}</Chip.Label>
        </Chip>
      ))}
    </Flex>
  ),
};

export const Tags: Story = {
  render: () => (
    <Flex gap="small" flexWrap="wrap">
      {['React', 'TypeScript', 'Vite', 'Storybook', 'Arbor DS'].map((tag) => (
        <Chip key={tag} variant="outlined">
          <Chip.Label>{tag}</Chip.Label>
          <Chip.Remove onClick={fn()} label={`Remover ${tag}`} />
        </Chip>
      ))}
    </Flex>
  ),
};
