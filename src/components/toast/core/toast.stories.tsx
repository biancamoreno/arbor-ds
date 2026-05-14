import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex, Text } from '../../core';
import { Button } from '../../button';
import { ArborProvider } from '../../../ecosystem';
import { createTheme, themeLight } from '../../../foundations';
import { Toast, Toaster, useToast, type ToastTone, type ToastPlacement } from '../index';

const meta = {
  title: 'Feedback/Toast',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function ToastDemo({ tone, description }: { tone?: ToastTone; description?: string }) {
  const { toast } = useToast();
  return (
    <>
      <Toaster />
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            title: `Toast ${tone ?? 'neutral'}`,
            description: description ?? 'Mensagem de exemplo.',
            tone,
          })
        }
      >
        Exibir toast {tone ?? 'neutral'}
      </Button>
    </>
  );
}

export const Default: Story = {
  render: () => <ToastDemo />,
};

export const Anatomia: Story = {
  name: 'Anatomia — Root / Icon / Title / Description / Close',
  render: () => (
    <Flex flexDirection="column" gap="medium" maxWidth={420}>
      <Text variant="overline" color="text.secondary">
        Toast renderizado isoladamente (sem Toaster)
      </Text>
      <Toast tone="info">
        <Toast.Icon />
        <Flex flex={1} flexDirection="column" gap="micro">
          <Toast.Title>Título do toast</Toast.Title>
          <Toast.Description>Descrição explica o evento.</Toast.Description>
        </Flex>
        <Toast.Close onClose={() => undefined} />
      </Toast>
    </Flex>
  ),
};

function TonesDemo() {
  const { toast } = useToast();
  const tones: ToastTone[] = ['neutral', 'brand', 'info', 'success', 'warning', 'critical'];
  return (
    <>
      <Toaster />
      <Flex gap="small" flexWrap="wrap" maxWidth={520}>
        {tones.map((tone) => (
          <Button
            key={tone}
            variant="secondary"
            size="small"
            onClick={() =>
              toast({
                title: tone.charAt(0).toUpperCase() + tone.slice(1),
                description: `Toast do tipo ${tone}`,
                tone,
              })
            }
          >
            {tone}
          </Button>
        ))}
      </Flex>
    </>
  );
}

export const Tones: Story = {
  render: () => <TonesDemo />,
};

function OnlyTitleDemo() {
  const { toast } = useToast();
  return (
    <>
      <Toaster />
      <Button variant="secondary" onClick={() => toast({ title: 'Salvo com sucesso', tone: 'success' })}>
        Disparar toast só com título
      </Button>
    </>
  );
}

export const OnlyTitle: Story = {
  name: 'Só título — sem description',
  render: () => <OnlyTitleDemo />,
};

export const LongMessage: Story = {
  render: () => (
    <ToastDemo
      tone="critical"
      description="Não foi possível salvar este registro porque o servidor retornou erro 502. Verifique sua conexão e tente novamente. Se o erro persistir, contate o suporte com o ID da transação 7b3e9-aa12-002f."
    />
  ),
};

function PersistentDemo() {
  const { toast } = useToast();
  return (
    <>
      <Toaster />
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            title: 'Atualização disponível',
            description: 'Permanece até dispensar.',
            tone: 'brand',
            duration: 0,
          })
        }
      >
        Disparar toast persistente
      </Button>
    </>
  );
}

export const Persistent: Story = {
  name: 'Persistente — duration=0',
  render: () => <PersistentDemo />,
};

function PlacementsDemo() {
  const { toast } = useToast();
  const placements: ToastPlacement[] = [
    'top-left', 'top-center', 'top-right',
    'bottom-left', 'bottom-center', 'bottom-right',
  ];
  return (
    <Flex flexDirection="column" gap="medium" maxWidth={520}>
      {placements.map((placement) => (
        <Flex key={placement} alignItems="center" gap="small">
          <Toaster placement={placement} />
          <Text variant="caption" color="text.secondary" width={140}>
            {placement}
          </Text>
          <Button
            size="small"
            variant="secondary"
            onClick={() =>
              toast({ title: placement, description: `placement=${placement}`, tone: 'info', duration: 3000 })
            }
          >
            Disparar
          </Button>
        </Flex>
      ))}
    </Flex>
  );
}

export const Placements: Story = {
  name: 'Placements (6 posições)',
  render: () => <PlacementsDemo />,
};

const themedToast = createTheme(themeLight, {
  components: {
    toast: {
      borderRadius: 'medium',
      colors: {
        success: {
          background: 'brand.bgSubtle',
          borderColor: 'brand.solid',
          icon: 'brand.solid',
          title: 'brand.text',
          description: 'brand.text',
          closeHover: 'brand.bgElementHover',
        },
      },
    },
  },
});

export const Theming: Story = {
  name: 'Theming — override de components.toast.colors',
  render: () => (
    <ArborProvider theme={themedToast}>
      <Flex flexDirection="column" gap="medium" maxWidth={520}>
        <Text variant="overline" color="text.secondary">
          Tone success repintado via tokens.components.toast.colors.success + borderRadius medium
        </Text>
        <Toast tone="success">
          <Toast.Icon />
          <Flex flex={1} flexDirection="column" gap="micro">
            <Toast.Title>Brand-tinted success</Toast.Title>
            <Toast.Description>Cores derivam de createTheme override.</Toast.Description>
          </Flex>
          <Toast.Close onClose={() => undefined} />
        </Toast>
      </Flex>
    </ArborProvider>
  ),
};
