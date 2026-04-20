import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './card';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: { type: 'select' }, options: ['outlined', 'elevated', 'flat'] },
    padding: { control: { type: 'select' }, options: ['none', 'sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj;

export const Outlined: Story = {
  render: () => (
    <Card variant="outlined" padding="md" style={{ width: 320 }}>
      <Card.Header>
        <strong>Título do card</strong>
      </Card.Header>
      <Card.Body>
        Conteúdo principal do card com informações relevantes para o usuário.
      </Card.Body>
      <Card.Footer>
        <small>Rodapé do card</small>
      </Card.Footer>
    </Card>
  ),
};

export const Elevated: Story = {
  render: () => (
    <Card variant="elevated" padding="md" style={{ width: 320 }}>
      <Card.Header>
        <strong>Card elevado</strong>
      </Card.Header>
      <Card.Body>
        Card com sombra de elevação para destacar conteúdo.
      </Card.Body>
    </Card>
  ),
};

export const Flat: Story = {
  render: () => (
    <Card variant="flat" padding="md" style={{ width: 320 }}>
      <Card.Header>
        <strong>Card plano</strong>
      </Card.Header>
      <Card.Body>
        Card sem borda ou sombra, útil como container simples.
      </Card.Body>
    </Card>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      {(['outlined', 'elevated', 'flat'] as const).map((variant) => (
        <Card key={variant} variant={variant} padding="md" style={{ width: 200 }}>
          <Card.Header><strong>{variant}</strong></Card.Header>
          <Card.Body>Conteúdo do card</Card.Body>
        </Card>
      ))}
    </div>
  ),
};

export const WithMedia: Story = {
  render: () => (
    <Card variant="outlined" padding="none" style={{ width: 320, overflow: 'hidden' }}>
      <Card.Media>
        <img src="https://placehold.co/320x160/4a90e2/ffffff?text=Media" alt="Media" style={{ width: '100%', display: 'block' }} />
      </Card.Media>
      <Card.Body style={{ padding: 16 }}>
        Card com imagem de capa e conteúdo abaixo.
      </Card.Body>
    </Card>
  ),
};
