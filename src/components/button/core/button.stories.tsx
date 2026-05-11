import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button, IconButton } from '../core';
import { Flex, Icon } from '../../core';
import { Text } from '../../core/text';

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

export const Anatomy: Story = {
  name: 'Anatomia — variants × sizes (matriz)',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="720px">
      <Text variant="overline" color="text.tertiary">
        Quatro variants × três sizes. Cores resolvem via recipe `button` →
        `tokens.components.button.colors.*` (themable). Sizes consomem
        `theme.sizes.control.*`.
      </Text>
      {(['primary', 'secondary', 'ghost', 'danger'] as const).map((variant) => (
        <Flex key={variant} gap="small" alignItems="center">
          <Text variant="caption" color="text.tertiary" minWidth={80}>
            {variant}
          </Text>
          <Button variant={variant} size="small">Small</Button>
          <Button variant={variant} size="medium">Medium</Button>
          <Button variant={variant} size="large">Large</Button>
        </Flex>
      ))}
    </Flex>
  ),
};

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

export const WithIcon: Story = {
  name: 'Composição — Icon + label',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        Componha `Icon` como filho — gap entre ícone e label vem do recipe
        (`tokens.components.button.gap`).
      </Text>
      <Flex gap="small" flexWrap="wrap">
        <Button variant="primary">
          <Icon name="Plus" size="small" decorative />
          Adicionar item
        </Button>
        <Button variant="secondary">
          <Icon name="Download" size="small" decorative />
          Baixar relatório
        </Button>
        <Button variant="ghost">
          <Icon name="ExternalLink" size="small" decorative />
          Abrir externo
        </Button>
        <Button variant="danger">
          <Icon name="Trash2" size="small" decorative />
          Excluir
        </Button>
      </Flex>
    </Flex>
  ),
};

export const LoadingAndDisabled: Story = {
  name: 'Estados — loading e disabled',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        `loading` exibe `Spinner` e bloqueia interação. `disabled` fade via
        `opacity.disabled` (themable) e bloqueia `onClick` em qualquer `as`.
        Foco visível (Tab) usa `focus.ring` automaticamente — herdado do
        `Clickable` (PCV-7).
      </Text>
      <Flex gap="small" flexWrap="wrap">
        <Button variant="primary" loading>Salvando…</Button>
        <Button variant="primary" disabled>Desabilitado</Button>
        <Button variant="secondary" disabled>Desabilitado</Button>
        <Button variant="ghost" disabled>Desabilitado</Button>
        <Button variant="danger" disabled>Desabilitado</Button>
      </Flex>
    </Flex>
  ),
};

export const IconButtonShowcase: Story = {
  name: 'IconButton — sizes × shape × variant',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        `IconButton` consome `theme.sizes.control.*` (themable) e
        `theme.radii.full`/`small` para `shape='circle'|'square'`. Mesma cascade
        de variants do `Button`.
      </Text>
      <Flex gap="small" alignItems="center">
        <Text variant="caption" color="text.tertiary" minWidth={80}>
          circle
        </Text>
        <IconButton aria-label="Fechar (small)" shape="circle" size="small">
          <Icon name="X" decorative size="small" />
        </IconButton>
        <IconButton aria-label="Fechar (medium)" shape="circle" size="medium">
          <Icon name="X" decorative size="medium" />
        </IconButton>
        <IconButton aria-label="Fechar (large)" shape="circle" size="large">
          <Icon name="X" decorative size="large" />
        </IconButton>
      </Flex>
      <Flex gap="small" alignItems="center">
        <Text variant="caption" color="text.tertiary" minWidth={80}>
          square
        </Text>
        <IconButton aria-label="Adicionar (small)" shape="square" size="small">
          <Icon name="Plus" decorative size="small" />
        </IconButton>
        <IconButton aria-label="Adicionar (medium)" shape="square" size="medium">
          <Icon name="Plus" decorative size="medium" />
        </IconButton>
        <IconButton aria-label="Adicionar (large)" shape="square" size="large">
          <Icon name="Plus" decorative size="large" />
        </IconButton>
      </Flex>
      <Flex gap="small" alignItems="center">
        <Text variant="caption" color="text.tertiary" minWidth={80}>
          variants
        </Text>
        <IconButton aria-label="Primary" variant="primary">
          <Icon name="Check" decorative />
        </IconButton>
        <IconButton aria-label="Secondary" variant="secondary">
          <Icon name="Settings" decorative />
        </IconButton>
        <IconButton aria-label="Ghost" variant="ghost">
          <Icon name="Search" decorative />
        </IconButton>
        <IconButton aria-label="Danger" variant="danger">
          <Icon name="Trash2" decorative />
        </IconButton>
      </Flex>
    </Flex>
  ),
};
