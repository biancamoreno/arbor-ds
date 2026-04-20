import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio } from './radio';

const meta = {
  title: 'Form/Radio',
  component: Radio,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: { type: 'select' }, options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Radio.Root value="opt1" id="r1">
      <Radio.Indicator />
      <Radio.Label>Opção 1</Radio.Label>
    </Radio.Root>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Radio.Root value="plan-pro" id="r-pro">
      <Radio.Indicator />
      <div>
        <Radio.Label>Plano Pro</Radio.Label>
        <Radio.Description>R$ 49/mês — Recursos ilimitados</Radio.Description>
      </div>
    </Radio.Root>
  ),
};

export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }} role="radiogroup" aria-label="Planos">
      {[
        { value: 'free', label: 'Gratuito', description: 'Até 3 projetos' },
        { value: 'pro', label: 'Pro', description: 'R$ 49/mês' },
        { value: 'enterprise', label: 'Enterprise', description: 'Sob consulta' },
      ].map((plan) => (
        <Radio.Root key={plan.value} value={plan.value} id={`plan-${plan.value}`}>
          <Radio.Indicator />
          <div>
            <Radio.Label>{plan.label}</Radio.Label>
            <Radio.Description>{plan.description}</Radio.Description>
          </div>
        </Radio.Root>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Radio.Root value="disabled" id="r-disabled" disabled>
      <Radio.Indicator />
      <Radio.Label>Opção desabilitada</Radio.Label>
    </Radio.Root>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Radio.Root key={size} value={size} id={`size-${size}`} size={size}>
          <Radio.Indicator />
          <Radio.Label>Tamanho {size}</Radio.Label>
        </Radio.Root>
      ))}
    </div>
  ),
};
