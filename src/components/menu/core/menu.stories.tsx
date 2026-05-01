import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Menu } from './menu';
import { Box, Text, Clickable } from '../../core';

const meta = {
  title: 'Overlay/Menu',
  component: Menu,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Menu.Root>
      <Menu.Trigger>
        <button style={{ padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}>
          Ações ▾
        </button>
      </Menu.Trigger>
      <Menu.Content label="Menu de ações">
        <Menu.Item onSelect={fn()}>Editar</Menu.Item>
        <Menu.Item onSelect={fn()}>Duplicar</Menu.Item>
        <Menu.Separator />
        <Menu.Item onSelect={fn()}>Arquivar</Menu.Item>
        <Menu.Item onSelect={fn()} disabled>Excluir (sem permissão)</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  ),
};

export const InsideOverflowClip: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <Box padding="large">
      <Text as="p" color="text.secondary" marginBottom="medium">
        O container abaixo tem <Text as="code">overflow: hidden</Text>; o Menu renderiza via Portal e escapa do clip.
      </Text>
      <Box
        width="220px"
        height="80px"
        overflow="hidden"
        borderWidth="2px"
        borderStyle="dashed"
        borderColor="border.subtle"
        borderRadius="medium"
        padding="medium"
      >
        <Menu.Root defaultOpen>
          <Menu.Trigger asChild>
            <Clickable as="button" type="button" paddingX="medium" paddingY="small" borderRadius="small" backgroundColor="surface.default">
              Ações ▾
            </Clickable>
          </Menu.Trigger>
          <Menu.Content label="Menu escapa do clip">
            <Menu.Item onSelect={fn()}>Editar</Menu.Item>
            <Menu.Item onSelect={fn()}>Duplicar</Menu.Item>
            <Menu.Separator />
            <Menu.Item onSelect={fn()}>Arquivar</Menu.Item>
          </Menu.Content>
        </Menu.Root>
      </Box>
    </Box>
  ),
};

export const WithLabels: Story = {
  render: () => (
    <Menu.Root>
      <Menu.Trigger>
        <button style={{ padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}>
          Conta ▾
        </button>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Label>Configurações</Menu.Label>
        <Menu.Item onSelect={fn()}>Perfil</Menu.Item>
        <Menu.Item onSelect={fn()}>Segurança</Menu.Item>
        <Menu.Separator />
        <Menu.Label>Sessão</Menu.Label>
        <Menu.Item onSelect={fn()}>Sair</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  ),
};
