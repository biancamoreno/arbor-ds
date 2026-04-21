import type { Meta, StoryObj } from '@storybook/react-vite';
import { ButtonGroup } from './button-group';
import { Button } from '../../button';

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
    isDisabled: { control: 'boolean' },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ButtonGroup aria-label="Ações do formulário">
      <Button variant="ghost">Cancelar</Button>
      <Button variant="primary">Confirmar</Button>
    </ButtonGroup>
  ),
};

export const Attached: Story = {
  render: () => (
    <ButtonGroup aria-label="Alinhamento de texto" attached>
      <Button variant="ghost">Esquerda</Button>
      <Button variant="ghost">Centro</Button>
      <Button variant="ghost">Direita</Button>
    </ButtonGroup>
  ),
};

export const AttachedVertical: Story = {
  render: () => (
    <ButtonGroup aria-label="Opções de visualização" orientation="vertical" attached>
      <Button variant="ghost">Lista</Button>
      <Button variant="ghost">Grade</Button>
      <Button variant="ghost">Mapa</Button>
    </ButtonGroup>
  ),
};

export const GroupDisabled: Story = {
  render: () => (
    <ButtonGroup aria-label="Ações desabilitadas" isDisabled>
      <Button variant="ghost">Cancelar</Button>
      <Button variant="primary">Confirmar</Button>
    </ButtonGroup>
  ),
};

export const MixedVariants: Story = {
  render: () => (
    <ButtonGroup aria-label="Ações principais">
      <Button variant="ghost">Anterior</Button>
      <Button variant="secondary">Salvar rascunho</Button>
      <Button variant="primary">Publicar</Button>
    </ButtonGroup>
  ),
};
