import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex } from '../../core';
import { Text } from '../../core/text';
import { Icon } from '../../core/icon';
import { Avatar } from '../../avatar';
import { IconButton } from '../../button';
import { Badge } from './badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    tone: {
      control: { type: 'select' },
      options: ['neutral', 'brand', 'info', 'success', 'warning', 'critical'],
    },
    variant: { control: { type: 'radio' }, options: ['solid', 'subtle'] },
    size: { control: { type: 'radio' }, options: ['small', 'medium'] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj;

export const Anatomy: Story = {
  name: 'Anatomia — indicador denso (`<span>`, não-interativo)',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        `Badge` é um indicador denso textual/numérico. Não aceita
        `onClick`/`selected`/`disabled`. Para indicador clicável/selecionável,
        use `Chip` (`selectable: boolean`, RFC-0033). Tipicamente sobreposto
        a um elemento via `Badge.Anchor`.
      </Text>
      <Flex gap="small" alignItems="center">
        <Badge>3</Badge>
        <Badge tone="brand">Novo</Badge>
        <Badge tone="critical">99+</Badge>
        <Badge tone="success" variant="subtle">OK</Badge>
      </Flex>
    </Flex>
  ),
};

export const Default: Story = {
  args: { children: '3', tone: 'neutral', variant: 'solid', size: 'medium' },
};

export const ToneMatrix: Story = {
  name: 'Tones — neutral / brand / info / success / warning / critical',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="720px">
      <Text variant="overline" color="text.tertiary">
        Matriz `tone × variant`. `solid` é o default (alta saliência); `subtle`
        para badges inline em linhas de metadados.
      </Text>
      {(['neutral', 'brand', 'info', 'success', 'warning', 'critical'] as const).map((tone) => (
        <Flex key={tone} gap="small" alignItems="center">
          <Text variant="caption" color="text.tertiary" minWidth={80}>
            {tone}
          </Text>
          <Badge tone={tone} variant="solid">solid</Badge>
          <Badge tone={tone} variant="subtle">subtle</Badge>
        </Flex>
      ))}
    </Flex>
  ),
};

export const SolidEmphasis: Story = {
  name: 'Variant solid — enfático (default)',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        `variant='solid'` (default): preenchimento opaco. Alta saliência —
        notificações, contagens críticas.
      </Text>
      <Flex gap="small" flexWrap="wrap" alignItems="center">
        <Badge>1</Badge>
        <Badge tone="brand">Novo</Badge>
        <Badge tone="info">Info</Badge>
        <Badge tone="success">OK</Badge>
        <Badge tone="warning">Pendente</Badge>
        <Badge tone="critical">99+</Badge>
      </Flex>
    </Flex>
  ),
};

export const SubtleInline: Story = {
  name: 'Variant subtle — discreto, para uso inline',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        `variant='subtle'`: fundo discreto + texto saturado. Para badges em
        linhas de metadados onde o contraste sólido seria ruído.
      </Text>
      <Flex gap="small" flexWrap="wrap">
        <Badge variant="subtle">Padrão</Badge>
        <Badge tone="brand" variant="subtle">Beta</Badge>
        <Badge tone="info" variant="subtle">Info</Badge>
        <Badge tone="success" variant="subtle">Ativo</Badge>
        <Badge tone="warning" variant="subtle">Atenção</Badge>
        <Badge tone="critical" variant="subtle">Erro</Badge>
      </Flex>
    </Flex>
  ),
};

export const Sizes: Story = {
  name: 'Sizes — small / medium (apenas padding muda; fonte permanece xsmall)',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        Badge é sempre ultradenso por identidade. `small` aperta padding
        horizontal para uso sobre ícones; `medium` para uso inline em
        labels/headers.
      </Text>
      <Flex gap="medium" alignItems="center">
        <Badge size="small" tone="brand">SM</Badge>
        <Badge size="medium" tone="brand">MD</Badge>
      </Flex>
    </Flex>
  ),
};

export const Content: Story = {
  name: 'Conteúdo — contagem / overflow / ícone / dot',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        Padrões canônicos de conteúdo: número, overflow `"99+"`, ícone +
        número, ou dot (sem children + ícone único).
      </Text>
      <Flex gap="medium" alignItems="center">
        <Badge tone="critical">3</Badge>
        <Badge tone="critical">99+</Badge>
        <Badge tone="success" icon={<Icon name="Check" size="xsmall" decorative />}>5</Badge>
        <Badge tone="warning" icon={<Icon name="TriangleAlert" size="xsmall" decorative />}>Atenção</Badge>
        <Badge tone="brand" size="small" icon={<Icon name="Sparkles" size="xsmall" decorative />} />
      </Flex>
    </Flex>
  ),
};

export const OverAvatar: Story = {
  name: 'Composição — Badge.Anchor sobre Avatar',
  render: () => (
    <Flex gap="large" alignItems="center">
      <Badge.Anchor badge={<Badge tone="critical" size="small">3</Badge>}>
        <Avatar size="medium">
          <Avatar.Image src="https://i.pravatar.cc/80?img=12" alt="Ana" />
          <Avatar.Fallback>AN</Avatar.Fallback>
        </Avatar>
      </Badge.Anchor>
      <Badge.Anchor badge={<Badge tone="success" size="small" icon={<Icon name="Check" size="xsmall" decorative />} />}>
        <Avatar size="medium">
          <Avatar.Image src="https://i.pravatar.cc/80?img=33" alt="Carla" />
          <Avatar.Fallback>CA</Avatar.Fallback>
        </Avatar>
      </Badge.Anchor>
      <Badge.Anchor badge={<Badge tone="warning" size="small">!</Badge>}>
        <Avatar size="medium">
          <Avatar.Fallback>JD</Avatar.Fallback>
        </Avatar>
      </Badge.Anchor>
    </Flex>
  ),
};

export const OverIconButton: Story = {
  name: 'Composição — Badge.Anchor sobre IconButton',
  render: () => (
    <Flex gap="large" alignItems="center">
      <Badge.Anchor badge={<Badge tone="critical" size="small">7</Badge>}>
        <IconButton aria-label="Notificações" variant="ghost">
          <Icon name="Bell" decorative />
        </IconButton>
      </Badge.Anchor>
      <Badge.Anchor badge={<Badge tone="brand" size="small">2</Badge>}>
        <IconButton aria-label="Mensagens" variant="ghost">
          <Icon name="Mail" decorative />
        </IconButton>
      </Badge.Anchor>
    </Flex>
  ),
};
