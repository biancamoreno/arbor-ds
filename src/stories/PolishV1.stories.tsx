import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArborProvider } from '../ecosystem';
import { themeLight } from '../foundations';
import { Box } from '../components/core/box';
import { Flex } from '../components/core/flex';
import { Text } from '../components/core/text';
import { Button } from '../components/button';
import { Card } from '../components/card';

const BRAND_ROLES = [
  'bg', 'bgSubtle', 'bgElement', 'bgElementHover', 'bgElementActive',
  'borderSubtle', 'border', 'borderHover',
  'solid', 'solidHover', 'text', 'textContrast',
] as const;

const meta = {
  title: 'Foundations/Polish v1 — Default visual',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Showcase do default visual aplicado na RFC-0041 PR1. ' +
          'Brand `forestGreen` (folha viva — alusão direta ao nome "arbor"); ' +
          'hover/active expressos por fade de opacidade (sem deslocamento físico do componente); ' +
          'motion snap (160ms · easeOutQuart); foco com glow externo; ' +
          'Button fontWeight `semibold`. Aprovação destrava PR2 (sweep coletivo).',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Showcase: Story = {
  name: 'Default v1 (ForestGreen)',
  render: () => (
    <ArborProvider theme={themeLight}>
      <Box padding="large" backgroundColor="background.subtle" minHeight="100vh">
        <Flex flexDirection="column" gap="large" maxWidth="960px">
          <Flex flexDirection="column" gap="nano">
            <Text fontSize="xlarge" fontWeight="bold" color="text.primary">
              Polish v1 — default visual
            </Text>
            <Text fontSize="small" color="text.secondary">
              Brand forestGreen (folha viva, identidade arbor) · hover/active por fade de opacidade ·
              motion snap · foco com glow.
            </Text>
          </Flex>

          <Card variant="outlined" padding="large">
            <Flex flexDirection="column" gap="medium">
              <Text fontSize="medium" fontWeight="bold" color="text.primary">
                Button piloto
              </Text>
              <Text fontSize="xsmall" color="text.tertiary">
                Hover: opacity 0.92 (fade suave). Active (pressed): opacity 0.80. Tab para inspecionar foco com glow.
              </Text>
              <Flex gap="small" flexWrap="wrap">
                <Button variant="primary" size="medium">Primary</Button>
                <Button variant="secondary" size="medium">Secondary</Button>
                <Button variant="ghost" size="medium">Ghost</Button>
                <Button variant="danger" size="medium">Danger</Button>
              </Flex>
              <Flex gap="small" flexWrap="wrap" alignItems="center">
                <Button variant="primary" size="small">Small</Button>
                <Button variant="primary" size="medium">Medium · 44px</Button>
                <Button variant="primary" size="large">Large</Button>
              </Flex>
            </Flex>
          </Card>

          <Card variant="outlined" padding="large">
            <Flex flexDirection="column" gap="medium">
              <Text fontSize="medium" fontWeight="bold" color="text.primary">
                Brand swatches (12 papéis canônicos)
              </Text>
              <Flex gap="nano" flexWrap="wrap">
                {BRAND_ROLES.map((role) => (
                  <Flex key={role} flexDirection="column" alignItems="center" gap="nano" width="64px">
                    <Box
                      width="48px"
                      height="48px"
                      borderRadius="small"
                      borderWidth="hairline"
                      borderStyle="solid"
                      borderColor="border.subtle"
                      backgroundColor={`brand.${role}`}
                    />
                    <Text fontSize="xsmall" color="text.tertiary">{role}</Text>
                  </Flex>
                ))}
              </Flex>
            </Flex>
          </Card>

          <Card variant="outlined" padding="large">
            <Flex flexDirection="column" gap="medium">
              <Text fontSize="medium" fontWeight="bold" color="text.primary">
                Display sizes (semantic novo)
              </Text>
              <Flex flexDirection="column" gap="small">
                <Text fontSize="displayHero" fontWeight="bold" color="text.primary">
                  Hero · 72px
                </Text>
                <Text fontSize="displayLarge" fontWeight="bold" color="text.primary">
                  Display large · 60px
                </Text>
                <Text fontSize="displayMedium" fontWeight="bold" color="text.primary">
                  Display medium · 48px
                </Text>
                <Text fontSize="displaySmall" fontWeight="bold" color="text.primary">
                  Display small · 40px
                </Text>
              </Flex>
            </Flex>
          </Card>
        </Flex>
      </Box>
    </ArborProvider>
  ),
};
