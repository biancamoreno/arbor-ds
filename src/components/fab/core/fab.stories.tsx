import type { Meta, StoryObj } from '@storybook/react-vite';
import { FloatingActionButton } from './fab';

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
    size: { control: { type: 'radio' }, options: ['sm', 'md', 'lg'] },
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
  <div style={{ height: '100vh', position: 'relative', background: '#f9fafb', padding: 24 }}>
    <p style={{ color: '#6b7280', fontSize: 14 }}>Conteúdo da página</p>
    {children}
  </div>
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
      <div style={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-end' }}>
        <FloatingActionButton icon="Plus" size="sm" position="none" onPress={() => {}} aria-label="Pequeno" />
        <FloatingActionButton icon="Plus" size="md" position="none" onPress={() => {}} aria-label="Médio" />
        <FloatingActionButton icon="Plus" size="lg" position="none" onPress={() => {}} aria-label="Grande" />
      </div>
    </PageWrapper>
  ),
};

export const Variants: Story = {
  render: () => (
    <PageWrapper>
      <div style={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-end' }}>
        <FloatingActionButton icon="Pencil" variant="primary" position="none" onPress={() => {}} aria-label="Primary" />
        <FloatingActionButton icon="Pencil" variant="secondary" position="none" onPress={() => {}} aria-label="Secondary" />
        <FloatingActionButton icon="Pencil" variant="surface" position="none" onPress={() => {}} aria-label="Surface" />
      </div>
    </PageWrapper>
  ),
};
