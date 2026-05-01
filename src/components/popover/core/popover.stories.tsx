import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover } from './popover';
import { Box, Text, Clickable } from '../../core';

const meta = {
  title: 'Overlay/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger>
        <button style={{ padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}>
          Abrir Popover
        </button>
      </Popover.Trigger>
      <Popover.Content>
        <div style={{ padding: 16, maxWidth: 240 }}>
          <p style={{ margin: 0, marginBottom: 8, fontWeight: 600 }}>Informações adicionais</p>
          <p style={{ margin: 0, fontSize: 14 }}>Conteúdo rico dentro do popover. Pode incluir formulários, listas ou qualquer elemento.</p>
          <Popover.Close label="Fechar" />
        </div>
      </Popover.Content>
    </Popover.Root>
  ),
};

export const InsideOverflowClip: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <Box padding="large">
      <Text as="p" color="text.secondary" marginBottom="medium">
        O container abaixo tem <Text as="code">overflow: hidden</Text>; o Popover renderiza via Portal e escapa do clip.
      </Text>
      <Box
        width="220px"
        height="80px"
        overflow="hidden"
        borderWidth="2px"
        borderStyle="dashed"
        borderColor="border.subtle"
        borderRadius="medium"
        padding="medium"
      >
        <Popover.Root defaultOpen>
          <Popover.Trigger asChild>
            <Clickable as="button" type="button" paddingX="medium" paddingY="small" borderRadius="small" backgroundColor="surface.default">
              Abrir
            </Clickable>
          </Popover.Trigger>
          <Popover.Content>
            <Box padding="medium" maxWidth="240px">
              <Text as="p" fontWeight="bold" marginBottom="small">Popover escapa do clip</Text>
              <Text as="p" fontSize="small">Renderizado via Portal em document.body.</Text>
              <Popover.Close label="Fechar" />
            </Box>
          </Popover.Content>
        </Popover.Root>
      </Box>
    </Box>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger>
        <button style={{ padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}>
          Filtros
        </button>
      </Popover.Trigger>
      <Popover.Content>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 200 }}>
          <p style={{ margin: 0, fontWeight: 600 }}>Filtrar por:</p>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="checkbox" /> Ativo
          </label>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="checkbox" /> Inativo
          </label>
          <button style={{ padding: '6px 12px', borderRadius: 4, background: '#4a90e2', color: '#fff', border: 'none', cursor: 'pointer' }}>
            Aplicar
          </button>
        </div>
      </Popover.Content>
    </Popover.Root>
  ),
};
