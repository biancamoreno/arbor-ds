import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { createTheme, themeLight } from '../../../foundations';
import { Box, Flex, Icon, Text } from '../../core';
import { Field } from '../../field';
import { Select } from './select';
import type { SelectOption } from '../interfaces/SelectProps';

const meta = {
  title: 'Form/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: { type: 'select' }, options: ['small', 'medium', 'large'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj;

const FRAMEWORKS: SelectOption[] = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
];

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'API plana (RFC-0043 / PCV-22) — caminho recomendado. `options[]` ' +
          'expressa toda a anatomia padrão; o compound segue exportado para ' +
          'layouts não-triviais (ver `AdvancedCompound`).',
      },
    },
  },
  render: () => (
    <Box width="280px">
      <Select placeholder="Selecione..." options={FRAMEWORKS} />
    </Box>
  ),
};

export const WithDefaultValue: Story = {
  render: () => (
    <Box width="280px">
      <Select defaultValue="react" options={FRAMEWORKS} />
    </Box>
  ),
};

export const WithDisabledItem: Story = {
  render: () => (
    <Box width="280px">
      <Select
        placeholder="Plano..."
        options={[
          { value: 'free', label: 'Gratuito' },
          { value: 'pro', label: 'Pro — R$ 49/mês' },
          { value: 'enterprise', label: 'Enterprise (em breve)', disabled: true },
        ]}
      />
    </Box>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Flex flexDirection="column" gap="12px">
      {(['small', 'medium', 'large'] as const).map(size => (
        <Box key={size} width="280px">
          <Select
            size={size}
            placeholder={`Tamanho ${size}`}
            options={[
              { value: 'opt1', label: 'Opção 1' },
              { value: 'opt2', label: 'Opção 2' },
            ]}
          />
        </Box>
      ))}
    </Flex>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Box width="280px">
      <Select
        disabled
        placeholder="Desabilitado"
        options={[{ value: 'opt1', label: 'Opção 1' }]}
      />
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
      <Select
        value={value}
        onValueChange={setValue}
        placeholder="Use só o teclado"
        options={[
          { value: 'sao-paulo', label: 'São Paulo' },
          { value: 'rio', label: 'Rio de Janeiro' },
          { value: 'bh', label: 'Belo Horizonte' },
          { value: 'curitiba', label: 'Curitiba' },
          { value: 'recife', label: 'Recife' },
          { value: 'fortaleza', label: 'Fortaleza' },
        ]}
      />
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
      <Select
        placeholder="Container com overflow:hidden"
        options={[
          { value: 'a', label: 'Opção A — não cortada' },
          { value: 'b', label: 'Opção B — não cortada' },
          { value: 'c', label: 'Opção C — não cortada' },
        ]}
      />
    </Box>
  ),
};

export const LongList: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '50+ itens. PageUp/PageDown saltam ±10, scroll-into-view garante que o item ativo ' +
          'está visível, type-ahead acelera busca por prefixo. `maxHeight` do listbox é ' +
          'themable via `sizes.selectContent.maxHeight`.',
      },
    },
  },
  render: () => (
    <Box width="280px">
      <Select
        placeholder="Selecione um país"
        options={[
          'Argentina', 'Austrália', 'Áustria', 'Bélgica', 'Bolívia', 'Brasil',
          'Canadá', 'Chile', 'China', 'Colômbia', 'Coreia do Sul', 'Costa Rica',
          'Croácia', 'Dinamarca', 'Egito', 'Equador', 'Eslováquia', 'Eslovênia',
          'Espanha', 'Estados Unidos', 'Estônia', 'Filipinas', 'Finlândia', 'França',
          'Grécia', 'Holanda', 'Hungria', 'Índia', 'Indonésia', 'Irlanda',
          'Israel', 'Itália', 'Japão', 'Letônia', 'Lituânia', 'Luxemburgo',
          'Malásia', 'México', 'Noruega', 'Nova Zelândia', 'Panamá', 'Paraguai',
          'Peru', 'Polônia', 'Portugal', 'Reino Unido', 'República Tcheca', 'Romênia',
          'Singapura', 'Suécia', 'Suíça', 'Tailândia', 'Turquia', 'Uruguai', 'Venezuela',
        ].map(country => ({
          value: country.toLowerCase().replace(/\s+/g, '-'),
          label: country,
        }))}
      />
    </Box>
  ),
};

