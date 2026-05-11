import type { Meta, StoryObj } from '@storybook/react-vite';
import { Clickable } from './clickable';
import { Box } from '../../box';
import { Flex } from '../../flex';
import { Text } from '../../text';
import { Icon } from '../../icon';
import { PressFeedback } from '../../press-feedback';

const meta = {
  title: 'Core/Interactive/Clickable',
  component: Clickable,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Clickable>;

export default meta;
type Story = StoryObj;

export const Anatomy: Story = {
  name: 'Anatomia — substituto cross-platform para `<button>`',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        `Clickable` é o primitivo interativo do DS. Renderiza {'<button>'} por default,
        traz cursor + foco visível + tratamento de `disabled` cross-platform.
      </Text>
      <Clickable
        paddingX="medium"
        paddingY="small"
        backgroundColor="brand.solid"
        color="text.inverse"
        borderRadius="small"
      >
        <Text variant="bodyMedium" color="text.inverse">
          Sou um Clickable
        </Text>
      </Clickable>
    </Flex>
  ),
};

export const Polymorphic: Story = {
  name: 'Polimorfismo — trocar a tag via `as`',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        Use `as="a"` para hyperlinks; ao trocar para tag não-interativa (ex.: `'div'`)
        passe `role` explicitamente — o DS emite warning em dev caso contrário.
      </Text>
      <Flex gap="small" flexWrap="wrap">
        <Clickable
          paddingX="medium"
          paddingY="small"
          backgroundColor="brand.solid"
          color="text.inverse"
          borderRadius="small"
        >
          <Text variant="bodyMedium" color="text.inverse">
            as="button" (default)
          </Text>
        </Clickable>
        <Clickable
          as="a"
          href="#"
          paddingX="medium"
          paddingY="small"
          backgroundColor="surface.subtle"
          borderRadius="small"
        >
          <Text variant="bodyMedium" color="text.link">
            as="a" — link
          </Text>
        </Clickable>
        <Clickable
          as="div"
          role="button"
          tabIndex={0}
          paddingX="medium"
          paddingY="small"
          backgroundColor="surface.subtle"
          borderRadius="small"
        >
          <Text variant="bodyMedium">as="div" role="button"</Text>
        </Clickable>
      </Flex>
    </Flex>
  ),
};

export const FocusVisible: Story = {
  name: 'Foco visível — anel premium automático (Tab para experimentar)',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        Todo `Clickable` ganha `data-arbor-focusable` por construção. Pressione `Tab`
        para navegar — o anel consome `focus.ring` do tema (override propaga
        automaticamente).
      </Text>
      <Flex gap="small">
        {[1, 2, 3].map((n) => (
          <Clickable
            key={n}
            paddingX="medium"
            paddingY="small"
            backgroundColor="surface.subtle"
            borderRadius="small"
            borderWidth={1}
            borderColor="border.default"
          >
            <Text variant="bodyMedium">Foco {n}</Text>
          </Clickable>
        ))}
      </Flex>
    </Flex>
  ),
};

export const DisabledState: Story = {
  name: 'Estado disabled — visual + bloqueio cross-as',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        `disabled` aplica `opacity.disabled` (themable), `cursor: not-allowed`,
        `pointer-events: none` e bloqueia `onClick` mesmo quando `as` não é
        nativamente interativo (`'a'`, `'div'`).
      </Text>
      <Flex gap="small" flexWrap="wrap">
        <Clickable
          paddingX="medium"
          paddingY="small"
          backgroundColor="brand.solid"
          color="text.inverse"
          borderRadius="small"
        >
          <Text variant="bodyMedium" color="text.inverse">
            Habilitado
          </Text>
        </Clickable>
        <Clickable
          disabled
          paddingX="medium"
          paddingY="small"
          backgroundColor="brand.solid"
          color="text.inverse"
          borderRadius="small"
        >
          <Text variant="bodyMedium" color="text.inverse">
            Desabilitado
          </Text>
        </Clickable>
        <Clickable
          as="a"
          href="#"
          disabled
          paddingX="medium"
          paddingY="small"
          backgroundColor="surface.subtle"
          borderRadius="small"
        >
          <Text variant="bodyMedium" color="text.link">
            Link desabilitado (as="a")
          </Text>
        </Clickable>
      </Flex>
    </Flex>
  ),
};

export const WithIconAndText: Story = {
  name: 'Composição — Icon + Text alinhados',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        `Clickable` aceita props styled-system; compor com `Icon` + `Text` é o caminho
        canônico — `alignItems: 'center'` já vem baked.
      </Text>
      <Flex gap="small" flexWrap="wrap">
        <Clickable gap="xsmall" paddingX="medium" paddingY="small" backgroundColor="surface.subtle" borderRadius="small">
          <Icon name="Plus" size="small" decorative />
          <Text variant="bodyMedium">Adicionar</Text>
        </Clickable>
        <Clickable gap="xsmall" paddingX="medium" paddingY="small" backgroundColor="surface.subtle" borderRadius="small">
          <Icon name="Download" size="small" decorative />
          <Text variant="bodyMedium">Download</Text>
        </Clickable>
        <Clickable gap="xsmall" paddingX="medium" paddingY="small" backgroundColor="surface.subtle" borderRadius="small">
          <Icon name="ExternalLink" size="small" decorative />
          <Text variant="bodyMedium">Abrir externo</Text>
        </Clickable>
      </Flex>
    </Flex>
  ),
};

export const WithPressFeedback: Story = {
  name: 'Composição — overlay de press explícito (PressFeedback)',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        Para feedback de press mais opinionado (overlay tinted), componha `PressFeedback`
        como filho irmão. Caso contrário, `Clickable` aplica fade sutil em `_active`
        por construção. Clique e segure para ver o overlay.
      </Text>
      <Flex gap="small">
        <Clickable
          position="relative"
          overflow="hidden"
          paddingX="medium"
          paddingY="small"
          backgroundColor="brand.solid"
          color="text.inverse"
          borderRadius="small"
        >
          <PressFeedback variant="highlight" borderRadius="small" />
          <Text variant="bodyMedium" color="text.inverse">
            Com PressFeedback highlight
          </Text>
        </Clickable>
        <Clickable
          position="relative"
          overflow="hidden"
          paddingX="medium"
          paddingY="small"
          backgroundColor="surface.subtle"
          borderRadius="small"
        >
          <PressFeedback variant="default" borderRadius="small" />
          <Text variant="bodyMedium">Com PressFeedback default</Text>
        </Clickable>
      </Flex>
    </Flex>
  ),
};

export const Card: Story = {
  name: 'Composição — Clickable como card inteiro',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="420px">
      <Text variant="overline" color="text.tertiary">
        `Clickable` pode envolver blocos compostos — defina `flexDirection`, `padding`
        e `gap` como em qualquer container.
      </Text>
      <Clickable
        flexDirection="column"
        alignItems="stretch"
        gap="xsmall"
        padding="medium"
        backgroundColor="surface.subtle"
        borderRadius="medium"
        borderWidth={1}
        borderColor="border.default"
      >
        <Flex alignItems="center" gap="xsmall">
          <Icon name="Zap" size="small" decorative />
          <Text variant="bodyMedium" fontWeight="semibold">
            Plano Pro
          </Text>
        </Flex>
        <Text variant="bodySmall" color="text.secondary">
          Recursos avançados, suporte prioritário e integrações ilimitadas.
        </Text>
        <Box>
          <Text variant="caption" color="text.tertiary">
            Clique no card inteiro
          </Text>
        </Box>
      </Clickable>
    </Flex>
  ),
};
