import { useState } from 'react';
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
  'brand.base',
  'brand.secondary',
  'feedback.success.base',
  'feedback.warning.base',
  'feedback.critical.base',
  'feedback.info.base',
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
              borderColor={active ? 'brand.base' : 'border.subtle'}
              backgroundColor={active ? 'brand.base' : 'surface.raised'}
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
