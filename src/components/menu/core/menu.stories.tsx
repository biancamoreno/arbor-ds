import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Menu } from './menu';

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
