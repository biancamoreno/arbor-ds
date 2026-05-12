import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './tooltip';
import { Box, Text, Clickable, Flex } from '../../core';

const meta = {
  title: 'Overlay/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Tooltip label="Dica útil para o usuário">
      <Clickable as="button" type="button" paddingX="medium" paddingY="small" borderRadius="small" backgroundColor="surface.default" borderWidth="1px" borderStyle="solid" borderColor="border.default">
        Passe o mouse
      </Clickable>
    </Tooltip>
  ),
};

export const Placements: Story = {
  render: () => (
    <Flex gap="medium" padding="xlarge" flexWrap="wrap" justifyContent="center">
      {(['top', 'bottom', 'left', 'right'] as const).map((placement) => (
        <Tooltip key={placement} label={`Tooltip ${placement}`} placement={placement}>
          <Clickable as="button" type="button" paddingX="medium" paddingY="small" borderRadius="small" backgroundColor="surface.default" borderWidth="1px" borderStyle="solid" borderColor="border.default" minWidth={80}>
            {placement}
          </Clickable>
        </Tooltip>
      ))}
    </Flex>
  ),
};

export const WithLongContent: Story = {
  render: () => (
    <Tooltip
      label="Esta é uma dica mais detalhada que pode conter múltiplas linhas de texto para explicar melhor a funcionalidade."
      maxWidth={240}
    >
      <Clickable as="button" type="button" paddingX="medium" paddingY="small" borderRadius="small" backgroundColor="surface.default" borderWidth="1px" borderStyle="solid" borderColor="border.default">
        Texto longo
      </Clickable>
    </Tooltip>
  ),
};

export const InsideOverflowClip: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <Box padding="xlarge">
      <Text as="p" color="text.secondary" marginBottom="medium">
        O container abaixo tem <Text as="code">overflow: hidden</Text>; o Tooltip renderiza via Portal e escapa do clip. Passe o mouse no botão.
      </Text>
      <Box
        width="160px"
        height="60px"
        overflow="hidden"
        borderWidth="2px"
        borderStyle="dashed"
        borderColor="border.subtle"
        borderRadius="medium"
        padding="medium"
      >
        <Tooltip label="Tooltip escapa do clip via Portal">
          <Clickable as="button" type="button" paddingX="medium" paddingY="small" borderRadius="small" backgroundColor="surface.default">
            Hover
          </Clickable>
        </Tooltip>
      </Box>
    </Box>
  ),
};

export const AdvancedCompound: Story = {
  name: 'API compound — controle granular',
  render: () => (
    <Tooltip.Root>
      <Tooltip.Trigger>
        <Clickable as="button" type="button" paddingX="medium" paddingY="small" borderRadius="small" backgroundColor="surface.default" borderWidth="1px" borderStyle="solid" borderColor="border.default">
          Compound API
        </Clickable>
      </Tooltip.Trigger>
      <Tooltip.Content placement="right" maxWidth={280}>
        Use `Tooltip.Root` quando precisar de controle granular (open controlado externamente, conteúdo rich com markup, placement dinâmico).
      </Tooltip.Content>
    </Tooltip.Root>
  ),
};
