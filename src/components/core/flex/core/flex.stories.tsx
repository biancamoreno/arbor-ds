import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from '../../box';
import { Flex } from './flex';
import { Text } from '../../text';

const meta = {
  title: 'Core/Layout/Flex',
  component: Flex,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Flex>;

export default meta;
type Story = StoryObj;

const Item = ({ children }: { children: React.ReactNode }) => (
  <Box
    paddingX="medium"
    paddingY="small"
    backgroundColor="brand.solid"
    borderRadius="small"
    color="text.inverse"
  >
    {children}
  </Box>
);

export const Row: Story = {
  name: 'Anatomia — row (default)',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="700px">
      <Text variant="overline" color="text.tertiary">
        `Flex` aplica `display: flex` por construção. Default `flexDirection: row`.
      </Text>
      <Flex gap="small" padding="medium" backgroundColor="background.subtle" borderRadius="medium">
        <Item>A</Item>
        <Item>B</Item>
        <Item>C</Item>
      </Flex>
    </Flex>
  ),
};

export const Column: Story = {
  name: 'Anatomia — column',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="700px">
      <Text variant="overline" color="text.tertiary">
        `flexDirection="column"` para stack vertical.
      </Text>
      <Flex flexDirection="column" gap="small" padding="medium" backgroundColor="background.subtle" borderRadius="medium">
        <Item>Topo</Item>
        <Item>Meio</Item>
        <Item>Base</Item>
      </Flex>
    </Flex>
  ),
};

export const Alignment: Story = {
  name: 'Composição — alinhamento',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="700px">
      <Text variant="overline" color="text.tertiary">
        Combine `justifyContent` (eixo principal) com `alignItems` (eixo cruzado).
      </Text>
      <Flex
        justifyContent="center"
        alignItems="center"
        height={120}
        backgroundColor="background.subtle"
        borderRadius="medium"
        gap="small"
      >
        <Item>justify=center · align=center</Item>
      </Flex>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        padding="medium"
        backgroundColor="background.subtle"
        borderRadius="medium"
      >
        <Item>Esquerda</Item>
        <Item>Direita</Item>
      </Flex>
      <Flex
        justifyContent="space-around"
        alignItems="center"
        padding="medium"
        backgroundColor="background.subtle"
        borderRadius="medium"
      >
        <Item>A</Item>
        <Item>B</Item>
        <Item>C</Item>
      </Flex>
    </Flex>
  ),
};

export const Wrap: Story = {
  name: 'Anatomia — flexWrap',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="500px">
      <Text variant="overline" color="text.tertiary">
        `flexWrap="wrap"` quebra para próxima linha quando não cabe.
      </Text>
      <Flex flexWrap="wrap" gap="small" padding="medium" backgroundColor="background.subtle" borderRadius="medium">
        {Array.from({ length: 12 }).map((_, i) => (
          <Item key={i}>Item {i + 1}</Item>
        ))}
      </Flex>
    </Flex>
  ),
};
