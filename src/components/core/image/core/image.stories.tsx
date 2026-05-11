import type { Meta, StoryObj } from '@storybook/react-vite';
import { Image } from './image';
import { Box } from '../../box';
import { Flex } from '../../flex';
import { Text } from '../../text';
import type { ImageResizeMode } from '../interfaces';

const meta = {
  title: 'Core/Layout/Image',
  component: Image,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    resizeMode: {
      control: { type: 'select' },
      options: ['cover', 'contain', 'stretch', 'center'],
    },
    mode: {
      control: { type: 'select' },
      options: ['img', 'background'],
    },
    fallback: {
      control: { type: 'select' },
      options: ['skeleton', 'none'],
    },
    errorFallback: {
      control: { type: 'select' },
      options: ['icon', 'none'],
    },
  },
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj;

const PHOTO = 'https://picsum.photos/id/1015/600/400';
const PHOTO_PORTRAIT = 'https://picsum.photos/id/1027/400/600';
const PHOTO_SQUARE = 'https://picsum.photos/id/1062/400/400';
const BROKEN = 'https://invalid.example.com/missing.jpg';
const SLOW = 'https://picsum.photos/600/400?random=1&blur=2';

export const Default: Story = {
  args: {
    source: PHOTO,
    width: 480,
    height: 320,
    alt: 'Foto de paisagem',
    resizeMode: 'cover',
  },
};

export const ResizeModes: Story = {
  name: 'Anatomia — resizeMode comparado',
  render: () => {
    const modes: { mode: ImageResizeMode; descricao: string }[] = [
      { mode: 'cover', descricao: 'preenche, corta excesso (default)' },
      { mode: 'contain', descricao: 'cabe inteira, deixa espaço' },
      { mode: 'stretch', descricao: 'preenche distorcendo' },
      { mode: 'center', descricao: 'mantém escala, centraliza' },
    ];
    return (
      <Flex flexDirection="column" gap="medium" maxWidth="900px">
        <Text variant="overline" color="text.tertiary">
          Mesma imagem (600×400) em container 240×160 — note como cada modo lida com a proporção
          divergente do container.
        </Text>
        <Flex flexWrap="wrap" gap="medium">
          {modes.map(({ mode, descricao }) => (
            <Flex key={mode} flexDirection="column" gap="xsmall" width="240px">
              <Box
                width="240px"
                height="160px"
                borderWidth="hairline"
                borderStyle="solid"
                borderColor="border.subtle"
                borderRadius="medium"
                overflow="hidden"
              >
                <Image source={PHOTO} width="100%" height="100%" alt={`Modo ${mode}`} resizeMode={mode} />
              </Box>
              <Text variant="label">{mode}</Text>
              <Text variant="caption" color="text.secondary">{descricao}</Text>
            </Flex>
          ))}
        </Flex>
      </Flex>
    );
  },
};

export const AspectRatios: Story = {
  name: 'Anatomia — proporções canônicas (16:9, 4:3, 1:1, 3:4)',
  render: () => {
    const ratios = [
      { label: '16:9 — vídeo/banner', width: 480, height: 270, src: PHOTO },
      { label: '4:3 — clássico',      width: 400, height: 300, src: PHOTO },
      { label: '1:1 — quadrado',      width: 300, height: 300, src: PHOTO_SQUARE },
      { label: '3:4 — retrato',       width: 240, height: 320, src: PHOTO_PORTRAIT },
    ];
    return (
      <Flex flexDirection="column" gap="medium" maxWidth="900px">
        <Text variant="overline" color="text.tertiary">
          Use combinação `width`/`height` para fixar proporção; resizeMode=`cover` (default)
          garante que o quadro fica preenchido sem deformar.
        </Text>
        <Flex flexWrap="wrap" gap="large" alignItems="flex-end">
          {ratios.map(({ label, width, height, src }) => (
            <Flex key={label} flexDirection="column" gap="xsmall">
              <Image source={src} width={width} height={height} alt={label} />
              <Text variant="caption" color="text.secondary">{label}</Text>
            </Flex>
          ))}
        </Flex>
      </Flex>
    );
  },
};

export const AvatarLike: Story = {
  name: 'Composição — Image circular (avatar)',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth="600px">
      <Text variant="overline" color="text.tertiary">
        Crop circular via container com `borderRadius="full"` + `overflow="hidden"`.
        Para o caso real de avatar, use o componente `&lt;Avatar&gt;` que faz isso por construção.
      </Text>
      <Flex alignItems="flex-end" gap="medium">
        {([48, 64, 96, 128] as const).map((size) => (
          <Flex key={size} flexDirection="column" alignItems="center" gap="xsmall">
            <Box
              width={size}
              height={size}
              borderRadius="full"
              overflow="hidden"
            >
              <Image
                source={PHOTO_SQUARE}
                width="100%"
                height="100%"
                alt="Foto de perfil"
                resizeMode="cover"
              />
            </Box>
            <Text variant="caption" color="text.secondary">{size}px</Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  ),
};

export const BackgroundWithOverlay: Story = {
  name: 'Mode `background` — imagem com overlay sobreposto',
  args: {
    mode: 'background',
    source: PHOTO,
    width: 480,
    height: 320,
    alt: 'Banner com legenda',
    resizeMode: 'cover',
    children: (
      <Flex
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        flexDirection="column"
        gap="xsmall"
        padding="medium"
        backgroundColor="background.overlay"
      >
        <Text variant="overline" color="text.inverse">Categoria</Text>
        <Text variant="headingSmall" color="text.inverse">Título sobre a imagem</Text>
        <Text variant="caption" color="text.inverse">
          Use mode=&quot;background&quot; quando precisar de conteúdo sobreposto.
        </Text>
      </Flex>
    ),
  },
};

export const LoadingState: Story = {
  name: 'Estado — loading (skeleton shimmer default)',
  args: {
    source: SLOW,
    width: 480,
    height: 320,
    alt: 'Imagem que carrega lentamente',
  },
};

export const ErrorState: Story = {
  name: 'Estado — error (ícone ImageOff default)',
  args: {
    source: BROKEN,
    width: 480,
    height: 320,
    alt: 'Imagem que falha em carregar',
  },
};

export const CustomFallback: Story = {
  name: 'Estado — fallback customizado (loading + error)',
  args: {
    source: BROKEN,
    width: 480,
    height: 320,
    alt: 'Imagem com erro customizado',
    fallback: (
      <Box
        width="100%"
        height="100%"
        backgroundColor="background.subtle"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text variant="caption" color="text.secondary">Carregando…</Text>
      </Box>
    ),
    errorFallback: (
      <Box
        width="100%"
        height="100%"
        backgroundColor="feedback.critical.bgSubtle"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text variant="caption" color="feedback.critical.text">Imagem indisponível</Text>
      </Box>
    ),
  },
};

export const NoFallback: Story = {
  name: 'Estado — sem fallbacks (`none`)',
  args: {
    source: PHOTO,
    width: 480,
    height: 320,
    alt: 'Sem fallback',
    fallback: 'none',
    errorFallback: 'none',
  },
};
