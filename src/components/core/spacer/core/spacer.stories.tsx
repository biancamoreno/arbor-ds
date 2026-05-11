import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spacer } from './spacer';
import { Box } from '../../box';
import { Flex } from '../../flex';
import { Text } from '../../text';

const meta = {
  title: 'Core/Layout/Spacer',
  component: Spacer,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Spacer>;

export default meta;
type Story = StoryObj;

const Pill = ({ children }: { children: React.ReactNode }) => (
  <Box paddingX="medium" paddingY="small" backgroundColor="brand.solid" color="text.inverse" borderRadius="small">
    {children}
  </Box>
);

export const PushApart: Story = {
  name: 'Anatomia — empurra irmãos para extremidades',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="700px">
      <Text variant="overline" color="text.tertiary">
        `Spacer` consome todo espaço disponível (`flex: 1`), separando os elementos vizinhos.
      </Text>
      <Flex alignItems="center" padding="medium" backgroundColor="background.subtle" borderRadius="medium">
        <Pill>Esquerda</Pill>
        <Spacer />
        <Pill>Direita</Pill>
      </Flex>
    </Flex>
  ),
};

export const ToolbarLike: Story = {
  name: 'Composição — toolbar (logo · grupo · ação)',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="700px">
      <Text variant="overline" color="text.tertiary">
        Useful para layouts de toolbar onde itens centrais agrupam-se e o último vai pra direita.
      </Text>
      <Flex alignItems="center" gap="small" padding="medium" backgroundColor="background.subtle" borderRadius="medium">
        <Pill>Logo</Pill>
        <Pill>Item A</Pill>
        <Pill>Item B</Pill>
        <Spacer />
        <Pill>Sair</Pill>
      </Flex>
    </Flex>
  ),
};
