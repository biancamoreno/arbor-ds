import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from './accordion';
import { Box, Flex, Icon, Text } from '../../core';
import { ArborProvider } from '../../../ecosystem';
import { createTheme, themeLight } from '../../../foundations';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    type: { control: { type: 'select' }, options: ['single', 'multiple'] },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj;

const FAQ_ITEMS = [
  {
    value: 'cancel',
    question: 'Como cancelar minha assinatura?',
    answer:
      'Acesse Configurações → Plano → Cancelar. O acesso permanece ativo até o fim do ciclo atual; nenhuma cobrança futura será gerada.',
  },
  {
    value: 'install',
    question: 'Como instalar o Arbor DS?',
    answer:
      'Adicione o pacote ao seu projeto com o gerenciador de sua preferência (pnpm, npm ou yarn) e envolva sua aplicação com ArborProvider.',
  },
  {
    value: 'native',
    question: 'Funciona em React Native?',
    answer:
      'Sim — componentes marcados como cross-platform rodam em web e mobile com a mesma API pública. Tipografia, cores e estados convergem via tema único.',
  },
];

/** FAQ canônico: single + collapsible default (clicar no item ativo o fecha). */
export const Default: Story = {
  render: () => (
    <Box width="400px">
      <Accordion>
        {FAQ_ITEMS.map((item) => (
          <Accordion.Item key={item.value} value={item.value}>
            <Accordion.Trigger>{item.question}</Accordion.Trigger>
            <Accordion.Content>
              <Text variant="bodyMedium" color="text.secondary">{item.answer}</Text>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion>
    </Box>
  ),
};

/**
 * Anatomia: cada `Accordion.Item` carrega `Trigger` + `Content`. Estado `open`
 * pinta o trigger com `brand.solid` (cor do chevron acompanha). Item desabilitado
 * recebe `opacity.disabled` da recipe. Touch target garantido em 44 px.
 */
export const Anatomia: Story = {
  render: () => (
    <Flex flexDirection="column" gap="medium" width="400px">
      <Text variant="overline" color="text.secondary">Padrão (fechado)</Text>
      <Accordion>
        <Accordion.Item value="a">
          <Accordion.Trigger>Trigger no estado padrão</Accordion.Trigger>
          <Accordion.Content>
            <Text variant="bodyMedium" color="text.secondary">Body do item.</Text>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>

      <Text variant="overline" color="text.secondary">Aberto (state.open)</Text>
      <Accordion defaultValue="a">
        <Accordion.Item value="a">
          <Accordion.Trigger>Trigger aberto — cor brand.solid</Accordion.Trigger>
          <Accordion.Content>
            <Text variant="bodyMedium" color="text.secondary">Conteúdo visível.</Text>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>

      <Text variant="overline" color="text.secondary">Desabilitado (opacity.disabled)</Text>
      <Accordion>
        <Accordion.Item value="a" disabled>
          <Accordion.Trigger>Trigger desabilitado</Accordion.Trigger>
          <Accordion.Content>
            <Text variant="bodyMedium" color="text.secondary">Não acessível.</Text>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </Flex>
  ),
};

/** Single vs Multiple lado a lado. */
export const SingleVsMultiple: Story = {
  render: () => (
    <Flex gap="large">
      <Flex flexDirection="column" gap="small" width="320px">
        <Text variant="overline" color="text.secondary">type=&quot;single&quot;</Text>
        <Accordion type="single">
          {FAQ_ITEMS.slice(0, 3).map((item) => (
            <Accordion.Item key={item.value} value={item.value}>
              <Accordion.Trigger>{item.question}</Accordion.Trigger>
              <Accordion.Content>
                <Text variant="bodyMedium" color="text.secondary">{item.answer}</Text>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion>
      </Flex>
      <Flex flexDirection="column" gap="small" width="320px">
        <Text variant="overline" color="text.secondary">type=&quot;multiple&quot;</Text>
        <Accordion type="multiple" defaultValue={['cancel', 'native']}>
          {FAQ_ITEMS.slice(0, 3).map((item) => (
            <Accordion.Item key={item.value} value={item.value}>
              <Accordion.Trigger>{item.question}</Accordion.Trigger>
              <Accordion.Content>
                <Text variant="bodyMedium" color="text.secondary">{item.answer}</Text>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion>
      </Flex>
    </Flex>
  ),
};

/** `defaultValue` abre item inicialmente. */
export const DefaultValueOpen: Story = {
  render: () => (
    <Box width="400px">
      <Accordion defaultValue="install">
        {FAQ_ITEMS.map((item) => (
          <Accordion.Item key={item.value} value={item.value}>
            <Accordion.Trigger>{item.question}</Accordion.Trigger>
            <Accordion.Content>
              <Text variant="bodyMedium" color="text.secondary">{item.answer}</Text>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion>
    </Box>
  ),
};

/** `collapsible={false}` impede fechar o item ativo (sempre haverá 1 aberto). */
export const CollapsibleFalse: Story = {
  render: () => (
    <Box width="400px">
      <Accordion type="single" collapsible={false} defaultValue="cancel">
        {FAQ_ITEMS.map((item) => (
          <Accordion.Item key={item.value} value={item.value}>
            <Accordion.Trigger>{item.question}</Accordion.Trigger>
            <Accordion.Content>
              <Text variant="bodyMedium" color="text.secondary">{item.answer}</Text>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion>
    </Box>
  ),
};

/** Item desabilitado: cursor + `aria-disabled` + opacidade reduzida via recipe. */
export const DisabledItem: Story = {
  render: () => (
    <Box width="400px">
      <Accordion>
        <Accordion.Item value="ok">
          <Accordion.Trigger>Item normal</Accordion.Trigger>
          <Accordion.Content>
            <Text variant="bodyMedium" color="text.secondary">Conteúdo acessível.</Text>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="disabled" disabled>
          <Accordion.Trigger>Item desabilitado</Accordion.Trigger>
          <Accordion.Content>
            <Text variant="bodyMedium" color="text.secondary">Não toggla.</Text>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="other">
          <Accordion.Trigger>Outro item normal</Accordion.Trigger>
          <Accordion.Content>
            <Text variant="bodyMedium" color="text.secondary">Acessível.</Text>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </Box>
  ),
};

/** Content aceita árvore rica — composição livre via Text/Box/etc do DS. */
export const LongContent: Story = {
  render: () => (
    <Box width="480px">
      <Accordion defaultValue="terms">
        <Accordion.Item value="terms">
          <Accordion.Trigger>Termos de serviço — versão completa</Accordion.Trigger>
          <Accordion.Content>
            <Flex flexDirection="column" gap="small">
              <Text variant="bodyMedium">
                Ao utilizar este serviço, você concorda com os termos abaixo. Leia com atenção.
              </Text>
              <Text variant="bodyMedium" color="text.secondary">
                A plataforma oferece-se &quot;como está&quot;, sem garantia de disponibilidade contínua.
                Mudanças relevantes são comunicadas com 30 dias de antecedência.
              </Text>
              <Text variant="bodyMedium" color="text.secondary">
                Dados pessoais são tratados conforme nossa política de privacidade. Você pode
                solicitar exportação ou exclusão a qualquer momento.
              </Text>
              <Text variant="caption" color="text.tertiary">Última atualização: 2026-05-14.</Text>
            </Flex>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="privacy">
          <Accordion.Trigger>Política de privacidade</Accordion.Trigger>
          <Accordion.Content>
            <Text variant="bodyMedium" color="text.secondary">
              Coletamos apenas o necessário para operar o serviço. Nenhum dado é vendido a terceiros.
            </Text>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </Box>
  ),
};

/**
 * `startIcon` opcional à esquerda do label. Cross-platform via `<Icon name="..." />`.
 * Ícone segue a cor do trigger (incluindo o estado aberto em `brand.solid`).
 */
const ICONIC_ITEMS = [
  { value: 'billing', icon: 'CreditCard' as const, q: 'Cobrança e faturamento', a: 'Cobramos mensalmente no dia da assinatura. Você pode atualizar o método de pagamento a qualquer momento.' },
  { value: 'security', icon: 'Lock' as const, q: 'Segurança e privacidade', a: 'Todos os dados trafegam por TLS 1.3 e ficam criptografados em repouso. Conformidade LGPD/SOC 2.' },
  { value: 'support', icon: 'CircleHelp' as const, q: 'Suporte e SLA', a: 'Suporte 24/7 via chat com tempo médio de resposta de 8 minutos no plano Pro.' },
];

export const WithStartIcon: Story = {
  render: () => (
    <Box width="440px">
      <Accordion defaultValue="security">
        {ICONIC_ITEMS.map((item) => (
          <Accordion.Item key={item.value} value={item.value}>
            <Accordion.Trigger startIcon={<Icon name={item.icon} size="medium" decorative />}>
              {item.q}
            </Accordion.Trigger>
            <Accordion.Content>
              <Text variant="bodyMedium" color="text.secondary">{item.a}</Text>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion>
    </Box>
  ),
};

/**
 * Theming: override via `createTheme` em `components.accordion`. Aqui o hover
 * do trigger ganha tom subtle do brand e o divisor entre items fica em
 * `brand.bgElement`.
 */
const brandAccent = createTheme(themeLight, {
  components: {
    accordion: {
      divider: 'brand.bgElement',
      trigger: {
        colors: {
          text: 'text.primary',
          hover: 'brand.bgElement',
          disabled: 'text.disabled',
        },
      },
    },
  },
});

export const Theming: Story = {
  render: () => (
    <Flex flexDirection="column" gap="medium" width="400px">
      <Text variant="overline" color="text.secondary">themeLight padrão</Text>
      <Accordion defaultValue="native">
        {FAQ_ITEMS.map((item) => (
          <Accordion.Item key={item.value} value={item.value}>
            <Accordion.Trigger>{item.question}</Accordion.Trigger>
            <Accordion.Content>
              <Text variant="bodyMedium" color="text.secondary">{item.answer}</Text>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion>

      <Text variant="overline" color="text.secondary">
        brandAccent — override de components.accordion
      </Text>
      <ArborProvider theme={brandAccent}>
        <Accordion defaultValue="native">
          {FAQ_ITEMS.map((item) => (
            <Accordion.Item key={item.value} value={item.value}>
              <Accordion.Trigger>{item.question}</Accordion.Trigger>
              <Accordion.Content>
                <Text variant="bodyMedium" color="text.secondary">{item.answer}</Text>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion>
      </ArborProvider>
    </Flex>
  ),
};
