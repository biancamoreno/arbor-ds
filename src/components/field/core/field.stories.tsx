import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Field } from './field';
import { Box, Flex, Text } from '../../core';
import { TextInput } from '../../input/core/textinput';
import { TextArea } from '../../input/core/textarea';
import { Select } from '../../select/core/select';
import { Checkbox } from '../../checkbox';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { createTheme, themeLight } from '../../../foundations';

const meta = {
  title: 'Form/Field',
  component: Field,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj;

function FieldStage({ children }: { children: React.ReactNode }) {
  return (
    <Box width="320px">
      {children}
    </Box>
  );
}

export const Anatomia: Story = {
  render: () => (
    <FieldStage>
      <Field id="anatomy">
        <Field.Label>Nome completo</Field.Label>
        <Field.Control>
          <TextInput placeholder="Digite seu nome" />
        </Field.Control>
        <Field.Description>Como aparece no seu documento de identidade.</Field.Description>
      </Field>
    </FieldStage>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <FieldStage>
      <Field id="with-description">
        <Field.Label>Apelido</Field.Label>
        <Field.Control>
          <TextInput placeholder="opcional" />
        </Field.Control>
        <Field.Description>Visível apenas para pessoas que você seguir.</Field.Description>
      </Field>
    </FieldStage>
  ),
};

export const Required: Story = {
  render: () => (
    <FieldStage>
      <Field id="required" required>
        <Field.Label>E-mail</Field.Label>
        <Field.Control>
          <TextInput type="email" placeholder="seu@email.com" />
        </Field.Control>
        <Field.Description>Usamos seu e-mail apenas para autenticação.</Field.Description>
      </Field>
    </FieldStage>
  ),
};

export const Invalid: Story = {
  render: () => (
    <FieldStage>
      <Field id="invalid" invalid>
        <Field.Label>E-mail</Field.Label>
        <Field.Control>
          <TextInput type="email" defaultValue="nao-e-email" />
        </Field.Control>
        <Field.Error>Formato de e-mail inválido.</Field.Error>
      </Field>
    </FieldStage>
  ),
};

export const Disabled: Story = {
  render: () => (
    <FieldStage>
      <Field id="disabled" disabled>
        <Field.Label>Campo desabilitado</Field.Label>
        <Field.Control>
          <TextInput defaultValue="Valor fixo" />
        </Field.Control>
        <Field.Description>Este campo não pode ser editado.</Field.Description>
      </Field>
    </FieldStage>
  ),
};

export const FullComposition: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState('ab');
      const tooShort = value.length < 3;
      return (
        <Field id="full" required invalid={tooShort}>
          <Field.Label>Nome de usuário</Field.Label>
          <Field.Control>
            <TextInput
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="ex.: ana.silva"
            />
          </Field.Control>
          <Field.Description>Mínimo de 3 caracteres, sem espaços.</Field.Description>
          <Field.Error>O nome precisa ter pelo menos 3 caracteres.</Field.Error>
        </Field>
      );
    }
    return (
      <FieldStage>
        <Demo />
      </FieldStage>
    );
  },
};

export const LongContent: Story = {
  render: () => (
    <FieldStage>
      <Field id="long" invalid>
        <Field.Label>
          Um rótulo muito longo que pode quebrar em mais de uma linha quando o container é estreito
        </Field.Label>
        <Field.Control>
          <TextArea defaultValue="lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" />
        </Field.Control>
        <Field.Description>
          Descrição longa explicando em detalhes o que o campo representa, com instruções de uso,
          exemplos e referências cruzadas a outras partes do formulário.
        </Field.Description>
        <Field.Error>
          A entrada falhou em três validações distintas: comprimento mínimo, caracteres permitidos
          e unicidade no nosso registro.
        </Field.Error>
      </Field>
    </FieldStage>
  ),
};

export const VariosControles: Story = {
  render: () => (
    <Flex flexDirection="column" gap="large" width="320px">
      <Field id="ctrl-input">
        <Field.Label>TextInput</Field.Label>
        <Field.Control>
          <TextInput placeholder="texto curto" />
        </Field.Control>
      </Field>

      <Field id="ctrl-textarea">
        <Field.Label>TextArea</Field.Label>
        <Field.Control>
          <TextArea placeholder="texto longo" />
        </Field.Control>
      </Field>

      <Field id="ctrl-select">
        <Field.Label>Select</Field.Label>
        <Field.Control>
          <Select.Root>
            <Select.Trigger>
              <Select.Value placeholder="Selecione..." />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="a">Opção A</Select.Item>
              <Select.Item value="b">Opção B</Select.Item>
            </Select.Content>
          </Select.Root>
        </Field.Control>
      </Field>

      <Field id="ctrl-checkbox">
        <Field.Label>Checkbox</Field.Label>
        <Field.Control>
          <Checkbox label="Aceito os termos" />
        </Field.Control>
      </Field>
    </Flex>
  ),
};

export const Theming: Story = {
  render: () => {
    const violetTheme = createTheme(themeLight, {
      components: {
        field: {
          label: { fontWeight: 'semibold' },
          colors: {
            label: { default: 'brand.solid' },
            description: 'text.primary',
            requiredIndicator: 'brand.solid',
          },
        },
      },
    });
    return (
      <Flex gap="large" alignItems="flex-start">
        <FieldStage>
          <Text variant="overline">Default</Text>
          <Box marginTop="small">
            <Field id="theming-default" required>
              <Field.Label>E-mail</Field.Label>
              <Field.Control>
                <TextInput placeholder="seu@email.com" />
              </Field.Control>
              <Field.Description>Tema default do Arbor-DS.</Field.Description>
            </Field>
          </Box>
        </FieldStage>

        <ArborProvider theme={violetTheme}>
          <FieldStage>
            <Text variant="overline">Theming via createTheme</Text>
            <Box marginTop="small">
              <Field id="theming-override" required>
                <Field.Label>E-mail</Field.Label>
                <Field.Control>
                  <TextInput placeholder="seu@email.com" />
                </Field.Control>
                <Field.Description>Label semibold + cor de brand.</Field.Description>
              </Field>
            </Box>
          </FieldStage>
        </ArborProvider>
      </Flex>
    );
  },
};
