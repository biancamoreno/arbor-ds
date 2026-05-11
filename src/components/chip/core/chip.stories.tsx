import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Flex } from '../../core';
import { Text } from '../../core/text';
import { Icon } from '../../core/icon';
import { Chip } from './chip';

const meta = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: { type: 'select' }, options: ['filled', 'outlined', 'subtle'] },
    size: { control: { type: 'radio' }, options: ['small', 'medium'] },
    tone: {
      control: { type: 'select' },
      options: ['neutral', 'brand', 'info', 'success', 'warning', 'critical'],
    },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj;

export const Anatomy: Story = {
  name: 'Anatomia — discriminated union (`selectable` decide o contrato)',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        `Chip` é uma pílula compacta para filtros, tags selecionáveis ou
        pequenas ações. A prop `selectable` discrimina o contrato:
      </Text>
      <Flex gap="medium" alignItems="center">
        <Chip>
          <Chip.Icon><Icon name="Tag" size="xsmall" decorative /></Chip.Icon>
          <Chip.Label>Decorativo</Chip.Label>
        </Chip>
        <Chip selectable defaultSelected>
          <Chip.Label>Selectable</Chip.Label>
        </Chip>
        <Chip>
          <Chip.Label>Removível</Chip.Label>
          <Chip.Remove onClick={fn()} />
        </Chip>
      </Flex>
      <Text variant="caption" color="text.tertiary">
        Slots: `Chip.Icon` (decorativo, `aria-hidden`) · `Chip.Label` · `Chip.Remove`
        (interativo em ambos os modos — `&lt;button&gt;` no decorativo,
        `&lt;span role="button"&gt;` no selectable para evitar nested-button).
      </Text>
    </Flex>
  ),
};

export const Default: Story = {
  args: { variant: 'subtle', tone: 'neutral', size: 'medium', disabled: false },
  render: (args) => (
    <Chip {...args}>
      <Chip.Label>React</Chip.Label>
    </Chip>
  ),
};

export const DecorativeVsSelectable: Story = {
  name: 'Decorativo vs Selectable — semântica HTML e ARIA',
  render: () => {
    function Example() {
      const [active, setActive] = useState(false);
      return (
        <Flex flexDirection="column" gap="medium" maxWidth="640px">
          <Text variant="overline" color="text.tertiary">
            Sem `selectable`: `&lt;span&gt;` puramente visual. Com `selectable`:
            `&lt;button aria-pressed&gt;` focável + ativação por Space/Enter.
          </Text>
          <Flex gap="medium" alignItems="center">
            <Chip>
              <Chip.Label>Decorativo</Chip.Label>
            </Chip>
            <Chip selectable selected={active} onSelectedChange={setActive}>
              <Chip.Label>{active ? 'Ativo' : 'Inativo'}</Chip.Label>
            </Chip>
          </Flex>
        </Flex>
      );
    }
    return <Example />;
  },
};

export const Variants: Story = {
  name: 'Variants — filled / outlined / subtle (default)',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="720px">
      <Text variant="overline" color="text.tertiary">
        `subtle` (default): fundo transparente + borda discreta — bom para
        listas longas de tags. `outlined`: borda saturada, sem fundo — para
        chips de categoria persistentes. `filled`: fundo opaco — para o estado
        `selected`/ações primárias.
      </Text>
      {(['filled', 'outlined', 'subtle'] as const).map((variant) => (
        <Flex key={variant} gap="small" alignItems="center">
          <Text variant="caption" color="text.tertiary" minWidth={80}>
            {variant}
          </Text>
          <Chip variant={variant}>
            <Chip.Label>React</Chip.Label>
          </Chip>
          <Chip variant={variant} tone="brand">
            <Chip.Label>Design System</Chip.Label>
          </Chip>
          <Chip variant={variant} tone="success">
            <Chip.Label>Estável</Chip.Label>
          </Chip>
        </Flex>
      ))}
    </Flex>
  ),
};

export const Tones: Story = {
  name: 'Tones — matriz tone × variant',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="800px">
      <Text variant="overline" color="text.tertiary">
        Tons de feedback (`success`/`warning`/`critical`/`info`) com parcimônia
        em grupos — carnaval visual quebra a varredura. Diretriz: 1 tone de
        feedback por agrupamento.
      </Text>
      {(['neutral', 'brand', 'info', 'success', 'warning', 'critical'] as const).map((tone) => (
        <Flex key={tone} gap="small" alignItems="center">
          <Text variant="caption" color="text.tertiary" minWidth={80}>
            {tone}
          </Text>
          <Chip variant="filled" tone={tone}><Chip.Label>filled</Chip.Label></Chip>
          <Chip variant="outlined" tone={tone}><Chip.Label>outlined</Chip.Label></Chip>
          <Chip variant="subtle" tone={tone}><Chip.Label>subtle</Chip.Label></Chip>
        </Flex>
      ))}
    </Flex>
  ),
};

