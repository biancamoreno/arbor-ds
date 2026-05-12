import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Box, Flex, Text, Icon } from '../../core';
import { Field } from '../../field';
import { TextInput } from './textinput';
import { TextArea } from './textarea';
import { SearchInput } from './search-input';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { createTheme, themeLight } from '../../../foundations';

const meta = {
  title: 'Form/Input',
  component: TextInput,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: { type: 'select' }, options: ['small', 'medium', 'large'] },
    variant: { control: { type: 'select' }, options: ['default', 'filled'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj;

function Stage({ children }: { children: React.ReactNode }) {
  return <Box width="320px">{children}</Box>;
}

export const Anatomia: Story = {
  render: () => (
    <Stage>
      <TextInput label="Nome completo" placeholder="Digite seu nome" />
    </Stage>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Flex flexDirection="column" gap="small" width="320px">
      <TextInput size="small" label="Small" placeholder="Pequeno" />
      <TextInput size="medium" label="Medium" placeholder="Médio (default)" />
      <TextInput size="large" label="Large" placeholder="Grande" />
    </Flex>
  ),
};

export const Variants: Story = {
  render: () => (
    <Flex flexDirection="column" gap="small" width="320px">
      <TextInput variant="default" label="Default" placeholder="Borda visível" />
      <TextInput variant="filled" label="Filled" placeholder="Fundo sutil" />
    </Flex>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Flex flexDirection="column" gap="small" width="320px">
      <TextInput
        label="Busca"
        placeholder="Pesquisar..."
        leftIcon={<Icon name="Search" size="small" />}
      />
      <TextInput
        label="E-mail"
        placeholder="seu@email.com"
        rightIcon={<Icon name="Mail" size="small" />}
      />
    </Flex>
  ),
};

export const Clearable: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState('texto inicial');
      return (
        <TextInput
          label="Apelido"
          value={value}
          onValueChange={setValue}
          clearable
          placeholder="vazio"
        />
      );
    }
    return (
      <Stage>
        <Demo />
      </Stage>
    );
  },
};

export const WithError: Story = {
  render: () => (
    <Stage>
      <TextInput
        label="E-mail"
        defaultValue="nao-e-email"
        error="Formato de e-mail inválido."
      />
    </Stage>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Stage>
      <TextInput label="Campo desabilitado" defaultValue="Valor fixo" disabled />
    </Stage>
  ),
};

export const InsideField: Story = {
  render: () => (
    <Stage>
      <Field id="inside-field" required invalid>
        <Field.Label>E-mail</Field.Label>
        <Field.Control>
          <TextInput type="email" defaultValue="invalido" />
        </Field.Control>
        <Field.Description>Usamos seu e-mail só para autenticação.</Field.Description>
        <Field.Error>Formato de e-mail inválido.</Field.Error>
      </Field>
    </Stage>
  ),
};

export const StandaloneVsInsideField: Story = {
  render: () => (
    <Flex gap="large" alignItems="flex-start">
      <Stage>
        <Text variant="overline">Standalone (FieldShell interno)</Text>
        <Box marginTop="small">
          <TextInput label="E-mail" placeholder="seu@email.com" helperText="Texto auxiliar" />
        </Box>
      </Stage>
      <Stage>
        <Text variant="overline">Dentro de Field</Text>
        <Box marginTop="small">
          <Field id="cmp-inside">
            <Field.Label>E-mail</Field.Label>
            <Field.Control>
              <TextInput placeholder="seu@email.com" />
            </Field.Control>
            <Field.Description>Texto auxiliar</Field.Description>
          </Field>
        </Box>
      </Stage>
    </Flex>
  ),
};

export const Textarea: Story = {
  render: () => (
    <Stage>
      <TextArea
        label="Descrição"
        placeholder="Descreva com detalhes..."
        rows={4}
        maxLength={200}
        showCharCount
      />
    </Stage>
  ),
};

export const TextareaInsideField: Story = {
  render: () => (
    <Stage>
      <Field id="ta-field" required>
        <Field.Label>Comentário</Field.Label>
        <Field.Control>
          <TextArea placeholder="Compartilhe sua experiência..." rows={5} />
        </Field.Control>
        <Field.Description>Mínimo de 20 caracteres.</Field.Description>
      </Field>
    </Stage>
  ),
};

export const LongText: Story = {
  render: () => (
    <Stage>
      <TextInput
        label="Rótulo muito longo que pode quebrar em mais de uma linha quando o container é estreito"
        defaultValue="Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore"
        helperText="Texto auxiliar igualmente longo descrevendo a finalidade do campo com riqueza de detalhes."
      />
    </Stage>
  ),
};

export const Search: Story = {
  render: () => (
    <Stage>
      <SearchInput placeholder="Pesquisar..." label="Busca" />
    </Stage>
  ),
};

export const Theming: Story = {
  render: () => {
    const customTheme = createTheme(themeLight, {
      components: {
        input: {
          borderRadius: 'medium',
          colors: {
            border: { default: 'brand.solid' },
            placeholder: 'text.secondary',
            clearButton: 'brand.solid',
          },
        },
      },
    });
    return (
      <Flex gap="large" alignItems="flex-start">
        <Stage>
          <Text variant="overline">Default</Text>
          <Box marginTop="small">
            <TextInput label="E-mail" placeholder="seu@email.com" clearable defaultValue="ana" />
          </Box>
        </Stage>
        <ArborProvider theme={customTheme}>
          <Stage>
            <Text variant="overline">Theming via createTheme</Text>
            <Box marginTop="small">
              <TextInput label="E-mail" placeholder="seu@email.com" clearable defaultValue="ana" />
            </Box>
          </Stage>
        </ArborProvider>
      </Flex>
    );
  },
};
