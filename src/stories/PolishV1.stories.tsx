import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArborProvider } from '../ecosystem';
import { themeLight, createBrandPalette, createTheme } from '../foundations';
import type { ArborTheme } from '../foundations/theme/Theme';
import { Box } from '../components/core/box';
import { Flex } from '../components/core/flex';
import { Text } from '../components/core/text';
import { Button } from '../components/button';
import { Card } from '../components/card';

const sapphire = createBrandPalette('#0B46E6');
const violet = createBrandPalette('#9F23FB');

function withBrand(name: string, brand: ReturnType<typeof createBrandPalette>): ArborTheme {
  return createTheme(themeLight as unknown as ArborTheme, {
    mode: name,
    colors: {
      brand: brand.light,
      interactive: {
        default: brand.light.solid,
        hover: brand.light.solidHover,
        active: brand.light.textContrast,
      },
      border: { interactive: brand.light.solid },
      icon: { interactive: brand.light.solid },
      focus: { ring: brand.light.solid },
    },
  });
}

const themeSapphire = withBrand('polish-sapphire', sapphire);
const themeViolet = withBrand('polish-violet', violet);

type Candidate = {
  label: string;
  hex: string;
  description: string;
  theme: ArborTheme;
};

const candidates: Candidate[] = [
  {
    label: 'Sapphire 70',
    hex: '#0B46E6',
    description: 'Azul royal · fintech-friendly · contraste AAA',
    theme: themeSapphire,
  },
  {
    label: 'Ultraviolet 70 (recomendado)',
    hex: '#6352E1',
    description: 'Violeta moderno · Linear-feel · contraste AA · default da RFC-0041',
    theme: themeLight,
  },
  {
    label: 'Violet 70',
    hex: '#9F23FB',
    description: 'Magenta-violeta · expressivo · polariza por setor',
    theme: themeViolet,
  },
];

function CandidateColumn({ candidate }: { candidate: Candidate }) {
  return (
    <ArborProvider theme={candidate.theme}>
      <Box
        backgroundColor="surface.default"
        borderColor="border.default"
        borderWidth="hairline"
        borderStyle="solid"
        borderRadius="medium"
        padding="large"
        width="100%"
      >
        <Flex flexDirection="column" gap="medium">
          <Flex alignItems="center" gap="small">
            <Box
              width="24px"
              height="24px"
              borderRadius="full"
              borderWidth="hairline"
              borderStyle="solid"
              borderColor="border.subtle"
              backgroundColor="brand.solid"
            />
            <Flex flexDirection="column" gap="nano">
              <Text fontSize="medium" fontWeight="bold" color="text.primary">
                {candidate.label}
              </Text>
              <Text fontSize="xsmall" color="text.secondary">
                {candidate.hex} — {candidate.description}
              </Text>
            </Flex>
          </Flex>

          <Box height="1px" backgroundColor="border.subtle" />

          <Card variant="outlined" padding="medium">
            <Flex flexDirection="column" gap="medium">
              <Text fontSize="small" fontWeight="bold" color="text.primary">
                Button piloto · hover lift + shadow
              </Text>
              <Flex gap="small" flexWrap="wrap">
                <Button variant="primary" size="medium">Primary</Button>
                <Button variant="secondary" size="medium">Secondary</Button>
                <Button variant="ghost" size="medium">Ghost</Button>
                <Button variant="danger" size="medium">Danger</Button>
              </Flex>
              <Text fontSize="xsmall" color="text.tertiary">
                Hover sobre cada botão para ver translateY(-1px) + shadow.sm e transition snap (160ms · easeOutQuart).
              </Text>
            </Flex>
          </Card>

          <Card variant="outlined" padding="medium">
            <Flex flexDirection="column" gap="medium">
              <Text fontSize="small" fontWeight="bold" color="text.primary">
                Brand swatches (papéis canônicos)
              </Text>
              <Flex gap="nano" flexWrap="wrap">
                {(['bg', 'bgSubtle', 'bgElement', 'bgElementHover', 'bgElementActive', 'borderSubtle', 'border', 'borderHover', 'solid', 'solidHover', 'text', 'textContrast'] as const).map((role) => (
                  <Flex key={role} flexDirection="column" alignItems="center" gap="nano" width="56px">
                    <Box
                      width="40px"
                      height="40px"
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
        </Flex>
      </Box>
    </ArborProvider>
  );
}

const meta = {
  title: 'Foundations/Polish v1 — Brand candidates',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Comparativo lado-a-lado dos 3 candidatos de brand default para v1 (RFC-0041). ' +
          'Default já aplicado em themeLight é Ultraviolet 70 (#6352E1, recomendação do arquiteto). ' +
          'A coluna do meio mostra exatamente o que sai como default; as outras duas mostram alternativas via createBrandPalette + createTheme. ' +
          'Aprovação final destrava PR2 (sweep coletivo dos demais ~25 componentes).',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const SideBySide: Story = {
  name: 'Comparativo dos 3 candidatos',
  render: () => (
    <Box padding="large" backgroundColor="background.subtle" minHeight="100vh">
      <Flex flexDirection="column" gap="large">
        <Flex flexDirection="column" gap="nano">
          <Text fontSize="xlarge" fontWeight="bold" color="text.primary">
            Polish v1 — escolha do brand default
          </Text>
          <Text fontSize="small" color="text.secondary">
            Mesmo Button piloto sob 3 temas. Avalia identidade, hover lift, glow no foco (Tab + Enter para inspecionar).
          </Text>
        </Flex>
        <Flex gap="large" alignItems="stretch" flexWrap="wrap">
          {candidates.map((c) => (
            <Box key={c.label} flex="1 1 320px" minWidth="320px">
              <CandidateColumn candidate={c} />
            </Box>
          ))}
        </Flex>
      </Flex>
    </Box>
  ),
};

export const UltravioletOnly: Story = {
  name: 'Ultraviolet (default) isolado',
  render: () => (
    <Box padding="large" backgroundColor="background.subtle" minHeight="100vh">
      <CandidateColumn candidate={candidates[1]} />
    </Box>
  ),
};
