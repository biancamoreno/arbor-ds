import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './card';
import { Box, Flex, Icon, Image, Text } from '../../core';
import { Button } from '../../button';
import { Avatar } from '../../avatar';
import { Badge } from '../../badge';
import { ArborProvider } from '../../../ecosystem';
import { createTheme, themeLight } from '../../../foundations';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: { type: 'select' }, options: ['outlined', 'elevated', 'flat'] },
    padding: {
      control: { type: 'select' },
      options: ['none', 'xsmall', 'small', 'medium', 'large', 'xlarge'],
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj;

/** Card padrão: outlined + padding medium, anatomia Header / Body / Footer. */
export const Default: Story = {
  render: () => (
    <Card style={{ width: 340 }}>
      <Card.Header>
        <Text variant="overline" color="text.secondary">Plano</Text>
        <Text variant="headingSmall">Pro Annual</Text>
      </Card.Header>
      <Card.Body>
        <Text variant="bodyMedium" color="text.secondary">
          Recursos avançados, suporte prioritário e relatórios detalhados.
        </Text>
      </Card.Body>
      <Card.Footer>
        <Button variant="primary" size="small">Assinar</Button>
        <Button variant="ghost" size="small">Saiba mais</Button>
      </Card.Footer>
    </Card>
  ),
};

/**
 * Anatomia: 4 slots (Media, Header, Body, Footer). Cada slot dona seu
 * padding — Media renderiza edge-to-edge por construção.
 */
export const Anatomia: Story = {
  render: () => (
    <Card style={{ width: 340 }}>
      <Card.Media>
        <Image
          source="https://picsum.photos/seed/arbor-anatomy/340/160"
          alt=""
          width="100%"
          height={160}
        />
      </Card.Media>
      <Card.Header>
        <Text variant="overline" color="text.secondary">Card.Media · Card.Header</Text>
        <Text variant="headingSmall">Slot anatomy</Text>
      </Card.Header>
      <Card.Body>
        <Text variant="bodyMedium" color="text.secondary">
          Card.Body é a área principal — expande verticalmente (flex: 1).
        </Text>
      </Card.Body>
      <Card.Footer>
        <Badge tone="brand" variant="subtle">Card.Footer</Badge>
      </Card.Footer>
    </Card>
  ),
};

/** Três variants: outlined (borda), elevated (sombra), flat (sem moldura). */
export const Variants: Story = {
  render: () => (
    <Flex gap="medium" flexWrap="wrap" alignItems="flex-start">
      {(['outlined', 'elevated', 'flat'] as const).map((variant) => (
        <Card key={variant} variant={variant} style={{ width: 220 }}>
          <Card.Header>
            <Text variant="overline" color="text.secondary">variant</Text>
            <Text variant="headingSmall">{variant}</Text>
          </Card.Header>
          <Card.Body>
            <Text variant="bodyMedium" color="text.secondary">
              {variant === 'outlined' && 'Borda 1px discreta — uso geral.'}
              {variant === 'elevated' && 'Sombra para destacar acima do fundo.'}
              {variant === 'flat' && 'Sem moldura — agrupador leve.'}
            </Text>
          </Card.Body>
        </Card>
      ))}
    </Flex>
  ),
};

/** SP-1 completo: none / xsmall / small / medium / large / xlarge. */
export const PaddingScale: Story = {
  render: () => (
    <Flex gap="medium" flexWrap="wrap" alignItems="flex-start">
      {(['none', 'xsmall', 'small', 'medium', 'large', 'xlarge'] as const).map((padding) => (
        <Card key={padding} padding={padding} style={{ width: 200 }}>
          <Card.Header>
            <Text variant="overline" color="text.secondary">padding</Text>
            <Text variant="label">{padding}</Text>
          </Card.Header>
          <Card.Body>
            <Text variant="caption" color="text.secondary">Conteúdo</Text>
          </Card.Body>
        </Card>
      ))}
    </Flex>
  ),
};

/**
 * Card interativo: vira `<button>` (web) / `<Pressable>` (native) com
 * hover/active themable (`card.opacity.{hover, active}`) + foco visível
 * WCAG. Discriminated union exige `onClick` + `accessibilityLabel`.
 */
export const Interactive: Story = {
  render: () => (
    <Flex gap="medium" flexWrap="wrap" alignItems="flex-start">
      {(['outlined', 'elevated', 'flat'] as const).map((variant) => (
        <Card
          key={variant}
          variant={variant}
          interactive
          onClick={() => undefined}
          accessibilityLabel={`Abrir card ${variant}`}
          style={{ width: 220 }}
        >
          <Card.Header>
            <Flex alignItems="center" gap="micro">
              <Icon name="Zap" size="small" decorative />
              <Text variant="label">{variant}</Text>
            </Flex>
          </Card.Header>
          <Card.Body>
            <Text variant="bodyMedium" color="text.secondary">
              Passe o mouse / Tab e Enter — hover, active e focus visíveis.
            </Text>
          </Card.Body>
        </Card>
      ))}
    </Flex>
  ),
};

/**
 * `Card.Media` fica edge-to-edge **por construção** — cada slot dona seu
 * padding; `media` não tem padding, então renderiza encostado nas bordas
 * do `root`. Funciona idêntico em todos os 6 paddings.
 */
export const WithMedia: Story = {
  render: () => (
    <Flex gap="medium" flexWrap="wrap" alignItems="flex-start">
      {(['none', 'small', 'medium', 'large'] as const).map((padding) => (
        <Card key={padding} padding={padding} style={{ width: 280 }}>
          <Card.Media>
            <Image
              source={`https://picsum.photos/seed/arbor-media-${padding}/280/140`}
              alt=""
              width="100%"
              height={140}
            />
          </Card.Media>
          <Card.Header>
            <Text variant="overline" color="text.secondary">padding</Text>
            <Text variant="label">{padding}</Text>
          </Card.Header>
          <Card.Body>
            <Text variant="caption" color="text.secondary">Mídia edge-to-edge.</Text>
          </Card.Body>
        </Card>
      ))}
    </Flex>
  ),
};

/**
 * Caso completo: Card interativo com Media + Header + Body + Footer.
 * Sem `<Button>` aninhado — Card interactive já é `<button>` e botão dentro
 * de botão é inválido. Use Card decorativo + Buttons no Footer ou Card
 * interativo sem ações internas (o card todo é a ação).
 */
export const InteractiveWithMedia: Story = {
  render: () => (
    <Card
      variant="elevated"
      interactive
      onClick={() => undefined}
      accessibilityLabel="Abrir produto Pro Annual"
      style={{ width: 340 }}
    >
      <Card.Media>
        <Image
          source="https://picsum.photos/seed/arbor-pro/340/180"
          alt=""
          width="100%"
          height={180}
        />
      </Card.Media>
      <Card.Header>
        <Flex justifyContent="space-between" alignItems="flex-start" gap="small">
          <Box>
            <Text variant="overline" color="text.secondary">Plano</Text>
            <Text variant="headingSmall">Pro Annual</Text>
          </Box>
          <Badge tone="brand">Popular</Badge>
        </Flex>
      </Card.Header>
      <Card.Body>
        <Text variant="bodyMedium" color="text.secondary">
          Recursos avançados, suporte prioritário e relatórios detalhados.
        </Text>
      </Card.Body>
      <Card.Footer>
        <Text variant="label">R$ 49/mês</Text>
        <Box flex={1} />
        <Icon name="ArrowRight" size="small" decorative />
      </Card.Footer>
    </Card>
  ),
};

/**
 * Galeria de cenários: KPI, perfil, notícia, produto, ação. Os mesmos
 * Card.Header/Body/Footer/Media sustentam casos visualmente distintos.
 */
export const Galeria: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Flex gap="large" flexWrap="wrap" alignItems="flex-start">
      {/* KPI */}
      <Card style={{ width: 220 }}>
        <Card.Body>
          <Flex alignItems="center" justifyContent="space-between" gap="small">
            <Box>
              <Text variant="overline" color="text.secondary">Receita</Text>
              <Text variant="headingMedium">R$ 84,2k</Text>
            </Box>
            <Avatar fallback={<Icon name="Sparkles" decorative />} />
          </Flex>
          <Flex alignItems="center" gap="nano">
            <Icon name="ArrowUp" size="xsmall" color="feedback.success.solid" decorative />
            <Text variant="caption" color="feedback.success.text">+12,4% vs mês passado</Text>
          </Flex>
        </Card.Body>
      </Card>

      {/* Perfil */}
      <Card style={{ width: 260 }}>
        <Card.Header>
          <Flex alignItems="center" gap="small">
            <Avatar fallback="MC" />
            <Box>
              <Text variant="label">Marina Costa</Text>
              <Text variant="caption" color="text.secondary">Product Designer</Text>
            </Box>
          </Flex>
        </Card.Header>
        <Card.Body>
          <Text variant="bodyMedium" color="text.secondary">
            Trabalha com design systems há 8 anos. Última atividade 12min atrás.
          </Text>
        </Card.Body>
        <Card.Footer>
          <Button variant="secondary" size="small">Ver perfil</Button>
          <Button variant="ghost" size="small">Mensagem</Button>
        </Card.Footer>
      </Card>

      {/* Notícia / artigo */}
      <Card variant="elevated" style={{ width: 280 }}>
        <Card.Media>
          <Image
            source="https://picsum.photos/seed/arbor-news/280/140"
            alt=""
            width="100%"
            height={140}
          />
        </Card.Media>
        <Card.Header>
          <Text variant="overline" color="text.secondary">Engenharia · 6 min</Text>
          <Text variant="headingSmall">Como tematizar componentes</Text>
        </Card.Header>
        <Card.Body>
          <Text variant="bodyMedium" color="text.secondary">
            Cascade de 5 níveis, presets coordenados e extendTheme.
          </Text>
        </Card.Body>
      </Card>

      {/* Ação rápida */}
      <Card
        interactive
        onClick={() => undefined}
        accessibilityLabel="Adicionar novo workspace"
        style={{ width: 220 }}
      >
        <Card.Body>
          <Flex alignItems="center" gap="small">
            <Avatar fallback={<Icon name="Plus" decorative />} />
            <Box>
              <Text variant="label">Novo workspace</Text>
              <Text variant="caption" color="text.secondary">Configurar em 30s</Text>
            </Box>
          </Flex>
        </Card.Body>
      </Card>
    </Flex>
  ),
};

