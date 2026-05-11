import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex } from '../../core';
import { Text } from '../../core/text';
import { Icon } from '../../core/icon';
import { Avatar, AvatarGroup } from './avatar';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: { type: 'select' }, options: ['xsmall', 'small', 'medium', 'large', 'xlarge'] },
    shape: { control: { type: 'radio' }, options: ['circle', 'square'] },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj;

export const Anatomy: Story = {
  name: 'Anatomia — compound Image / Fallback / Group',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        `Avatar.Root` controla `size` (SP-1) e `shape` (`circle`/`square`).
        `Avatar.Image` carrega a foto via `&lt;Image&gt;` do DS (RFC-0011/0012,
        cross-platform). `Avatar.Fallback` cobre loading/erro com iniciais ou
        conteúdo livre — `delayMs` evita flash.
      </Text>
      <Flex gap="medium" alignItems="center">
        <Avatar size="medium">
          <Avatar.Image src="https://i.pravatar.cc/120?img=12" alt="Ana" />
          <Avatar.Fallback>AN</Avatar.Fallback>
        </Avatar>
        <Avatar size="medium">
          <Avatar.Fallback>JD</Avatar.Fallback>
        </Avatar>
        <Avatar size="medium">
          <Avatar.Fallback>
            <Icon name="User" size="small" decorative />
          </Avatar.Fallback>
        </Avatar>
      </Flex>
      <Text variant="caption" color="text.tertiary">
        Da esquerda: foto carregada · iniciais · ícone genérico (fallback livre).
      </Text>
    </Flex>
  ),
};

export const Default: Story = {
  args: { size: 'medium', shape: 'circle' },
  render: (args) => (
    <Avatar {...args}>
      <Avatar.Image src="https://i.pravatar.cc/120?img=20" alt="Usuário" />
      <Avatar.Fallback>US</Avatar.Fallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  name: 'Sizes — xsmall / small / medium / large / xlarge (SP-1)',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        Tamanhos resolvem via `theme.sizes.avatar.{'{size}'}`. Fonte do
        fallback escala automaticamente com `theme.fontSizes` por size.
      </Text>
      <Flex gap="small" alignItems="center">
        {(['xsmall', 'small', 'medium', 'large', 'xlarge'] as const).map((size, i) => (
          <Avatar key={size} size={size}>
            <Avatar.Image src={`https://i.pravatar.cc/120?img=${i + 30}`} alt={`Usuário ${size}`} />
            <Avatar.Fallback>U{i + 1}</Avatar.Fallback>
          </Avatar>
        ))}
      </Flex>
    </Flex>
  ),
};

export const Shapes: Story = {
  name: 'Shapes — circle (default) / square',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        `shape='circle'` (default): borderRadius `full` — padrão para pessoas.
        `shape='square'`: borderRadius `small` — para logotipos, marcas,
        produtos. Override via `theme.components.avatar.borderRadius.{'{shape}'}`.
      </Text>
      <Flex gap="medium" alignItems="center">
        <Avatar size="large" shape="circle">
          <Avatar.Image src="https://i.pravatar.cc/120?img=49" alt="Pessoa" />
          <Avatar.Fallback>P</Avatar.Fallback>
        </Avatar>
        <Avatar size="large" shape="square">
          <Avatar.Fallback>LO</Avatar.Fallback>
        </Avatar>
      </Flex>
    </Flex>
  ),
};

export const FallbackVariants: Story = {
  name: 'Fallback — iniciais, ícone genérico, conteúdo customizado',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        `Avatar.Fallback` aceita qualquer conteúdo. Diretrizes: 1–2 iniciais
        para usuário identificável, ícone para "usuário genérico", evite
        textos longos. `delayMs` evita o flash quando a foto carrega rápido.
      </Text>
      <Flex gap="medium" alignItems="center">
        <Avatar size="medium">
          <Avatar.Fallback>AS</Avatar.Fallback>
        </Avatar>
        <Avatar size="medium">
          <Avatar.Fallback>
            <Icon name="User" size="small" decorative />
          </Avatar.Fallback>
        </Avatar>
        <Avatar size="medium">
          <Avatar.Image src="invalid://url" alt="Imagem quebrada" />
          <Avatar.Fallback delayMs={200}>FB</Avatar.Fallback>
        </Avatar>
      </Flex>
      <Text variant="caption" color="text.tertiary">
        Última: imagem inválida + `delayMs={200}` — fallback aparece após o
        atraso, evitando flash quando a foto carrega rapidamente.
      </Text>
    </Flex>
  ),
};

export const Group: Story = {
  name: 'AvatarGroup — empilhamento + contador `+N`',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        `AvatarGroup` sobrepõe avatares com `theme.sizes.avatarOverlap.{'{size}'}`.
        `max` limita os visíveis; o restante vira contador `+N` cuja anatomia
        (background/color) é resolvida pelo slot `overflow` da recipe.
      </Text>
      <Flex gap="large" alignItems="center">
        <AvatarGroup max={4}>
          {Array.from({ length: 7 }, (_, i) => (
            <Avatar key={i} size="medium">
              <Avatar.Image src={`https://i.pravatar.cc/120?img=${i + 5}`} alt={`Usuário ${i + 1}`} />
              <Avatar.Fallback>U{i + 1}</Avatar.Fallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </Flex>
    </Flex>
  ),
};

export const GroupSizes: Story = {
  name: 'AvatarGroup — sizes (overlap escala por size)',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="720px">
      <Text variant="overline" color="text.tertiary">
        Overlap em `xsmall/small` é tighter; em `large/xlarge` é mais
        respirável. Anel via `shadows.avatarRing` (web) ou `borderWidth: 2 +
        borderColor: 'surface.default'` (native, RFC-0035).
      </Text>
      {(['small', 'medium', 'large'] as const).map((size) => (
        <Flex key={size} gap="small" alignItems="center">
          <Text variant="caption" color="text.tertiary" minWidth={80}>{size}</Text>
          <AvatarGroup size={size} max={3}>
            {Array.from({ length: 5 }, (_, i) => (
              <Avatar key={i}>
                <Avatar.Image src={`https://i.pravatar.cc/120?img=${i + 10}`} alt={`U${i + 1}`} />
                <Avatar.Fallback>U{i + 1}</Avatar.Fallback>
              </Avatar>
            ))}
          </AvatarGroup>
        </Flex>
      ))}
    </Flex>
  ),
};
