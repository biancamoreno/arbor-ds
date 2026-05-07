import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Flex, Text } from '../../core';
import { Carousel } from './carousel';

const meta = {
  title: 'Content/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj;

function Card({ index, color }: { index: number; color: string }) {
  return (
    <Box
      backgroundColor={color}
      padding="large"
      borderRadius="medium"
      width="100%"
      height={200}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Text fontSize="xlarge" fontWeight="bold" color="text.inverse">
        Slide {index + 1}
      </Text>
    </Box>
  );
}

const PALETTE = [
  'brand.solid',
  'gray.solid',
  'feedback.success.solid',
  'feedback.warning.solid',
  'feedback.critical.solid',
  'feedback.info.solid',
];

// ─── Stories canônicas ──────────────────────────────────────────────────────

/** 1 slide visível — Tabs pattern nos indicadores (≤7 items + spv=1). */
export const SingleSlide: Story = {
  render: () => (
    <Box style={{ width: 600 }}>
      <Carousel ariaLabel="Vitrine principal">
        <Carousel.Content>
          {Array.from({ length: 5 }, (_, i) => (
            <Carousel.Item key={i}>
              <Card index={i} color={PALETTE[i % PALETTE.length]} />
            </Carousel.Item>
          ))}
        </Carousel.Content>
        <Flex marginTop="medium" gap="small" justifyContent="center">
          <Carousel.Previous />
          <Carousel.Next />
        </Flex>
        <Carousel.Indicators />
      </Carousel>
    </Box>
  ),
};

/** 2 slides simultâneos. Como spv > 1, indicadores caem em Group pattern. */
export const TwoSlidesPerView: Story = {
  render: () => (
    <Box style={{ width: 600 }}>
      <Carousel ariaLabel="Produtos" slidesPerView={2} gap="medium">
        <Carousel.Content>
          {Array.from({ length: 6 }, (_, i) => (
            <Carousel.Item key={i}>
              <Card index={i} color={PALETTE[i % PALETTE.length]} />
            </Carousel.Item>
          ))}
        </Carousel.Content>
        <Flex marginTop="medium" gap="small" justifyContent="center">
          <Carousel.Previous />
          <Carousel.Next />
        </Flex>
        <Carousel.Indicators />
      </Carousel>
    </Box>
  ),
};

/**
 * 4 slides simultâneos. slidesPerView=4 → Group pattern (mais que spv=1).
 */
export const FourSlidesPerView: Story = {
  render: () => (
    <Box style={{ width: 800 }}>
      <Carousel ariaLabel="Catálogo" slidesPerView={4} gap="small">
        <Carousel.Content>
          {Array.from({ length: 8 }, (_, i) => (
            <Carousel.Item key={i}>
              <Card index={i} color={PALETTE[i % PALETTE.length]} />
            </Carousel.Item>
          ))}
        </Carousel.Content>
        <Flex marginTop="medium" gap="small" justifyContent="center">
          <Carousel.Previous />
          <Carousel.Next />
        </Flex>
        <Carousel.Indicators />
      </Carousel>
    </Box>
  ),
};

/**
 * Responsive: 1 slide em mobile, 2 em tablet, 4 em desktop. Ajuste o
 * tamanho da janela para ver a transição.
 */
export const Responsive: Story = {
  render: () => (
    <Box style={{ width: '100%' }}>
      <Carousel
        ariaLabel="Vitrine responsiva"
        slidesPerView={{ base: 1, md: 2, lg: 4 }}
        gap="medium"
      >
        <Carousel.Content>
          {Array.from({ length: 6 }, (_, i) => (
            <Carousel.Item key={i}>
              <Card index={i} color={PALETTE[i % PALETTE.length]} />
            </Carousel.Item>
          ))}
        </Carousel.Content>
        <Flex marginTop="medium" gap="small" justifyContent="center">
          <Carousel.Previous />
          <Carousel.Next />
        </Flex>
        <Carousel.Indicators />
      </Carousel>
    </Box>
  ),
};

/**
 * 8+ items mostrando Group fallback. Cada dot é um botão individual
 * (Tabs pattern não cabe — APG considera "least friendly to keyboard"
 * mas é a forma correta quando há muitos items).
 */
export const GroupFallbackEightItems: Story = {
  render: () => (
    <Box style={{ width: 600 }}>
      <Carousel ariaLabel="Galeria" slidesPerView={1}>
        <Carousel.Content>
          {Array.from({ length: 8 }, (_, i) => (
            <Carousel.Item key={i}>
              <Card index={i} color={PALETTE[i % PALETTE.length]} />
            </Carousel.Item>
          ))}
        </Carousel.Content>
        <Flex marginTop="medium" gap="small" justifyContent="center">
          <Carousel.Previous />
          <Carousel.Next />
        </Flex>
        <Carousel.Indicators />
      </Carousel>
    </Box>
  ),
};

/** Render prop em Indicators — controle visual total dos dots. */
export const CustomIndicators: Story = {
  render: () => (
    <Box style={{ width: 600 }}>
      <Carousel ariaLabel="Slides com indicador numérico">
        <Carousel.Content>
          {Array.from({ length: 4 }, (_, i) => (
            <Carousel.Item key={i}>
              <Card index={i} color={PALETTE[i % PALETTE.length]} />
            </Carousel.Item>
          ))}
        </Carousel.Content>
        <Flex marginTop="medium" gap="small" justifyContent="center">
          <Carousel.Previous />
          <Carousel.Next />
        </Flex>
        <Carousel.Indicators>
          {({ index, active, goTo, total }) => (
            <Box
              as="button"
              onClick={goTo}
              padding="small"
              borderRadius="small"
              borderWidth="hairline"
              borderStyle="solid"
              borderColor={active ? 'brand.solid' : 'border.subtle'}
              backgroundColor={active ? 'brand.solid' : 'surface.raised'}
              color={active ? 'text.inverse' : 'text.primary'}
              fontWeight="medium"
              cursor="pointer"
              aria-label={`Ir para slide ${index + 1} de ${total}`}
            >
              {index + 1}
            </Box>
          )}
        </Carousel.Indicators>
      </Carousel>
    </Box>
  ),
};

function ControlledExample() {
  const [active, setActive] = useState(0);
  return (
    <Box style={{ width: 600 }}>
      <Text>activeIndex (externo): <strong>{active}</strong></Text>
      <Carousel
        ariaLabel="Carousel controlado"
        activeIndex={active}
        onActiveIndexChange={setActive}
      >
        <Carousel.Content>
          {Array.from({ length: 4 }, (_, i) => (
            <Carousel.Item key={i}>
              <Card index={i} color={PALETTE[i % PALETTE.length]} />
            </Carousel.Item>
          ))}
        </Carousel.Content>
        <Flex marginTop="medium" gap="small" justifyContent="center">
          <Carousel.Previous />
          <Carousel.Next />
        </Flex>
        <Carousel.Indicators />
      </Carousel>
    </Box>
  );
}

/** Controlled: o consumidor mantém o estado externamente. */
export const Controlled: Story = {
  render: () => <ControlledExample />,
};

/**
 * Autoplay com `Carousel.PlayPause` (APG: o controle de
 * pause/play é obrigatório quando autoplay está ativo). Pausa em
 * hover, foco interno, página oculta e via toggle manual.
 */
export const Autoplay: Story = {
  render: () => (
    <Box style={{ width: 600 }}>
      <Carousel
        ariaLabel="Carousel com autoplay"
        autoplay={{ interval: 3000 }}
      >
        <Carousel.Content>
          {Array.from({ length: 4 }, (_, i) => (
            <Carousel.Item key={i}>
              <Card index={i} color={PALETTE[i % PALETTE.length]} />
            </Carousel.Item>
          ))}
        </Carousel.Content>
        <Flex marginTop="medium" gap="small" justifyContent="center">
          <Carousel.Previous />
          <Carousel.PlayPause />
          <Carousel.Next />
        </Flex>
        <Carousel.Indicators />
      </Carousel>
    </Box>
  ),
};

/**
 * `orientation="vertical"`. Slides empilhados verticalmente com
 * `scroll-snap-type: y mandatory`. Indicators continuam horizontais
 * por convenção visual. O consumidor define a altura do `Content`
 * (sem isso, o vertical não tem como dimensionar os slides).
 *
 * Em `Tabs pattern` (≤7 + spv=1), o tablist recebe
 * `aria-orientation="vertical"` e os atalhos de teclado mudam para
 * `ArrowUp`/`ArrowDown`.
 */
export const VerticalOrientation: Story = {
  render: () => (
    <Flex gap="medium" alignItems="flex-start">
      <Box style={{ width: 320 }}>
        <Carousel ariaLabel="Stories verticais" orientation="vertical">
          <Carousel.Content style={{ height: 480 }}>
            {Array.from({ length: 4 }, (_, i) => (
              <Carousel.Item key={i}>
                <Card index={i} color={PALETTE[i % PALETTE.length]} />
              </Carousel.Item>
            ))}
          </Carousel.Content>
          <Flex marginTop="medium" gap="small" justifyContent="center">
            <Carousel.Previous />
            <Carousel.Next />
          </Flex>
          <Carousel.Indicators />
        </Carousel>
      </Box>
    </Flex>
  ),
};

function LazyMountingExample() {
  const renderedRef = useRef<Set<number>>(new Set());
  const [snapshot, setSnapshot] = useState<number[]>([]);

  return (
    <Box style={{ width: 800 }}>
      <Text fontSize="small" color="text.muted">
        Mounted indices: {snapshot.length === 0 ? '(nenhum ainda)' : snapshot.join(', ')}
      </Text>
      <Carousel ariaLabel="Catálogo lazy" slidesPerView={3} gap="small" lazy>
        <Carousel.Content>
          {Array.from({ length: 20 }, (_, i) => (
            <Carousel.Item key={i}>
              <LazyTrackedCard
                index={i}
                color={PALETTE[i % PALETTE.length]}
                onMount={(idx) => {
                  renderedRef.current.add(idx);
                  setSnapshot([...renderedRef.current].sort((a, b) => a - b));
                }}
              />
            </Carousel.Item>
          ))}
        </Carousel.Content>
        <Flex marginTop="medium" gap="small" justifyContent="center">
          <Carousel.Previous />
          <Carousel.Next />
        </Flex>
        <Carousel.Indicators />
      </Carousel>
    </Box>
  );
}

function LazyTrackedCard({
  index,
  color,
  onMount,
}: {
  index: number;
  color: string;
  onMount: (index: number) => void;
}) {
  useEffect(() => {
    onMount(index);
  }, [index, onMount]);
  return <Card index={index} color={color} />;
}

/**
 * `lazy=true`: items fora da janela expandida (rootMargin 200px)
 * renderizam placeholder vazio; ao entrar, montam children e
 * permanecem montados (sticky — preserva state de form/video). O
 * texto acima do carousel mostra os índices que já montaram.
 *
 * Embla é a referência: virtualização é opt-in, não default.
 */
export const LazyMounting: Story = {
  render: () => <LazyMountingExample />,
};
