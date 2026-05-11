import type { Meta, StoryObj } from '@storybook/react-vite';
import { ButtonGroup } from './button-group';
import { Button } from '../../button';
import { Flex } from '../../core';
import { Text } from '../../core/text';

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    children: null,
  },
  argTypes: {
    orientation: { control: { type: 'radio' }, options: ['horizontal', 'vertical'] },
    attached: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Anatomy: Story = {
  name: 'Anatomia — agrupamento horizontal com gap default',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        `ButtonGroup` agrupa botões com gap themable (default `'micro'` =
        spacing token). Sempre exige `aria-label` ou `aria-labelledby`.
      </Text>
      <ButtonGroup aria-label="Ações do formulário">
        <Button variant="ghost">Cancelar</Button>
        <Button variant="primary">Confirmar</Button>
      </ButtonGroup>
    </Flex>
  ),
};

export const Attached: Story = {
  name: 'Anatomia — attached (botões conjugados)',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        `attached` colapsa bordas internas e zera gap — útil para toggles de
        alinhamento, view modes, segmentação de opções.
      </Text>
      <ButtonGroup aria-label="Alinhamento de texto" attached>
        <Button variant="ghost">Esquerda</Button>
        <Button variant="ghost">Centro</Button>
        <Button variant="ghost">Direita</Button>
      </ButtonGroup>
    </Flex>
  ),
};

export const AttachedVertical: Story = {
  name: 'Orientation — attached vertical',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        `orientation='vertical'` empilha e colapsa raios em cima/baixo;
        `attached` move o eixo inteiro.
      </Text>
      <ButtonGroup aria-label="Opções de visualização" orientation="vertical" attached>
        <Button variant="ghost">Lista</Button>
        <Button variant="ghost">Grade</Button>
        <Button variant="ghost">Mapa</Button>
      </ButtonGroup>
    </Flex>
  ),
};

export const GroupDisabled: Story = {
  name: 'Estado — disabled coletivo',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        `disabled` no Group propaga via context para todos os Buttons filhos —
        cada um aplica `opacity.disabled` (themable) via `Clickable`.
      </Text>
      <ButtonGroup aria-label="Ações desabilitadas" disabled>
        <Button variant="ghost">Cancelar</Button>
        <Button variant="primary">Confirmar</Button>
      </ButtonGroup>
    </Flex>
  ),
};

export const MixedVariants: Story = {
  name: 'Composição — variants mistos',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        Combinação clássica de hierarquia: ghost (recuo) · secondary
        (rascunho) · primary (ação principal).
      </Text>
      <ButtonGroup aria-label="Ações principais">
        <Button variant="ghost">Anterior</Button>
        <Button variant="secondary">Salvar rascunho</Button>
        <Button variant="primary">Publicar</Button>
      </ButtonGroup>
    </Flex>
  ),
};
