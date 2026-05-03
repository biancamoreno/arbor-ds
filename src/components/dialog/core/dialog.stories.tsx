import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dialog } from './dialog';
import { Box, Text, Clickable } from '../../core';

const meta = {
  title: 'Overlay/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Dialog.Root defaultOpen={false}>
      <Dialog.Trigger>
        <button style={{ padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}>
          Abrir Dialog
        </button>
      </Dialog.Trigger>
      <Dialog.Overlay />
      <Dialog.Content size="medium">
        <Dialog.Title>Confirmar ação</Dialog.Title>
        <Dialog.Description>
          Tem certeza que deseja continuar? Esta ação não pode ser desfeita.
        </Dialog.Description>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
          <Dialog.Close label="Cancelar" />
          <button style={{ padding: '8px 16px', background: '#4a90e2', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            Confirmar
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  ),
};

function ControlledDialog() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} style={{ padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}>
        Abrir controlado
      </button>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>Dialog controlado</Dialog.Title>
          <Dialog.Description>Controlado via estado externo.</Dialog.Description>
          <Dialog.Close label="Fechar" />
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDialog />,
};

export const InsideOverflowClip: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <Box padding="large">
      <Text as="p" color="text.secondary" marginBottom="medium">
        O container abaixo tem <Text as="code">overflow: hidden</Text> e dimensões reduzidas; o Dialog renderiza via Portal em <Text as="code">document.body</Text> e escapa do clip.
      </Text>
      <Box
        width="220px"
        height="100px"
        overflow="hidden"
        borderWidth="2px"
        borderStyle="dashed"
        borderColor="border.subtle"
        borderRadius="medium"
        padding="medium"
      >
        <Dialog.Root defaultOpen>
          <Dialog.Trigger asChild>
            <Clickable as="button" type="button" paddingX="medium" paddingY="small" borderRadius="small" backgroundColor="surface.default">
              Abrir
            </Clickable>
          </Dialog.Trigger>
          <Dialog.Overlay />
          <Dialog.Content>
            <Dialog.Title>Dialog escapa do clip</Dialog.Title>
            <Dialog.Description>Renderizado via Portal em document.body.</Dialog.Description>
            <Dialog.Close label="Fechar" />
          </Dialog.Content>
        </Dialog.Root>
      </Box>
    </Box>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      {(['small', 'medium', 'large'] as const).map((size) => (
        <Dialog.Root key={size} defaultOpen={false}>
          <Dialog.Trigger>
            <button style={{ padding: '8px 12px', borderRadius: 4, cursor: 'pointer' }}>
              {size.toUpperCase()}
            </button>
          </Dialog.Trigger>
          <Dialog.Overlay />
          <Dialog.Content size={size}>
            <Dialog.Title>Dialog {size}</Dialog.Title>
            <Dialog.Description>Tamanho {size} do dialog.</Dialog.Description>
            <Dialog.Close label="Fechar" />
          </Dialog.Content>
        </Dialog.Root>
      ))}
    </div>
  ),
};
