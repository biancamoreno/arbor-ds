import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex } from './flex';

const meta = {
  title: 'Core/Layout/Flex',
  component: Flex,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Flex>;

export default meta;
type Story = StoryObj;

const Item = ({ children }: { children: React.ReactNode }) => (
  <div style={{ padding: '8px 16px', background: '#4a90e2', color: '#fff', borderRadius: 4 }}>
    {children}
  </div>
);

export const Row: Story = {
  render: () => (
    <Flex style={{ gap: 8, padding: 16 }}>
      <Item>A</Item>
      <Item>B</Item>
      <Item>C</Item>
    </Flex>
  ),
};

export const Column: Story = {
  render: () => (
    <Flex style={{ flexDirection: 'column', gap: 8, padding: 16 }}>
      <Item>Topo</Item>
      <Item>Meio</Item>
      <Item>Base</Item>
    </Flex>
  ),
};

export const Centered: Story = {
  render: () => (
    <Flex style={{ justifyContent: 'center', alignItems: 'center', height: 120, background: '#f5f5f5', gap: 8 }}>
      <Item>Centro</Item>
    </Flex>
  ),
};

export const SpaceBetween: Story = {
  render: () => (
    <Flex style={{ justifyContent: 'space-between', padding: 16, background: '#f5f5f5' }}>
      <Item>Esquerda</Item>
      <Item>Direita</Item>
    </Flex>
  ),
};
