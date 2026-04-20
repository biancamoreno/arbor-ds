import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './checkbox';

const meta = {
  title: 'Form/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Checkbox.Root id="accept">
      <Checkbox.Indicator />
      <Checkbox.Label>Aceitar os termos e condições</Checkbox.Label>
    </Checkbox.Root>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Checkbox.Root id="newsletter">
      <Checkbox.Indicator />
      <div>
        <Checkbox.Label>Receber novidades</Checkbox.Label>
        <Checkbox.Description>Enviaremos no máximo 1 e-mail por semana.</Checkbox.Description>
      </div>
    </Checkbox.Root>
  ),
};

export const Indeterminate: Story = {
  render: () => (
    <Checkbox.Root id="indeterminate" indeterminate>
      <Checkbox.Indicator />
      <Checkbox.Label>Selecionar alguns itens</Checkbox.Label>
    </Checkbox.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Checkbox.Root id="disabled-unchecked" disabled>
        <Checkbox.Indicator />
        <Checkbox.Label>Desabilitado (desmarcado)</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root id="disabled-checked" disabled defaultChecked>
        <Checkbox.Indicator />
        <Checkbox.Label>Desabilitado (marcado)</Checkbox.Label>
      </Checkbox.Root>
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {['Opção A', 'Opção B', 'Opção C'].map((opt) => (
        <Checkbox.Root key={opt} id={`group-${opt}`}>
          <Checkbox.Indicator />
          <Checkbox.Label>{opt}</Checkbox.Label>
        </Checkbox.Root>
      ))}
    </div>
  ),
};
