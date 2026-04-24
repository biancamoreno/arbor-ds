import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dialog } from './dialog';

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
      <Dialog.Content size="md">
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

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
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
