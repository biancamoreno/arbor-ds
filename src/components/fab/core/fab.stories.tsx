import type { Meta, StoryObj } from '@storybook/react-vite';
import { FloatingActionButton } from './fab';
import { Box, Flex, Text } from '../../core';

const meta = {
  title: 'Components/FloatingActionButton',
  component: FloatingActionButton,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    icon: 'Plus',
    onPress: () => {},
  },
  argTypes: {
    size: { control: { type: 'radio' }, options: ['small', 'medium', 'large'] },
    variant: { control: { type: 'radio' }, options: ['primary', 'secondary', 'surface'] },
    position: {
      control: { type: 'select' },
      options: ['bottom-right', 'bottom-left', 'bottom-center', 'none'],
    },
    disabled: { control: 'boolean' },
    animateOnMount: { control: 'boolean' },
  },
} satisfies Meta<typeof FloatingActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <Box
    height="100vh"
    position="relative"
    backgroundColor="background.subtle"
    padding="large"
  >
    <Text as="p" variant="bodyMedium" color="text.secondary">
      Conteúdo da página
    </Text>
    {children}
  </Box>
);

export const Anatomy: Story = {
  name: 'Anatomia — ícone único, posicionado fixed bottom-right',
  render: () => (
    <PageWrapper>
      <Text variant="overline" color="text.tertiary">
        `position='bottom-right'` (default) usa `position: fixed` no web. `aria-label`
        é obrigatório quando não há `label` visível.
      </Text>
      <FloatingActionButton icon="Plus" onPress={() => alert('Adicionar!')} aria-label="Adicionar item" />
    </PageWrapper>
  ),
};

export const Extended: Story = {
  name: 'Extended — ícone + label',
  render: () => (
    <PageWrapper>
      <Text variant="overline" color="text.tertiary">
        Quando `label` é informado, o FAB vira extended (ícone + texto). `label`
        funciona como `aria-label` automaticamente. Tipografia usa
        `Text variant='label'` (PCV-1).
      </Text>
      <FloatingActionButton icon="Plus" label="Nova venda" onPress={() => alert('Nova venda!')} />
    </PageWrapper>
  ),
};

export const Sizes: Story = {
  name: 'Sizes — small (44) / medium (56) / large (72)',
  render: () => (
    <PageWrapper>
      <Flex
        position="fixed"
        bottom="medium"
        right="medium"
        flexDirection="column"
        gap="small"
        alignItems="flex-end"
      >
        <FloatingActionButton icon="Plus" size="small" position="none" onPress={() => {}} aria-label="Pequeno" />
        <FloatingActionButton icon="Plus" size="medium" position="none" onPress={() => {}} aria-label="Médio" />
        <FloatingActionButton icon="Plus" size="large" position="none" onPress={() => {}} aria-label="Grande" />
      </Flex>
    </PageWrapper>
  ),
};

export const Variants: Story = {
  name: 'Variants — primary / secondary / surface',
  render: () => (
    <PageWrapper>
      <Flex
        position="fixed"
        bottom="medium"
        right="medium"
        flexDirection="column"
        gap="small"
        alignItems="flex-end"
      >
        <FloatingActionButton icon="Pencil" variant="primary" position="none" onPress={() => {}} aria-label="Primary" />
        <FloatingActionButton icon="Pencil" variant="secondary" position="none" onPress={() => {}} aria-label="Secondary" />
        <FloatingActionButton icon="Pencil" variant="surface" position="none" onPress={() => {}} aria-label="Surface" />
      </Flex>
    </PageWrapper>
  ),
};

export const Disabled: Story = {
  name: 'Estado disabled — opacity.disabled (themable) via Clickable',
  render: () => (
    <PageWrapper>
      <Flex
        position="fixed"
        bottom="medium"
        right="medium"
        flexDirection="column"
        gap="small"
        alignItems="flex-end"
      >
        <FloatingActionButton icon="Plus" disabled position="none" onPress={() => {}} aria-label="Desabilitado" />
        <FloatingActionButton icon="Plus" label="Indisponível" disabled position="none" onPress={() => {}} />
      </Flex>
    </PageWrapper>
  ),
};
