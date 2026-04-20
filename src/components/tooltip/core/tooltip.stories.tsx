import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './tooltip';

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
    <Tooltip.Root>
      <Tooltip.Trigger>
        <button style={{ padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}>
          Passe o mouse
        </button>
      </Tooltip.Trigger>
      <Tooltip.Content>Dica útil para o usuário</Tooltip.Content>
    </Tooltip.Root>
  ),
};

export const Placements: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 32, padding: 64, flexWrap: 'wrap', justifyContent: 'center' }}>
      {(['top', 'bottom', 'left', 'right'] as const).map((placement) => (
        <Tooltip.Root key={placement}>
          <Tooltip.Trigger>
            <button style={{ padding: '8px 12px', borderRadius: 4, cursor: 'pointer', minWidth: 80 }}>
              {placement}
            </button>
          </Tooltip.Trigger>
          <Tooltip.Content placement={placement}>
            Tooltip {placement}
          </Tooltip.Content>
        </Tooltip.Root>
      ))}
    </div>
  ),
};

export const WithLongContent: Story = {
  render: () => (
    <Tooltip.Root>
      <Tooltip.Trigger>
        <button style={{ padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}>
          Texto longo
        </button>
      </Tooltip.Trigger>
      <Tooltip.Content maxWidth={240}>
        Esta é uma dica mais detalhada que pode conter múltiplas linhas de texto para explicar melhor a funcionalidade.
      </Tooltip.Content>
    </Tooltip.Root>
  ),
};
