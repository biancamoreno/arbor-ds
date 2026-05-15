import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './tooltip';
import { Box, Text, Clickable, Flex, Icon } from '../../core';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { createTheme, themeLight } from '../../../foundations';

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
    <Tooltip label="Excluir item permanentemente">
      <Clickable
        as="button"
        type="button"
        padding="small"
        borderRadius="small"
        backgroundColor="surface.default"
        borderWidth="hairline"
        borderStyle="solid"
        borderColor="border.default"
        accessibilityLabel="Excluir"
      >
        <Icon name="Trash2" size="small" />
      </Clickable>
    </Tooltip>
  ),
};

export const Placements: Story = {
  render: () => (
    <Flex gap="medium" padding="xlarge" flexWrap="wrap" justifyContent="center">
      {(['top', 'bottom', 'left', 'right'] as const).map((placement) => (
        <Tooltip key={placement} label={`Tooltip ${placement}`} placement={placement}>
          <Clickable
            as="button"
            type="button"
            paddingX="medium"
            paddingY="small"
            borderRadius="small"
            backgroundColor="surface.default"
            borderWidth="hairline"
            borderStyle="solid"
            borderColor="border.default"
            minWidth={80}
          >
            {placement}
          </Clickable>
        </Tooltip>
      ))}
    </Flex>
  ),
};

export const WithLongContent: Story = {
  name: 'Texto longo (wrap automático)',
  render: () => (
    <Tooltip label="Esta é uma dica mais detalhada que pode conter múltiplas linhas de texto para explicar melhor a funcionalidade do botão.">
      <Clickable
        as="button"
        type="button"
        paddingX="medium"
        paddingY="small"
        borderRadius="small"
        backgroundColor="surface.default"
        borderWidth="hairline"
        borderStyle="solid"
        borderColor="border.default"
      >
        Texto longo
      </Clickable>
    </Tooltip>
  ),
};

export const RichContent: Story = {
  name: 'Conteúdo customizado (slot livre)',
  render: () => (
    <Tooltip
      label={
        <Flex flexDirection="column" gap="micro">
          <Text as="span" variant="bodySmall" fontWeight="semibold">Ação destrutiva</Text>
          <Text as="span" variant="caption">Esta ação não pode ser desfeita.</Text>
        </Flex>
      }
      placement="right"
    >
      <Clickable
        as="button"
        type="button"
        paddingX="medium"
        paddingY="small"
        borderRadius="small"
        backgroundColor="surface.default"
        borderWidth="hairline"
        borderStyle="solid"
        borderColor="border.default"
      >
        <Icon name="TriangleAlert" size="small" />
      </Clickable>
    </Tooltip>
  ),
};

export const FlipNearViewportEdge: Story = {
  name: 'Flip automático perto da borda',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Quando o `placement` pedido não cabe no viewport, o tooltip flipa automaticamente para o eixo oposto. Cada botão pede um placement original — passe o mouse e veja qual de fato é renderizado.',
      },
    },
  },
  render: () => (
    <Box position="relative" width="100%" height="100vh">
      {/* Topo — pede `top`, deve flipar para `bottom` */}
      <Box position="absolute" top={0} left="50%" style={{ transform: 'translateX(-50%)' }}>
        <Tooltip label="Pediu top, flipou para bottom" placement="top">
          <Clickable as="button" type="button" paddingX="medium" paddingY="small" borderRadius="small" backgroundColor="surface.default" borderWidth="hairline" borderStyle="solid" borderColor="border.default">
            Topo (placement=top)
          </Clickable>
        </Tooltip>
      </Box>

      {/* Esquerda — pede `left`, deve flipar para `right` */}
      <Box position="absolute" top="50%" left={0} style={{ transform: 'translateY(-50%)' }}>
        <Tooltip label="Pediu left, flipou para right" placement="left">
          <Clickable as="button" type="button" paddingX="medium" paddingY="small" borderRadius="small" backgroundColor="surface.default" borderWidth="hairline" borderStyle="solid" borderColor="border.default">
            Esquerda (placement=left)
          </Clickable>
        </Tooltip>
      </Box>

      {/* Direita — pede `right`, deve flipar para `left` */}
      <Box position="absolute" top="50%" right={0} style={{ transform: 'translateY(-50%)' }}>
        <Tooltip label="Pediu right, flipou para left" placement="right">
          <Clickable as="button" type="button" paddingX="medium" paddingY="small" borderRadius="small" backgroundColor="surface.default" borderWidth="hairline" borderStyle="solid" borderColor="border.default">
            Direita (placement=right)
          </Clickable>
        </Tooltip>
      </Box>

      {/* Base — pede `bottom`, deve flipar para `top` */}
      <Box position="absolute" bottom={0} left="50%" style={{ transform: 'translateX(-50%)' }}>
        <Tooltip label="Pediu bottom, flipou para top" placement="bottom">
          <Clickable as="button" type="button" paddingX="medium" paddingY="small" borderRadius="small" backgroundColor="surface.default" borderWidth="hairline" borderStyle="solid" borderColor="border.default">
            Base (placement=bottom)
          </Clickable>
        </Tooltip>
      </Box>
    </Box>
  ),
};

