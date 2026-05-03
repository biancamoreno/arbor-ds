import { useState } from 'react';
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
    tone: { control: { type: 'select' }, options: ['neutral', 'brand', 'success', 'warning', 'critical', 'info'] },
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

export const Decorative: Story = {
  render: () => (
    <Chip variant="filled" tone="warning">
      <Chip.Icon><Icon name="Bell" size="xsmall" decorative /></Chip.Icon>
      <Chip.Label>Pendente</Chip.Label>
    </Chip>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Modo padrão (sem `selectable`): Chip é puramente visual, renderiza `<span>`. Sem foco, sem teclado, sem `aria-pressed`.',
      },
    },
  },
};

export const Toggleable: Story = {
  render: () => {
    function ChipToggleableExample() {
      const [selected, setSelected] = useState(false);
      return (
        <Chip selectable selected={selected} onSelectedChange={setSelected}>
          <Chip.Label>Em estoque</Chip.Label>
        </Chip>
      );
    }
    return <ChipToggleableExample />;
  },
  parameters: {
    docs: {
      description: {
        story: '`selectable={true}` ativa modo interativo: Chip vira `<button>` focável com `aria-pressed` + ativação por Space/Enter.',
      },
    },
  },
};

export const ToggleableWithRemove: Story = {
  render: () => {
    function Example() {
      const [selected, setSelected] = useState(true);
      return (
        <Chip selectable selected={selected} onSelectedChange={setSelected}>
          <Chip.Icon><Icon name="Tag" size="xsmall" decorative /></Chip.Icon>
          <Chip.Label>Filtro ativo</Chip.Label>
          <Chip.Remove onClick={fn()} label="Remover filtro" />
        </Chip>
      );
    }
    return <Example />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Quando `selectable={true}`, o Root é `<button>`. `Chip.Remove` automaticamente vira `<span role="button">` para evitar nested-button no DOM.',
      },
    },
  },
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
