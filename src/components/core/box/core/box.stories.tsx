import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from './box';
import { Text } from '../../text';

const meta = {
  title: 'Core/Layout/Box',
  component: Box,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    as: { control: 'text', description: 'Elemento HTML ou componente React' },
  },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    children: 'Box básico',
    padding: 'small',
    backgroundColor: 'background.subtle',
    borderRadius: 'medium',
  },
};

export const PolymorphicAs: Story = {
  name: 'Anatomia — polimorfismo via `as`',
  render: () => (
    <Box display="flex" flexDirection="column" gap="small" maxWidth="600px">
      <Text variant="overline" color="text.tertiary">
        `Box` aceita qualquer tag HTML via `as`. Para texto semântico, prefira `&lt;Text&gt;`.
      </Text>
      <Box as="section" padding="medium" backgroundColor="background.subtle" borderRadius="medium">
        as=&quot;section&quot;
      </Box>
      <Box as="article" padding="medium" backgroundColor="background.subtle" borderRadius="medium">
        as=&quot;article&quot;
      </Box>
      <Box
        as="aside"
        padding="medium"
        backgroundColor="background.subtle"
        borderRadius="medium"
        borderWidth="hairline"
        borderStyle="dashed"
        borderColor="border.default"
      >
        as=&quot;aside&quot; com `border` dashed
      </Box>
    </Box>
  ),
};

export const Nesting: Story = {
  name: 'Composição — Box aninhado',
  render: () => (
    <Box padding="large" backgroundColor="background.subtle" borderRadius="large" maxWidth="600px">
      <Box padding="small" backgroundColor="surface.default" borderRadius="medium" marginBottom="small">
        Item 1
      </Box>
      <Box padding="small" backgroundColor="surface.default" borderRadius="medium" marginBottom="small">
        Item 2
      </Box>
      <Box padding="small" backgroundColor="surface.default" borderRadius="medium">
        Item 3
      </Box>
    </Box>
  ),
};

export const Responsive: Story = {
  name: 'Anatomia — padding responsivo',
  render: () => (
    <Box display="flex" flexDirection="column" gap="small" maxWidth="600px">
      <Text variant="overline" color="text.tertiary">
        Object syntax `{'{ base, sm, md, lg }'}` aplica valores por breakpoint.
      </Text>
      <Box
        padding={{ base: 'small', md: 'large' }}
        backgroundColor="brand.bgSubtle"
        borderRadius="medium"
      >
        Padding: small em mobile, large a partir de md
      </Box>
    </Box>
  ),
};
