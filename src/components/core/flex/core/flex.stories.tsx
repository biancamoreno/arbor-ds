import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from '../../box';
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
  <Box
    paddingX="medium"
    paddingY="small"
    backgroundColor="semantic.brand.base"
    borderRadius="small"
    color="semantic.text.inverse"
  >
    {children}
  </Box>
);

export const Row: Story = {
  render: () => (
    <Flex gap="small" padding="medium">
      <Item>A</Item>
      <Item>B</Item>
      <Item>C</Item>
    </Flex>
  ),
};

export const Column: Story = {
  render: () => (
    <Flex flexDirection="column" gap="small" padding="medium">
      <Item>Topo</Item>
      <Item>Meio</Item>
      <Item>Base</Item>
    </Flex>
  ),
};

export const Centered: Story = {
  render: () => (
    <Flex
      justifyContent="center"
      alignItems="center"
      height={120}
      backgroundColor="semantic.surface.highlight"
      gap="small"
    >
      <Item>Centro</Item>
    </Flex>
  ),
};

export const SpaceBetween: Story = {
  render: () => (
    <Flex justifyContent="space-between" padding="medium" backgroundColor="semantic.surface.highlight">
      <Item>Esquerda</Item>
      <Item>Direita</Item>
    </Flex>
  ),
};