export const Sizes: Story = {
  name: 'Sizes — small / medium',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        `medium` (default): touch-friendly, padding confortável. `small`: para
        densidade alta — grids de filtros, tabelas, headers densos.
      </Text>
      <Flex gap="medium" alignItems="center">
        <Chip size="small" tone="brand">
          <Chip.Icon><Icon name="Tag" size="xsmall" decorative /></Chip.Icon>
          <Chip.Label>small</Chip.Label>
        </Chip>
        <Chip size="medium" tone="brand">
          <Chip.Icon><Icon name="Tag" size="xsmall" decorative /></Chip.Icon>
          <Chip.Label>medium</Chip.Label>
        </Chip>
      </Flex>
    </Flex>
  ),
};

export const WithIconAndRemove: Story = {
  name: 'Slots — Icon + Label + Remove',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        Composição típica de filtro: ícone categórico à esquerda, label central,
        botão de remover à direita. `Chip.Icon` recebe `aria-hidden` automático;
        `Chip.Remove` cuida do nested-button por construção.
      </Text>
      <Flex gap="small" flexWrap="wrap">
        <Chip variant="outlined">
          <Chip.Icon><Icon name="Filter" size="xsmall" decorative /></Chip.Icon>
          <Chip.Label>Categoria: Roupas</Chip.Label>
          <Chip.Remove onClick={fn()} label="Remover categoria" />
        </Chip>
        <Chip variant="outlined" tone="brand">
          <Chip.Icon><Icon name="Tag" size="xsmall" decorative /></Chip.Icon>
          <Chip.Label>Verão 2026</Chip.Label>
          <Chip.Remove onClick={fn()} label="Remover Verão 2026" />
        </Chip>
        <Chip variant="outlined" tone="success">
          <Chip.Icon><Icon name="Check" size="xsmall" decorative /></Chip.Icon>
          <Chip.Label>Em estoque</Chip.Label>
          <Chip.Remove onClick={fn()} label="Remover Em estoque" />
        </Chip>
      </Flex>
    </Flex>
  ),
};

export const DisabledStates: Story = {
  name: 'Disabled — decorativo e selectable',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        `disabled` aplica `cursor: not-allowed` + `opacity: $chip.opacity.disabled`
        (semantic `opacity.disabled`, ~60%). Em modo `selectable`, bloqueia toggle
        + remove `tabIndex`. Em `Chip.Remove`, bloqueia o `onClick`.
      </Text>
      <Flex gap="medium" alignItems="center">
        <Chip disabled>
          <Chip.Label>Decorativo desabilitado</Chip.Label>
        </Chip>
        <Chip selectable disabled defaultSelected>
          <Chip.Label>Selectable desabilitado</Chip.Label>
        </Chip>
        <Chip disabled>
          <Chip.Label>Com remove</Chip.Label>
          <Chip.Remove onClick={fn()} />
        </Chip>
      </Flex>
    </Flex>
  ),
};

export const FilterBar: Story = {
  name: 'Composição real — barra de filtros toggleable',
  render: () => {
    function FilterBarExample() {
      const [filters, setFilters] = useState<Record<string, boolean>>({
        Roupas: true,
        Acessórios: false,
        Sapatos: false,
        Promo: true,
      });
      const toggle = (key: string) =>
        setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
      return (
        <Flex flexDirection="column" gap="medium" maxWidth="640px">
          <Text variant="overline" color="text.tertiary">
            Padrão real: barra de filtros com chips toggleable controlados.
            `subtle` quando inativo, `filled` quando ativo — comunica afordância
            de seleção múltipla sem requerer leitura do `aria-pressed`.
          </Text>
          <Flex gap="small" flexWrap="wrap">
            {Object.entries(filters).map(([key, active]) => (
              <Chip
                key={key}
                selectable
                selected={active}
                onSelectedChange={() => toggle(key)}
                variant={active ? 'filled' : 'subtle'}
                tone="brand"
              >
                <Chip.Label>{key}</Chip.Label>
              </Chip>
            ))}
          </Flex>
        </Flex>
      );
    }
    return <FilterBarExample />;
  },
};
