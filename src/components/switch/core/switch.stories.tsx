import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './switch';

const meta = {
  title: 'Form/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: { type: 'select' }, options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Switch.Root aria-label="Notificações">
      <Switch.Track>
        <Switch.Thumb />
      </Switch.Track>
    </Switch.Root>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Switch.Root id="notif" aria-labelledby="notif-label">
        <Switch.Track>
          <Switch.Thumb />
        </Switch.Track>
      </Switch.Root>
      <label id="notif-label" htmlFor="notif">Receber notificações</label>
    </div>
  ),
};

export const Checked: Story = {
  render: () => (
    <Switch.Root defaultChecked aria-label="Ativo por padrão">
      <Switch.Track>
        <Switch.Thumb />
      </Switch.Track>
    </Switch.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Switch.Root disabled aria-label="Desabilitado desligado">
        <Switch.Track><Switch.Thumb /></Switch.Track>
      </Switch.Root>
      <Switch.Root disabled defaultChecked aria-label="Desabilitado ligado">
        <Switch.Track><Switch.Thumb /></Switch.Track>
      </Switch.Root>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Switch.Root key={size} size={size} aria-label={`Tamanho ${size}`}>
          <Switch.Track><Switch.Thumb /></Switch.Track>
        </Switch.Root>
      ))}
    </div>
  ),
};
