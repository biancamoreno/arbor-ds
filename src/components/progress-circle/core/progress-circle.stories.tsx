import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex } from '../../core';
import { Text } from '../../core/text';
import { ProgressCircle } from './progress-circle';

const meta = {
  title: 'Feedback/ProgressCircle',
  component: ProgressCircle,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    progress: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    size: { control: { type: 'radio' }, options: ['small', 'medium', 'large'] },
    strokeWidth: { control: { type: 'number', min: 2, max: 20 } },
    tone: {
      control: { type: 'select' },
      options: ['brand', 'info', 'success', 'warning', 'critical'],
    },
    indeterminate: { control: 'boolean' },
    label: { control: 'text' },
  },
} satisfies Meta<typeof ProgressCircle>;

export default meta;
type Story = StoryObj;

export const Anatomy: Story = {
  name: 'Anatomia — track + trace (determinado) ou spin (indeterminate)',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        `ProgressCircle` é um indicador circular SVG. Em modo determinado,
        o arco (`trace`) cresce conforme `progress` sobre uma `track`
        circular completa. Em modo `indeterminate`, o container inteiro gira
        continuamente (CSS `arbor-spin` no web, `Animated.loop` no native).
      </Text>
      <Flex gap="large" alignItems="center">
        <ProgressCircle progress={65} tone="brand" label="Determinado 65%" />
        <ProgressCircle progress={0} indeterminate label="Indeterminado" />
      </Flex>
    </Flex>
  ),
};

export const Default: Story = {
  args: { progress: 65, tone: 'brand', size: 'medium', label: 'Progresso' },
};

export const Tones: Story = {
  name: 'Tones — brand / info / success / warning / critical',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        Subset de `FeedbackTone` sem `neutral` (paridade com `ProgressBar` —
        cinza não comunica progresso). Use `success` ao concluir, `warning`
        para pausado, `critical` para erro/limite, `info` para neutro-informativo.
      </Text>
      <Flex gap="medium" alignItems="center">
        {(['brand', 'info', 'success', 'warning', 'critical'] as const).map((tone) => (
          <Flex key={tone} flexDirection="column" alignItems="center" gap="tiny">
            <ProgressCircle progress={75} tone={tone} label={`Progresso ${tone}`} />
            <Text variant="caption" color="text.tertiary">{tone}</Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  ),
};

export const Sizes: Story = {
  name: 'Sizes — small (24px) / medium (48px) / large (64px)',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        Diâmetro resolve via `theme.components.progressCircle.size.{'{size}'}`.
        `strokeWidth` escala automaticamente por size; override pontual via
        prop `strokeWidth` em pixels.
      </Text>
      <Flex gap="large" alignItems="center">
        <ProgressCircle progress={50} size="small" label="Small" />
        <ProgressCircle progress={50} size="medium" label="Medium" />
        <ProgressCircle progress={50} size="large" label="Large" />
      </Flex>
    </Flex>
  ),
};

export const Complete: Story = {
  name: 'Concluído — 100% + tone="success"',
  args: { progress: 100, tone: 'success', size: 'large', label: 'Concluído' },
};

export const Indeterminate: Story = {
  name: 'Indeterminate — rotação contínua sem progresso conhecido',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        `indeterminate={'{true}'}` ativa rotação contínua. Web usa CSS
        keyframe `arbor-spin`; native usa `Animated.loop` com
        `useNativeDriver`. Em ambos, `aria-busy="true"` é anunciado e
        `usePrefersReducedMotion` é respeitado (TD-041 fechada em PCV-15).
      </Text>
      <Flex gap="large" alignItems="center">
        <ProgressCircle progress={0} indeterminate size="small" tone="brand" label="Carregando small" />
        <ProgressCircle progress={0} indeterminate size="medium" tone="info" label="Carregando medium" />
        <ProgressCircle progress={0} indeterminate size="large" tone="success" label="Carregando large" />
      </Flex>
    </Flex>
  ),
};

export const LiveProgress: Story = {
  name: 'Composição real — progresso simulado de upload',
  render: () => {
    function LiveProgressExample() {
      const [value, setValue] = useState(0);
      useEffect(() => {
        if (value >= 100) return;
        const t = setTimeout(() => setValue((prev) => Math.min(100, prev + 9)), 500);
        return () => clearTimeout(t);
      }, [value]);
      return (
        <Flex flexDirection="column" gap="medium" maxWidth="640px" alignItems="center">
          <Text variant="overline" color="text.tertiary">
            Padrão real: progresso em tempo de execução com transition
            tokenizada no `strokeDashoffset`. Ao atingir 100%, troca de tone
            para `success`.
          </Text>
          <ProgressCircle
            progress={value}
            size="large"
            tone={value === 100 ? 'success' : 'brand'}
            label={value === 100 ? 'Upload concluído' : `${value}% enviado`}
          />
          <Text variant="bodyMedium" fontWeight="semibold">
            {value === 100 ? 'Upload concluído' : `${value}%`}
          </Text>
        </Flex>
      );
    }
    return <LiveProgressExample />;
  },
};
