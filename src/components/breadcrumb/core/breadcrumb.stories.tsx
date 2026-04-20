import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumb } from './breadcrumb';

const meta = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Breadcrumb>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#">Início</Breadcrumb.Link>
          <Breadcrumb.Separator />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#">Produtos</Breadcrumb.Link>
          <Breadcrumb.Separator />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Breadcrumb.Current>Camiseta Azul</Breadcrumb.Current>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb>
  ),
};

export const WithCustomSeparator: Story = {
  render: () => (
    <Breadcrumb>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
          <Breadcrumb.Separator>›</Breadcrumb.Separator>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#">Categorias</Breadcrumb.Link>
          <Breadcrumb.Separator>›</Breadcrumb.Separator>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Breadcrumb.Current>Design Systems</Breadcrumb.Current>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb>
  ),
};

export const Long: Story = {
  render: () => (
    <Breadcrumb>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#">Início</Breadcrumb.Link>
          <Breadcrumb.Separator />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#">Minha Conta</Breadcrumb.Link>
          <Breadcrumb.Separator />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#">Pedidos</Breadcrumb.Link>
          <Breadcrumb.Separator />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Breadcrumb.Current>Pedido #12345</Breadcrumb.Current>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb>
  ),
};