export const WithRichOptions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`SelectOption` aceita `startSlot` (ornamento à esquerda, geralmente `Icon`) ' +
          'e `description` (texto secundário abaixo do label). Cobre o caso comum ' +
          '"ícone + título + subtítulo" sem precisar do compound.',
      },
    },
  },
  render: () => (
    <Box width="320px">
      <Select
        placeholder="Forma de pagamento"
        options={[
          {
            value: 'card',
            label: 'Cartão de crédito',
            description: 'Aprovação imediata',
            startSlot: <Icon name="CreditCard" size="small" decorative />,
          },
          {
            value: 'pix',
            label: 'Pix',
            description: 'Compensação em segundos',
            startSlot: <Icon name="Zap" size="small" decorative />,
          },
          {
            value: 'boleto',
            label: 'Boleto bancário',
            description: 'Compensa em até 3 dias úteis',
            startSlot: <Icon name="FileText" size="small" decorative />,
          },
        ]}
      />
    </Box>
  ),
};

export const EmptyState: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`emptyMessage` é exibido quando `options=[]`. Útil para listas dinâmicas ' +
          'após filtragem.',
      },
    },
  },
  render: () => (
    <Box width="280px">
      <Select
        placeholder="Selecione..."
        options={[]}
        emptyMessage="Nenhum resultado encontrado"
      />
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
          <Select
            placeholder="Selecione..."
            options={[
              { value: 'card', label: 'Cartão de crédito' },
              { value: 'pix', label: 'Pix' },
              { value: 'boleto', label: 'Boleto' },
            ]}
          />
        </Field.Control>
        <Field.Description>Aparece em `aria-describedby` do trigger.</Field.Description>
      </Field>

      <Field id="country" invalid>
        <Field.Label>País *</Field.Label>
        <Field.Control>
          <Select
            placeholder="Selecione um país"
            options={[
              { value: 'br', label: 'Brasil' },
              { value: 'pt', label: 'Portugal' },
            ]}
          />
        </Field.Control>
        <Field.Error>Campo obrigatório.</Field.Error>
      </Field>
    </Flex>
  ),
};

export const AdvancedCompound: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'API compound preservada (`Select.Root`/`Select.Trigger`/`Select.Content`/' +
          '`Select.Item`). Caminho para layouts não-triviais — grupos com sub-headers, ' +
          'separadores, ou anatomia customizada. Não há breaking change na migração ' +
          'compound→flat (RFC-0043).',
      },
    },
  },
  render: () => (
    <Box width="280px">
      <Select.Root>
        <Select.Trigger>
          <Select.Value placeholder="Cidade por região" />
        </Select.Trigger>
        <Select.Content>
          <Box
            as="li"
            role="presentation"
            paddingLeft="small"
            paddingRight="small"
            paddingTop="micro"
            paddingBottom="micro"
          >
            <Text fontSize="xsmall" fontWeight="semibold" color="text.tertiary">
              Sudeste
            </Text>
          </Box>
          <Select.Item value="sao-paulo">São Paulo</Select.Item>
          <Select.Item value="rio">Rio de Janeiro</Select.Item>
          <Select.Item value="bh">Belo Horizonte</Select.Item>
          <Box
            as="li"
            role="presentation"
            paddingLeft="small"
            paddingRight="small"
            paddingTop="micro"
            paddingBottom="micro"
          >
            <Text fontSize="xsmall" fontWeight="semibold" color="text.tertiary">
              Sul
            </Text>
          </Box>
          <Select.Item value="curitiba">Curitiba</Select.Item>
          <Select.Item value="poa">Porto Alegre</Select.Item>
        </Select.Content>
      </Select.Root>
    </Box>
  ),
};

export const Theming: Story = {
  render: () => {
    const customTheme = createTheme(themeLight, {
      sizes: {
        selectContent: {
          maxHeight: { medium: '180px' },
        },
      },
    });
    return (
      <Flex flexDirection="column" gap="16px" width="280px">
        <Select defaultValue="react" options={FRAMEWORKS} />
        <ArborProvider theme={customTheme}>
          <Select
            defaultValue="vue"
            placeholder="maxHeight reduzido via createTheme"
            options={[
              ...FRAMEWORKS,
              { value: 'solid', label: 'Solid' },
              { value: 'qwik', label: 'Qwik' },
              { value: 'lit', label: 'Lit' },
              { value: 'preact', label: 'Preact' },
              { value: 'ember', label: 'Ember' },
              { value: 'alpine', label: 'Alpine' },
            ]}
          />
        </ArborProvider>
      </Flex>
    );
  },
};
