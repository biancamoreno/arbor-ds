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
  <Box height="100vh" position="relative" backgroundColor="#f9fafb" padding="24px">
    <Text as="p" color="#6b7280" fontSize={14}>Conteúdo da página</Text>
    {children}
  </Box>
);

export const Default: Story = {
  render: () => (
    <PageWrapper>
      <FloatingActionButton icon="Plus" onPress={() => alert('Adicionar!')} aria-label="Adicionar item" />
    </PageWrapper>
  ),
};

export const Extended: Story = {
  render: () => (
    <PageWrapper>
      <FloatingActionButton
        icon="Plus"
        label="Nova venda"
        onPress={() => alert('Nova venda!')}
      />
    </PageWrapper>
  ),
};

export const Sizes: Story = {
  render: () => (
    <PageWrapper>
      <Flex
        position="fixed"
        bottom="24px"
        right="24px"
        flexDirection="column"
        gap="16px"
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
  render: () => (
    <PageWrapper>
      <Flex
        position="fixed"
        bottom="24px"
        right="24px"
        flexDirection="column"
        gap="16px"
        alignItems="flex-end"
      >
        <FloatingActionButton icon="Pencil" variant="primary" position="none" onPress={() => {}} aria-label="Primary" />
        <FloatingActionButton icon="Pencil" variant="secondary" position="none" onPress={() => {}} aria-label="Secondary" />
        <FloatingActionButton icon="Pencil" variant="surface" position="none" onPress={() => {}} aria-label="Surface" />
      </Flex>
    </PageWrapper>
  ),
};