export const InsideOverflowClip: Story = {
  name: 'Portal escapa overflow:hidden',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <Box padding="xlarge">
      <Text as="p" variant="bodyMedium" color="text.secondary" marginBottom="medium">
        O container abaixo tem <Text variant="code">overflow: hidden</Text>; o Tooltip renderiza via Portal e escapa do clip.
      </Text>
      <Box
        width="160px"
        height="60px"
        overflow="hidden"
        borderWidth="thin"
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

export const Customizacao: Story = {
  name: 'Customização via createTheme',
  parameters: {
    docs: {
      description: {
        story:
          'Override completo do `tooltip` via `createTheme({ components: { tooltip: {...} } })`. Cores, sombra, offset, borderRadius e padding são todos themables — nenhum literal hardcoded no componente.',
      },
    },
  },
  render: () => {
    const customTheme = createTheme(themeLight, {
      components: {
        tooltip: {
          colors: {
            background: 'feedback.critical.solid',
            text: 'text.inverse',
          },
          shadow: 'lg',
          offset: 12,
          borderRadius: 'medium',
          padding: { inline: 'medium', block: 'small' },
        },
      },
    });
    return (
      <ArborProvider theme={customTheme}>
        <Flex gap="medium" alignItems="center">
          <Tooltip label="Tooltip critical com padding maior e radius medium">
            <Clickable
              as="button"
              type="button"
              paddingX="medium"
              paddingY="small"
              borderRadius="small"
              backgroundColor="surface.default"
              borderWidth="hairline"
              borderStyle="solid"
              borderColor="border.default"
            >
              Hover (tema customizado)
            </Clickable>
          </Tooltip>
        </Flex>
      </ArborProvider>
    );
  },
};

export const AdvancedCompound: Story = {
  name: 'API compound — controle granular',
  parameters: {
    docs: {
      description: {
        story:
          'Use `<Tooltip.Root>` quando precisar de `open` controlado externamente ou conteúdo com hierarquia rica. Ambos os modos compartilham a mesma recipe e tematização.',
      },
    },
  },
  render: () => (
    <Tooltip.Root>
      <Tooltip.Trigger>
        <Clickable
          as="button"
          type="button"
          paddingX="medium"
          paddingY="small"
          borderRadius="small"
          backgroundColor="surface.default"
          borderWidth="hairline"
          borderStyle="solid"
          borderColor="border.default"
        >
          Compound API
        </Clickable>
      </Tooltip.Trigger>
      <Tooltip.Content placement="right" maxWidth={280}>
        <Flex flexDirection="column" gap="micro">
          <Text as="span" variant="bodySmall" fontWeight="semibold">Controle granular</Text>
          <Text as="span" variant="caption">
            Use Tooltip.Root quando precisar de open controlado, conteúdo rich
            ou placement dinâmico.
          </Text>
        </Flex>
      </Tooltip.Content>
    </Tooltip.Root>
  ),
};
