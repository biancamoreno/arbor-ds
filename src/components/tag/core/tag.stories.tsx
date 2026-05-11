import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex } from '../../core';
import { Text } from '../../core/text';
import { Tag } from './tag';

const meta = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    tone: {
      control: { type: 'select' },
      options: ['neutral', 'brand', 'info', 'success', 'warning', 'critical'],
    },
    variant: { control: { type: 'radio' }, options: ['outline', 'solid'] },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj;

export const Anatomy: Story = {
  name: 'Anatomia — badge textual decorativo (`<span>`, não-interativo)',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        `Tag` é um badge textual decorativo. Não aceita `onClick`/`selected`/
        `disabled`. Para casos selecionáveis ou removíveis, use `Chip`
        (`selectable: boolean`, RFC-0033).
      </Text>
      <Flex gap="small" alignItems="center">
        <Tag>Etiqueta</Tag>
        <Tag tone="brand">Brand</Tag>
        <Tag tone="success" variant="solid">Ativo</Tag>
      </Flex>
    </Flex>
  ),
};

export const Default: Story = {
  args: { children: 'Tag padrão', tone: 'neutral', variant: 'outline' },
};

export const ToneMatrix: Story = {
  name: 'Tones — neutral / brand / info / success / warning / critical',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="720px">
      <Text variant="overline" color="text.tertiary">
        Matriz `tone × variant`. Tones de feedback (`success`/`warning`/
        `critical`/`info`) com parcimônia em grupos — carnaval visual quebra
        a varredura. Diretriz: 1 tone de feedback por grupo.
      </Text>
      {(['neutral', 'brand', 'info', 'success', 'warning', 'critical'] as const).map((tone) => (
        <Flex key={tone} gap="small" alignItems="center">
          <Text variant="caption" color="text.tertiary" minWidth={80}>
            {tone}
          </Text>
          <Tag tone={tone} variant="outline">outline</Tag>
          <Tag tone={tone} variant="solid">solid</Tag>
        </Flex>
      ))}
    </Flex>
  ),
};

export const OutlineDefault: Story = {
  name: 'Variant outline — discreto (default)',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        `variant='outline'` (default): borda hairline + background sutil + cor
        do texto saturada. Ideal para metadados, categorias, filtros estáticos.
      </Text>
      <Flex gap="small" flexWrap="wrap">
        <Tag>JavaScript</Tag>
        <Tag>TypeScript</Tag>
        <Tag tone="brand">Design System</Tag>
        <Tag tone="info">Beta</Tag>
        <Tag tone="success">Estável</Tag>
        <Tag tone="warning">Pré-release</Tag>
        <Tag tone="critical">Deprecated</Tag>
      </Flex>
    </Flex>
  ),
};

export const SolidEmphasis: Story = {
  name: 'Variant solid — enfático',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        `variant='solid'`: preenchimento opaco + texto inverso. Use quando o
        badge precisa ganhar peso visual — destaque de status crítico, label
        principal de uma row, "novo" em um menu.
      </Text>
      <Flex gap="small" flexWrap="wrap">
        <Tag variant="solid">Padrão</Tag>
        <Tag tone="brand" variant="solid">Novo</Tag>
        <Tag tone="info" variant="solid">Info</Tag>
        <Tag tone="success" variant="solid">OK</Tag>
        <Tag tone="warning" variant="solid">Atenção</Tag>
        <Tag tone="critical" variant="solid">Erro</Tag>
      </Flex>
    </Flex>
  ),
};

export const InRow: Story = {
  name: 'Composição — múltiplas tags ao lado de um label',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        Padrão típico de uso: linha com label principal + tags de categorização
        descritivas. Diretriz: máximo de 3-4 tags por linha para preservar
        legibilidade.
      </Text>
      <Flex alignItems="center" gap="small" flexWrap="wrap">
        <Text variant="bodyMedium" fontWeight="semibold">
          Projeto Arbor-DS
        </Text>
        <Tag>TypeScript</Tag>
        <Tag>React</Tag>
        <Tag tone="brand">Design System</Tag>
        <Tag tone="success" variant="solid">v1</Tag>
      </Flex>
    </Flex>
  ),
};
