import type { Meta, StoryObj } from '@storybook/react-vite';
import { Image } from './image';
import { Box } from '../../box';
import { Text } from '../../text';

const meta = {
  title: 'Core/Layout/Image',
  component: Image,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
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
type Story = StoryObj<typeof meta>;

const PLACEHOLDER = 'https://placehold.co/400x250/4a90e2/ffffff?text=Arbor+DS';
const BROKEN = 'https://invalid.example.com/missing.jpg';

export const Default: Story = {
  args: {
    source: PLACEHOLDER,
    width: 400,
    height: 250,
    alt: 'Imagem de exemplo',
    resizeMode: 'cover',
  },
};

export const Contain: Story = {
  args: {
    source: PLACEHOLDER,
    width: 400,
    height: 250,
    alt: 'Contain mode',
    resizeMode: 'contain',
  },
};

export const Stretch: Story = {
  args: {
    source: PLACEHOLDER,
    width: 400,
    height: 250,
    alt: 'Stretch mode',
    resizeMode: 'stretch',
  },
};

export const CenterMode: Story = {
  args: {
    source: PLACEHOLDER,
    width: 400,
    height: 250,
    alt: 'Center mode',
    resizeMode: 'center',
  },
};

export const Background: Story = {
  args: {
    mode: 'background',
    source: PLACEHOLDER,
    width: 400,
    height: 250,
    alt: 'Banner com legenda',
    children: (
      <Box position="absolute" bottom={0} left={0} right={0} padding="md" backgroundColor="background.overlay">
        <Text as="span" color="text.inverse">Legenda da imagem</Text>
      </Box>
    ),
  },
};

export const ErrorState: Story = {
  args: {
    source: BROKEN,
    width: 400,
    height: 250,
    alt: 'Imagem que falha',
  },
};

export const CustomFallback: Story = {
  args: {
    source: PLACEHOLDER,
    width: 400,
    height: 250,
    alt: 'Imagem com loading custom',
    fallback: <Box width="100%" height="100%" backgroundColor="background.subtle" />,
  },
};

export const NoFallback: Story = {
  args: {
    source: PLACEHOLDER,
    width: 400,
    height: 250,
    alt: 'Sem fallback',
    fallback: 'none',
    errorFallback: 'none',
  },
};