/**
 * Theming completo via `createTheme`: override `components.card.background`,
 * `components.card.border`, `components.card.borderRadius` e
 * `components.card.opacity.{hover, active}` — recipe cascateia sem editar
 * arquivos do DS.
 */
export const Theming: Story = {
  parameters: { layout: 'padded' },
  render: () => {
    const themedCard = createTheme(themeLight, {
      components: {
        card: {
          background: 'brand.bgSubtle',
          border: 'brand.borderSubtle',
          borderRadius: 'large',
          opacity: { hover: 0.85, active: 0.7 },
        },
      },
    });

    return (
      <Flex gap="large" alignItems="flex-start">
        <Box>
          <Text variant="overline" color="text.secondary">Default</Text>
          <Box height="micro" />
          <Card style={{ width: 260 }}>
            <Card.Header>
              <Text variant="overline" color="text.secondary">Plano</Text>
              <Text variant="headingSmall">Padrão</Text>
            </Card.Header>
            <Card.Body>
              <Text variant="bodyMedium" color="text.secondary">
                Tokens originais do tema light.
              </Text>
            </Card.Body>
          </Card>
        </Box>
        <ArborProvider theme={themedCard}>
          <Box>
            <Text variant="overline" color="text.secondary">Tematizado</Text>
            <Box height="micro" />
            <Card
              interactive
              onClick={() => undefined}
              accessibilityLabel="Card tematizado"
              style={{ width: 260 }}
            >
              <Card.Header>
                <Text variant="overline" color="text.secondary">Plano</Text>
                <Text variant="headingSmall">Tematizado</Text>
              </Card.Header>
              <Card.Body>
                <Text variant="bodyMedium" color="text.secondary">
                  background, border, borderRadius e opacity override.
                </Text>
              </Card.Body>
            </Card>
          </Box>
        </ArborProvider>
      </Flex>
    );
  },
};
