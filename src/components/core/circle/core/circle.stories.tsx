import type { Meta, StoryObj } from '@storybook/react-vite';
import { Circle } from './circle';
import { Flex } from '../../flex';
import { Text } from '../../text';

const meta = {
  title: 'Core/Layout/Circle',
  component: Circle,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Circle>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: 'Anatomia — círculo (Square + `borderRadius="full"`)',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="700px">
      <Text variant="overline" color="text.tertiary">
        `Circle` é um `Square` com `borderRadius="full"`. Para avatar real, prefira `&lt;Avatar&gt;`.
      </Text>
      <Flex alignItems="flex-end" gap="medium">
        {([32, 48, 64, 96] as const).map((size) => (
          <Flex key={size} flexDirection="column" alignItems="center" gap="xsmall">
            <Circle size={size} backgroundColor="brand.solid" color="text.inverse">
              <Text variant="label">{size}</Text>
            </Circle>
            <Text variant="caption" color="text.secondary">size={size}</Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  ),
};

export const SemanticTones: Story = {
  name: 'Composição — marcador/dot semântico',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="700px">
      <Text variant="overline" color="text.tertiary">
        Circle pequeno serve como status dot. Para badge real, prefira `&lt;Badge&gt;`.
      </Text>
      <Flex alignItems="center" gap="large">
        <Flex alignItems="center" gap="xsmall">
          <Circle size={10} backgroundColor="feedback.success.solid" />
          <Text variant="caption">Online</Text>
        </Flex>
        <Flex alignItems="center" gap="xsmall">
          <Circle size={10} backgroundColor="feedback.warning.solid" />
          <Text variant="caption">Ausente</Text>
        </Flex>
        <Flex alignItems="center" gap="xsmall">
          <Circle size={10} backgroundColor="feedback.critical.solid" />
          <Text variant="caption">Indisponível</Text>
        </Flex>
        <Flex alignItems="center" gap="xsmall">
          <Circle size={10} backgroundColor="border.default" />
          <Text variant="caption">Offline</Text>
        </Flex>
      </Flex>
    </Flex>
  ),
};
