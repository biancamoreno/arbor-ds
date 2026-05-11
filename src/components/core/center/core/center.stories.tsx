import type { Meta, StoryObj } from '@storybook/react-vite';
import { Center } from './center';
import { Box } from '../../box';
import { Flex } from '../../flex';
import { Text } from '../../text';

const meta = {
  title: 'Core/Layout/Center',
  component: Center,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Center>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: 'Anatomia — centraliza nos dois eixos',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="700px">
      <Text variant="overline" color="text.tertiary">
        `Center` é um `Flex` pré-configurado com `alignItems="center"` + `justifyContent="center"`.
      </Text>
      <Center height="200px" backgroundColor="background.subtle" borderRadius="medium">
        <Box paddingX="medium" paddingY="small" backgroundColor="brand.solid" color="text.inverse" borderRadius="small">
          Conteúdo centrado
        </Box>
      </Center>
    </Flex>
  ),
};

export const EmptyState: Story = {
  name: 'Composição — empty state',
  render: () => (
    <Center
      height="280px"
      backgroundColor="background.subtle"
      borderRadius="medium"
      flexDirection="column"
      gap="small"
    >
      <Text variant="headingSmall">Nenhum resultado</Text>
      <Text variant="bodyMedium" color="text.secondary">
        Tente ajustar os filtros ou buscar por outro termo.
      </Text>
    </Center>
  ),
};
