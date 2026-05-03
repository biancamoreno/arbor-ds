import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './card';
import { Box } from '../../core/box';
import { Flex } from '../../core/flex';
import { Text } from '../../core/text';
import { Button } from '../../button';

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

export const Outlined: Story = {
  render: () => (
    <Card variant="outlined" padding="medium" style={{ width: 320 }}>
      <Card.Header>
        <Text fontWeight="bold">Título do card</Text>
      </Card.Header>
      <Card.Body>
        Conteúdo principal do card com informações relevantes para o usuário.
      </Card.Body>
      <Card.Footer>
        <Text fontSize="xsmall" color="text.secondary">Rodapé do card</Text>
      </Card.Footer>
    </Card>
  ),
};

export const Elevated: Story = {
  render: () => (
    <Card variant="elevated" padding="medium" style={{ width: 320 }}>
      <Card.Header>
        <Text fontWeight="bold">Card elevado</Text>
      </Card.Header>
      <Card.Body>Card com sombra de elevação para destacar conteúdo.</Card.Body>
    </Card>
  ),
};

export const Flat: Story = {
  render: () => (
    <Card variant="flat" padding="medium" style={{ width: 320 }}>
      <Card.Header>
        <Text fontWeight="bold">Card plano</Text>
      </Card.Header>
      <Card.Body>Card sem borda ou sombra, útil como container simples.</Card.Body>
    </Card>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <Flex gap="medium">
      {(['outlined', 'elevated', 'flat'] as const).map((variant) => (
        <Card key={variant} variant={variant} padding="medium" style={{ width: 200 }}>
          <Card.Header>
            <Text fontWeight="bold">{variant}</Text>
          </Card.Header>
          <Card.Body>Conteúdo do card</Card.Body>
        </Card>
      ))}
    </Flex>
  ),
};

export const PaddingScale: Story = {
  parameters: {
    docs: {
      description: {
        story: 'SP-1 completo: none / xsmall / small / medium / large / xlarge.',
      },
    },
  },
  render: () => (
    <Flex gap="medium" flexWrap="wrap">
      {(['none', 'xsmall', 'small', 'medium', 'large', 'xlarge'] as const).map((padding) => (
        <Card key={padding} variant="outlined" padding={padding} style={{ width: 200 }}>
          <Card.Header>
            <Text fontWeight="bold">padding={padding}</Text>
          </Card.Header>
          <Card.Body>Conteúdo</Card.Body>
        </Card>
      ))}
    </Flex>
  ),
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Card interativo: vira `<button>` com hover/active themable + foco WCAG. ' +
          'Discriminated union exige `onClick` + `aria-label`.',
      },
    },
  },
  render: () => (
    <Flex gap="medium">
      <Card
        variant="outlined"
        padding="medium"
        interactive
        onClick={() => alert('outlined')}
        aria-label="Outlined card"
        style={{ width: 220 }}
      >
        <Card.Header><Text fontWeight="bold">Outlined</Text></Card.Header>
        <Card.Body>Hover/Active themable.</Card.Body>
      </Card>
      <Card
        variant="elevated"
        padding="medium"
        interactive
        onClick={() => alert('elevated')}
        aria-label="Elevated card"
        style={{ width: 220 }}
      >
        <Card.Header><Text fontWeight="bold">Elevated</Text></Card.Header>
        <Card.Body>Hover/Active themable.</Card.Body>
      </Card>
      <Card
        variant="flat"
        padding="medium"
        interactive
        onClick={() => alert('flat')}
        aria-label="Flat card"
        style={{ width: 220 }}
      >
        <Card.Header><Text fontWeight="bold">Flat</Text></Card.Header>
        <Card.Body>Hover/Active themable.</Card.Body>
      </Card>
    </Flex>
  ),
};

export const WithMedia: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Card.Media fica edge-to-edge **por construção** — cada slot dona seu padding; ' +
          '`media` não tem padding, então renderiza encostado nas bordas do `root`. ' +
          'Funciona idêntico em todos os 6 paddings (sem margin negativa).',
      },
    },
  },
  render: () => (
    <Flex gap="medium" flexWrap="wrap">
      {(['none', 'small', 'medium', 'large'] as const).map((padding) => (
        <Card key={padding} variant="outlined" padding={padding} style={{ width: 280 }}>
          <Card.Media>
            <Box
              as="img"
              src="https://placehold.co/280x140/4a90e2/ffffff?text=Media"
              alt="Media"
              width="100%"
              display="block"
            />
          </Card.Media>
          <Card.Header><Text fontWeight="bold">padding={padding}</Text></Card.Header>
          <Card.Body>Mídia edge-to-edge.</Card.Body>
        </Card>
      ))}
    </Flex>
  ),
};

export const InteractiveWithMedia: Story = {
  render: () => (
    <Card
      variant="elevated"
      padding="medium"
      interactive
      onClick={() => alert('open')}
      aria-label="Abrir produto Plano Plus"
      style={{ width: 320 }}
    >
      <Card.Media>
        <Box
          as="img"
          src="https://placehold.co/320x160/3b82f6/ffffff?text=Cover"
          alt=""
          width="100%"
          display="block"
        />
      </Card.Media>
      <Card.Header><Text fontWeight="bold">Plano Plus</Text></Card.Header>
      <Card.Body>Recursos avançados para escala.</Card.Body>
      <Card.Footer>
        <Button variant="primary" size="small" onClick={(e) => e.stopPropagation()}>Assinar</Button>
      </Card.Footer>
    </Card>
  ),
};
