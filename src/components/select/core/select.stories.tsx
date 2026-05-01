import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { createTheme, themeLight } from '../../../foundations';
import { Box, Flex, Text } from '../../core';
import { Field } from '../../field';
import { Select } from './select';

const meta = {
  title: 'Form/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: { type: 'select' }, options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Box width="280px">
      <Select.Root>
        <Select.Trigger>
          <Select.Value placeholder="Selecione..." />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="react">React</Select.Item>
          <Select.Item value="vue">Vue</Select.Item>
          <Select.Item value="angular">Angular</Select.Item>
          <Select.Item value="svelte">Svelte</Select.Item>
        </Select.Content>
      </Select.Root>
    </Box>
  ),
};

export const WithDefaultValue: Story = {
  render: () => (
    <Box width="280px">
      <Select.Root defaultValue="react">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="react">React</Select.Item>
          <Select.Item value="vue">Vue</Select.Item>
          <Select.Item value="angular">Angular</Select.Item>
        </Select.Content>
      </Select.Root>
    </Box>
  ),
};

export const WithDisabledItem: Story = {
  render: () => (
    <Box width="280px">
      <Select.Root>
        <Select.Trigger>
          <Select.Value placeholder="Plano..." />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="free">Gratuito</Select.Item>
          <Select.Item value="pro">Pro — R$ 49/mês</Select.Item>
          <Select.Item value="enterprise" disabled>Enterprise (em breve)</Select.Item>
        </Select.Content>
      </Select.Root>
    </Box>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Flex flexDirection="column" gap="12px">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Box key={size} width="280px">
          <Select.Root size={size}>
            <Select.Trigger>
              <Select.Value placeholder={`Tamanho ${size}`} />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="opt1">Opção 1</Select.Item>
              <Select.Item value="opt2">Opção 2</Select.Item>
            </Select.Content>
          </Select.Root>
        </Box>
      ))}
    </Flex>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Box width="280px">
      <Select.Root disabled>
        <Select.Trigger>
          <Select.Value placeholder="Desabilitado" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="opt1">Opção 1</Select.Item>
        </Select.Content>
      </Select.Root>
    </Box>
  ),
};

function KeyboardOnlyDemo() {
  const [value, setValue] = useState('');
  return (
    <Flex flexDirection="column" gap="12px" width="320px">
      <Text fontSize="small" color="text.secondary">
        Selecionado: <strong>{value || '—'}</strong>
      </Text>
      <Select.Root value={value} onValueChange={setValue}>
        <Select.Trigger>
          <Select.Value placeholder="Use só o teclado" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="sao-paulo">São Paulo</Select.Item>
          <Select.Item value="rio">Rio de Janeiro</Select.Item>
          <Select.Item value="bh">Belo Horizonte</Select.Item>
          <Select.Item value="curitiba">Curitiba</Select.Item>
          <Select.Item value="recife">Recife</Select.Item>
          <Select.Item value="fortaleza">Fortaleza</Select.Item>
        </Select.Content>
      </Select.Root>
    </Flex>
  );
}

export const KeyboardOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Combobox WAI-ARIA: foque o trigger e use ArrowDown/ArrowUp/Home/End/PageUp/PageDown, ' +
          'digite letras para type-ahead (com diacríticos pt-BR), Enter/Espaço para selecionar, ' +
          'Escape para fechar restaurando foco no trigger.',
      },
    },
  },
  render: () => <KeyboardOnlyDemo />,
};

export const InsideOverflowClip: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'O `SelectContent` é renderizado em `<Portal>` e escapa de ancestrais com `overflow:hidden`. ' +
          'Sem o Portal, o listbox seria cortado pelo container.',
      },
    },
  },
  render: () => (
    <Box
      width="280px"
      style={{
        overflow: 'hidden',
        height: 64,
        border: '1px dashed rgba(0,0,0,0.3)',
        padding: 8,
      }}
    >
      <Select.Root>
        <Select.Trigger>
          <Select.Value placeholder="Container com overflow:hidden" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="a">Opção A — não cortada</Select.Item>
          <Select.Item value="b">Opção B — não cortada</Select.Item>
          <Select.Item value="c">Opção C — não cortada</Select.Item>
        </Select.Content>
      </Select.Root>
    </Box>
  ),
};

