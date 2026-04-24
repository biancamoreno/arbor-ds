import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field } from './field';
import { TextInput } from '../../input/core/textinput';

const meta = {
  title: 'Form/Field',
  component: Field,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Field.Root id="name-field" style={{ width: 320 }}>
      <Field.Label>Nome completo</Field.Label>
      <Field.Control>
        <TextInput placeholder="Digite seu nome" />
      </Field.Control>
      <Field.Description>Como aparece no seu documento de identidade.</Field.Description>
    </Field.Root>
  ),
};

export const Required: Story = {
  render: () => (
    <Field.Root id="email-field" required style={{ width: 320 }}>
      <Field.Label>E-mail *</Field.Label>
      <Field.Control>
        <TextInput type="email" placeholder="seu@email.com" />
      </Field.Control>
    </Field.Root>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field.Root id="email-error" invalid style={{ width: 320 }}>
      <Field.Label>E-mail</Field.Label>
      <Field.Control>
        <TextInput type="email" value="nao-e-email" />
      </Field.Control>
      <Field.Error>Formato de e-mail inválido.</Field.Error>
    </Field.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Field.Root id="disabled-field" disabled style={{ width: 320 }}>
      <Field.Label>Campo desabilitado</Field.Label>
      <Field.Control>
        <TextInput value="Valor fixo" disabled />
      </Field.Control>
    </Field.Root>
  ),
};
