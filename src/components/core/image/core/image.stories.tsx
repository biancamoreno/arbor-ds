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
  },
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj;

const PLACEHOLDER = 'https://placehold.co/400x250/4a90e2/ffffff?text=Arbor+DS';

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

export const WithOverlay: Story = {
  render: () => (
    <Image source={PLACEHOLDER} width={400} height={250} alt="Com overlay">
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        padding="12px 16px"
        backgroundColor="rgba(0,0,0,0.6)"
      >
        <Text as="span" color="#fff">Legenda da imagem</Text>
      </Box>
    </Image>
  ),
};
