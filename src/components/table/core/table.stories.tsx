import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table } from './table';

const meta = {
  title: 'Data/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj;

const users = [
  { id: 1, name: 'Ana Silva', email: 'ana@exemplo.com', role: 'Admin', status: 'Ativo' },
  { id: 2, name: 'Bruno Costa', email: 'bruno@exemplo.com', role: 'Editor', status: 'Ativo' },
  { id: 3, name: 'Carla Dias', email: 'carla@exemplo.com', role: 'Viewer', status: 'Inativo' },
  { id: 4, name: 'Daniel Moura', email: 'daniel@exemplo.com', role: 'Editor', status: 'Ativo' },
];

export const Default: Story = {
  render: () => (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Nome</Table.HeaderCell>
          <Table.HeaderCell>E-mail</Table.HeaderCell>
          <Table.HeaderCell>Função</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {users.map((user) => (
          <Table.Row key={user.id}>
            <Table.Cell>{user.name}</Table.Cell>
            <Table.Cell>{user.email}</Table.Cell>
            <Table.Cell>{user.role}</Table.Cell>
            <Table.Cell>{user.status}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ),
};

export const Scrollable: Story = {
  render: () => (
    <div style={{ maxWidth: 400 }}>
      <Table scrollable>
        <Table.Head>
          <Table.Row>
            {['ID', 'Nome', 'E-mail', 'Função', 'Status', 'Criado em'].map((h) => (
              <Table.HeaderCell key={h}>{h}</Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {users.map((user) => (
            <Table.Row key={user.id}>
              <Table.Cell>{user.id}</Table.Cell>
              <Table.Cell>{user.name}</Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>{user.role}</Table.Cell>
              <Table.Cell>{user.status}</Table.Cell>
              <Table.Cell>2024-01-15</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  ),
};
