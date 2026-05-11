import type { Meta, StoryObj } from '@storybook/react-vite';
import { Square } from './square';
import { Flex } from '../../flex';
import { Text } from '../../text';

const meta = {
  title: 'Core/Layout/Square',
  component: Square,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Square>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: 'Anatomia — proporção fixa 1:1',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="700px">
      <Text variant="overline" color="text.tertiary">
        `Square` força `width === height === size`. Default centraliza filhos.
      </Text>
      <Flex alignItems="flex-end" gap="medium">
        {([48, 64, 96, 128] as const).map((size) => (
          <Flex key={size} flexDirection="column" alignItems="center" gap="xsmall">
            <Square size={size} backgroundColor="brand.solid" color="text.inverse" borderRadius="medium">
              <Text>{size}</Text>
            </Square>
            <Text variant="caption" color="text.secondary">size={size}</Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  ),
};

export const CenterContentOff: Story = {
  name: 'Anatomia — `centerContent={false}` (sem centralizar)',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="700px">
      <Text variant="overline" color="text.tertiary">
        Passe `centerContent={false}` para desligar a centralização automática.
      </Text>
      <Square size={120} centerContent={false} backgroundColor="brand.bgSubtle" padding="small" borderRadius="medium">
        <Text variant="caption">conteúdo top-left</Text>
      </Square>
    </Flex>
  ),
};
