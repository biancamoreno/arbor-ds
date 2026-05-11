import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex } from '../../core';
import { Text } from '../../core/text';
import { ProgressBar } from './progress-bar';

const meta = {
  title: 'Feedback/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    progress: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    size: { control: { type: 'radio' }, options: ['small', 'medium', 'large'] },
    tone: {
      control: { type: 'select' },
      options: ['brand', 'info', 'success', 'warning', 'critical'],
    },
    indeterminate: { control: 'boolean' },
    label: { control: 'text' },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj;

export const Anatomy: Story = {
  name: 'Anatomia — track + fill (determinado) ou indeterminate sliding',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        `ProgressBar` é uma barra linear de progresso. Em modo determinado,
        `fill` cresce conforme `progress` (0–100, clampado). Em modo
        `indeterminate`, uma faixa de 35% desliza continuamente para indicar
        operação em andamento sem progresso conhecido. `tone` controla a cor;
        `size` controla altura (4/8/12px).
      </Text>
      <Flex flexDirection="column" gap="small">
        <ProgressBar progress={65} tone="brand" label="Determinado" />
        <ProgressBar progress={0} indeterminate label="Indeterminado" />
      </Flex>
    </Flex>
  ),
};

export const Default: Story = {
  args: { progress: 60, tone: 'brand', size: 'medium', label: 'Progresso' },
};

export const Tones: Story = {
  name: 'Tones — brand / info / success / warning / critical',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        Subset de `FeedbackTone` sem `neutral` — cinza sobre cinza não
        comunica progresso (justificativa em CONTRIBUTING.md §Feedback tones).
        Use `success` ao concluir, `warning` para pausado, `critical` para
        erro/limite, `info` para neutro-informativo.
      </Text>
      <Flex flexDirection="column" gap="small">
        {(['brand', 'info', 'success', 'warning', 'critical'] as const).map((tone) => (
          <Flex key={tone} alignItems="center" gap="small">
            <Text variant="caption" color="text.tertiary" minWidth={80}>
              {tone}
            </Text>
            <Flex flex={1}>
              <ProgressBar progress={65} tone={tone} label={`Progresso ${tone}`} />
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Flex>
  ),
};

export const Sizes: Story = {
  name: 'Sizes — small (4px) / medium (8px) / large (12px)',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        Altura resolve via `theme.components.progressBar.height.{'{size}'}`. Use
        `small` em listas densas e tooltips; `large` em uploads/downloads onde
        a barra é o foco da tela.
      </Text>
      <Flex flexDirection="column" gap="small">
        <ProgressBar progress={50} size="small" label="Small" />
        <ProgressBar progress={50} size="medium" label="Medium" />
        <ProgressBar progress={50} size="large" label="Large" />
      </Flex>
    </Flex>
  ),
};

export const Complete: Story = {
  name: 'Concluído — 100% + tone="success"',
  args: { progress: 100, tone: 'success', label: 'Concluído' },
};

export const Indeterminate: Story = {
  name: 'Indeterminate — animação contínua sem progresso conhecido',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="640px">
      <Text variant="overline" color="text.tertiary">
        `indeterminate={'{true}'}` ativa animação contínua para operações sem
        progresso conhecido (fetch inicial, upload sem chunks, etc). Web usa
        CSS keyframe `arbor-progress-indeterminate`; native usa `Animated.loop`
        com `translateX` em pixels (mede a track via `onLayout`). Em ambos os
        casos, `aria-busy="true"` é anunciado e `usePrefersReducedMotion` é
        respeitado.
      </Text>
      <Flex flexDirection="column" gap="small">
        <ProgressBar progress={0} indeterminate tone="brand" label="Carregando" />
        <ProgressBar progress={0} indeterminate tone="info" size="small" label="Sincronizando" />
      </Flex>
    </Flex>
  ),
};

export const LiveProgress: Story = {
  name: 'Composição real — progresso simulado de download',
  render: () => {
    function LiveProgressExample() {
      const [value, setValue] = useState(0);
      useEffect(() => {
        if (value >= 100) return;
        const t = setTimeout(() => setValue((prev) => Math.min(100, prev + 7)), 600);
        return () => clearTimeout(t);
      }, [value]);
      return (
        <Flex flexDirection="column" gap="medium" maxWidth="640px">
          <Text variant="overline" color="text.tertiary">
            Padrão real: progresso em tempo de execução com transition tokenizada
            (`transition.slow` + easing `standard`). A barra desliza suavemente
            entre os ticks; ao atingir 100%, troca de tone para `success`.
          </Text>
          <Flex flexDirection="column" gap="small">
            <Flex justifyContent="space-between" alignItems="baseline">
              <Text variant="bodyMedium" fontWeight="semibold">
                Baixando arquivo
              </Text>
              <Text variant="caption" color="text.tertiary">
                {value}%
              </Text>
            </Flex>
            <ProgressBar
              progress={value}
              tone={value === 100 ? 'success' : 'brand'}
              label={value === 100 ? 'Concluído' : `${value}% baixado`}
            />
          </Flex>
        </Flex>
      );
    }
    return <LiveProgressExample />;
  },
};
