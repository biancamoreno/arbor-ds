import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container } from './container';
import { Box } from '../../box';
import { Flex } from '../../flex';
import { Text } from '../../text';

const meta = {
  title: 'Core/Layout/Container',
  component: Container,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj;

const Content = ({ label }: { label: string }) => (
  <Box
    padding="medium"
    backgroundColor="brand.bgSubtle"
    borderRadius="medium"
    borderWidth="hairline"
    borderStyle="dashed"
    borderColor="brand.border"
  >
    <Text>{label}</Text>
  </Box>
);

export const Responsive: Story = {
  name: 'Anatomia — `maxWidth` automático por breakpoint',
  render: () => (
    <Box backgroundColor="background.subtle" paddingY="large" minHeight="200px">
      <Container>
        <Content label="Container responsivo (escala com breakpoints do tema)" />
      </Container>
    </Box>
  ),
};

export const FixedBreakpoint: Story = {
  name: 'Anatomia — `maxWidth` fixo em breakpoint específico',
  render: () => (
    <Flex flexDirection="column" gap="medium" backgroundColor="background.subtle" paddingY="large">
      <Container maxWidth="sm"><Content label="maxWidth=sm" /></Container>
      <Container maxWidth="md"><Content label="maxWidth=md" /></Container>
      <Container maxWidth="lg"><Content label="maxWidth=lg" /></Container>
    </Flex>
  ),
};

export const Fluid: Story = {
  name: 'Anatomia — `fluid` (100% da largura)',
  render: () => (
    <Box backgroundColor="background.subtle" paddingY="large">
      <Container fluid>
        <Content label="Container fluid — ocupa 100% sem maxWidth" />
      </Container>
    </Box>
  ),
};

export const CenterContent: Story = {
  name: 'Composição — `centerContent` empilha filhos centralizados',
  render: () => (
    <Box backgroundColor="background.subtle" paddingY="large">
      <Container centerContent>
        <Text variant="headingMedium">Título centrado</Text>
        <Text variant="bodyMedium" color="text.secondary">
          Use `centerContent` para hero / empty state simples.
        </Text>
      </Container>
    </Box>
  ),
};