export const LongList: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '50+ itens. PageUp/PageDown saltam ±10, scroll-into-view garante que o item ativo ' +
          'está visível, type-ahead acelera busca por prefixo.',
      },
    },
  },
  render: () => (
    <Box width="280px">
      <Select.Root>
        <Select.Trigger>
          <Select.Value placeholder="Selecione um país" />
        </Select.Trigger>
        <Select.Content>
          {[
            'Argentina', 'Austrália', 'Áustria', 'Bélgica', 'Bolívia', 'Brasil',
            'Canadá', 'Chile', 'China', 'Colômbia', 'Coreia do Sul', 'Costa Rica',
            'Croácia', 'Dinamarca', 'Egito', 'Equador', 'Eslováquia', 'Eslovênia',
            'Espanha', 'Estados Unidos', 'Estônia', 'Filipinas', 'Finlândia', 'França',
            'Grécia', 'Holanda', 'Hungria', 'Índia', 'Indonésia', 'Irlanda',
            'Israel', 'Itália', 'Japão', 'Letônia', 'Lituânia', 'Luxemburgo',
            'Malásia', 'México', 'Noruega', 'Nova Zelândia', 'Panamá', 'Paraguai',
            'Peru', 'Polônia', 'Portugal', 'Reino Unido', 'República Tcheca', 'Romênia',
            'Singapura', 'Suécia', 'Suíça', 'Tailândia', 'Turquia', 'Uruguai', 'Venezuela',
          ].map(country => (
            <Select.Item key={country} value={country.toLowerCase().replace(/\s+/g, '-')}>
              {country}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Box>
  ),
};

export const WithFieldContext: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Integração com `Field`: `aria-describedby` aponta para `Field.Description`, ' +
          '`aria-invalid` reflete estado, `aria-errormessage` aponta para `Field.Error`. ' +
          '`disabled` herda de `Field` quando definido lá.',
      },
    },
  },
  render: () => (
    <Flex flexDirection="column" gap="20px" width="320px">
      <Field id="payment-method">
        <Field.Label>Forma de pagamento</Field.Label>
        <Field.Control>
          <Select.Root>
            <Select.Trigger>
              <Select.Value placeholder="Selecione..." />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="card">Cartão de crédito</Select.Item>
              <Select.Item value="pix">Pix</Select.Item>
              <Select.Item value="boleto">Boleto</Select.Item>
            </Select.Content>
          </Select.Root>
        </Field.Control>
        <Field.Description>Aparece em `aria-describedby` do trigger.</Field.Description>
      </Field>

      <Field id="country" invalid>
        <Field.Label>País *</Field.Label>
        <Field.Control>
          <Select.Root>
            <Select.Trigger>
              <Select.Value placeholder="Selecione um país" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="br">Brasil</Select.Item>
              <Select.Item value="pt">Portugal</Select.Item>
            </Select.Content>
          </Select.Root>
        </Field.Control>
        <Field.Error>Campo obrigatório.</Field.Error>
      </Field>
    </Flex>
  ),
};

export const Theming: Story = {
  render: () => {
    const customTheme = createTheme(themeLight, {
      components: {
        select: {
          slots: ['root', 'trigger', 'value', 'icon', 'content', 'item', 'itemText'],
          base: { trigger: { borderRadius: 'huge' } },
          variants: {},
          defaultVariants: {},
        },
      },
    });
    return (
      <Flex flexDirection="column" gap="16px" width="280px">
        <Select.Root defaultValue="react">
          <Select.Trigger><Select.Value placeholder="Default" /></Select.Trigger>
          <Select.Content>
            <Select.Item value="react">React</Select.Item>
            <Select.Item value="vue">Vue</Select.Item>
          </Select.Content>
        </Select.Root>
        <ArborProvider theme={customTheme}>
          <Select.Root defaultValue="vue">
            <Select.Trigger><Select.Value placeholder="Override" /></Select.Trigger>
            <Select.Content>
              <Select.Item value="react">React</Select.Item>
              <Select.Item value="vue">Vue</Select.Item>
            </Select.Content>
          </Select.Root>
        </ArborProvider>
      </Flex>
    );
  },
};
