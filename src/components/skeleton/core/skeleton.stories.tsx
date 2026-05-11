import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Flex } from '../../core';
import { Text } from '../../core';
import { Skeleton } from './skeleton';

const meta = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    width: { control: 'text' },
    height: { control: 'text' },
    borderRadius: { control: 'text' },
    lines: { control: { type: 'number', min: 1, max: 10 } },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { width: 240, height: 16 },
};

export const SingleLine: Story = {
  name: 'Anatomia — linha única (default)',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="600px">
      <Text variant="overline" color="text.tertiary">
        Sem `lines`, renderiza um bloco com `width`/`height`/`borderRadius` informados.
      </Text>
      <Flex flexDirection="column" gap="xsmall">
        <Skeleton width="100%" height={16} />
        <Skeleton width="80%" height={16} />
        <Skeleton width="60%" height={16} />
      </Flex>
    </Flex>
  ),
};

export const MultiLine: Story = {
  name: 'Anatomia — stack de linhas via `lines`',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="600px">
      <Text variant="overline" color="text.tertiary">
        Com `lines={'{N}'}`, gera stack vertical onde a última linha tem 60% da largura
        (padrão de "fim de parágrafo").
      </Text>
      <Skeleton lines={4} width="100%" height={14} />
    </Flex>
  ),
};

export const TextHierarchy: Story = {
  name: 'Composição — skeleton de hierarquia tipográfica',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="600px">
      <Text variant="overline" color="text.tertiary">
        Alturas espelham a hierarquia tipográfica do PCV-1 (headingMedium → bodyMedium → caption).
      </Text>
      <Flex flexDirection="column" gap="small">
        <Skeleton width="50%" height={28} borderRadius="micro" />
        <Skeleton lines={3} width="100%" height={16} />
        <Skeleton width="30%" height={12} />
      </Flex>
    </Flex>
  ),
};

export const AvatarShape: Story = {
  name: 'Composição — skeleton circular (avatar)',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="600px">
      <Text variant="overline" color="text.tertiary">
        Use `borderRadius="full"` para placeholder circular. Para o caso real de avatar,
        prefira `&lt;Avatar&gt;` com prop loading.
      </Text>
      <Flex alignItems="flex-end" gap="medium">
        {([32, 48, 64, 96] as const).map((size) => (
          <Flex key={size} flexDirection="column" alignItems="center" gap="xsmall">
            <Skeleton width={size} height={size} borderRadius="full" />
            <Text variant="caption" color="text.secondary">{size}px</Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  ),
};

export const CardSkeleton: Story = {
  name: 'Composição — Card placeholder realista',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="700px">
      <Text variant="overline" color="text.tertiary">
        Composição típica: avatar + título + parágrafo + meta. Use enquanto os dados reais
        chegam.
      </Text>
      <Flex
        flexDirection="column"
        gap="small"
        width="100%"
        maxWidth="320px"
        padding="medium"
        borderWidth="hairline"
        borderStyle="solid"
        borderColor="border.subtle"
        borderRadius="medium"
      >
        <Flex alignItems="center" gap="small">
          <Skeleton width={48} height={48} borderRadius="full" />
          <Flex flexDirection="column" gap="xsmall" flex="1">
            <Skeleton width="70%" height={16} />
            <Skeleton width="40%" height={12} />
          </Flex>
        </Flex>
        <Skeleton lines={3} height={14} />
        <Skeleton width="30%" height={12} />
      </Flex>
    </Flex>
  ),
};

export const SuppressedAnnouncement: Story = {
  name: 'A11y — `label={false}` quando outro indicador já anuncia',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="600px">
      <Text variant="overline" color="text.tertiary">
        Quando o container já tem `aria-busy="true"` ou outro indicador (Spinner) anuncia o
        loading, suprima o anúncio do Skeleton para evitar dupla notificação.
      </Text>
      <Box
        aria-busy="true"
        padding="medium"
        borderWidth="hairline"
        borderStyle="solid"
        borderColor="border.subtle"
        borderRadius="medium"
      >
        <Flex flexDirection="column" gap="xsmall">
          <Skeleton width="100%" height={16} label={false} />
          <Skeleton width="80%" height={16} label={false} />
          <Skeleton width="60%" height={16} label={false} />
        </Flex>
      </Box>
    </Flex>
  ),
};

export const ReducedMotion: Story = {
  name: 'A11y — reduced-motion',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="700px">
      <Text variant="overline" color="text.tertiary">
        Quando o usuário ativa &quot;Reduzir movimento&quot; no sistema, a animação shimmer
        (web) / pulse (native) é congelada num estado intermediário visualmente estável.
        Anúncio para leitores permanece (`role=&quot;status&quot;` + `aria-label`).
      </Text>
      <Flex flexDirection="column" gap="xsmall">
        <Skeleton width="100%" height={16} />
        <Skeleton width="80%" height={16} />
        <Skeleton width="60%" height={16} />
        <Text variant="caption" color="text.secondary">
          (Ative &quot;Reduce motion&quot; no SO para ver o efeito.)
        </Text>
      </Flex>
    </Flex>
  ),
};
