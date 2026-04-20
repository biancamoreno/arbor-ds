import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextInput } from './textinput';
import { TextArea } from './textarea';
import { SearchInput } from './search-input';

const meta = {
  title: 'Form/Input',
  component: TextInput,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: { type: 'select' }, options: ['sm', 'md', 'lg'] },
    variant: { control: { type: 'select' }, options: ['default', 'filled'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    placeholder: 'Digite algo...',
    label: 'Campo de texto',
    size: 'md',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Senha',
    placeholder: 'Mínimo 8 caracteres',
    helperText: 'Use letras, números e símbolos.',
    type: 'password',
  },
};

export const WithError: Story = {
  args: {
    label: 'E-mail',
    value: 'invalido',
    error: 'Formato de e-mail inválido.',
  },
};

export const Filled: Story = {
  args: {
    label: 'Variante filled',
    placeholder: 'Campo preenchido',
    variant: 'filled',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
      <TextInput size="sm" placeholder="Pequeno (sm)" label="Pequeno" />
      <TextInput size="md" placeholder="Médio (md)" label="Médio" />
      <TextInput size="lg" placeholder="Grande (lg)" label="Grande" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    label: 'Campo desabilitado',
    value: 'Não editável',
    disabled: true,
  },
};

export const Search: Story = {
  render: () => (
    <SearchInput
      placeholder="Pesquisar..."
      label="Busca"
      style={{ width: 320 }}
    />
  ),
};

export const Textarea: Story = {
  render: () => (
    <TextArea
      label="Descrição"
      placeholder="Descreva com detalhes..."
      style={{ width: 320 }}
    />
  ),
};
