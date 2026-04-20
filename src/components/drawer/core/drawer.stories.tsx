import type { Meta, StoryObj } from '@storybook/react-vite';
import { Drawer } from './drawer';

const meta = {
  title: 'Overlay/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj;

export const Right: Story = {
  render: () => (
    <Drawer.Root defaultOpen={false}>
      <Drawer.Trigger>
        <button style={{ padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}>
          Abrir Drawer (direita)
        </button>
      </Drawer.Trigger>
      <Drawer.Overlay />
      <Drawer.Content size="md">
        <Drawer.Title>Painel Lateral</Drawer.Title>
        <div style={{ marginTop: 16 }}>
          <p>Conteúdo do drawer lateral.</p>
          <p>Navegue usando Tab para acessar todos os elementos.</p>
        </div>
        <Drawer.Close label="Fechar" />
      </Drawer.Content>
    </Drawer.Root>
  ),
};

export const Left: Story = {
  render: () => (
    <Drawer.Root defaultOpen={false} placement="left">
      <Drawer.Trigger>
        <button style={{ padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}>
          Abrir Drawer (esquerda)
        </button>
      </Drawer.Trigger>
      <Drawer.Overlay />
      <Drawer.Content>
        <Drawer.Title>Menu lateral</Drawer.Title>
        <nav style={{ marginTop: 16 }}>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><a href="#">Início</a></li>
            <li><a href="#">Produtos</a></li>
            <li><a href="#">Sobre</a></li>
            <li><a href="#">Contato</a></li>
          </ul>
        </nav>
      </Drawer.Content>
    </Drawer.Root>
  ),
};

export const Bottom: Story = {
  render: () => (
    <Drawer.Root defaultOpen={false} placement="bottom">
      <Drawer.Trigger>
        <button style={{ padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}>
          Abrir Drawer (bottom)
        </button>
      </Drawer.Trigger>
      <Drawer.Overlay />
      <Drawer.Content>
        <Drawer.Title>Ações</Drawer.Title>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button style={{ padding: '12px', borderRadius: 4, border: '1px solid #eee', cursor: 'pointer' }}>Compartilhar</button>
          <button style={{ padding: '12px', borderRadius: 4, border: '1px solid #eee', cursor: 'pointer' }}>Editar</button>
          <button style={{ padding: '12px', borderRadius: 4, border: '1px solid #f00', color: '#f00', cursor: 'pointer' }}>Excluir</button>
        </div>
      </Drawer.Content>
    </Drawer.Root>
  ),
};
