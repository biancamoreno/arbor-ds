import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Box, Flex, Text, Icon } from '../../core';
import { Field } from '../../field';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { FileUpload } from './file-upload';

const meta = {
  title: 'Form/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    multiple: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    dragAndDrop: { control: 'boolean' },
  },
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <Box width="100%" maxWidth="md">{children}</Box>
);

export const Default: Story = {
  render: () => (
    <Frame>
      <FileUpload onFilesChange={(files) => console.log('files', files)} />
    </Frame>
  ),
};

export const States: Story = {
  name: 'Anatomia — estados (idle / invalid / disabled / loading)',
  render: () => (
    <Flex flexDirection="column" gap="large" maxWidth="md">
      <Text variant="overline" color="text.tertiary">
        Cada estado vem da axis `state` da slot recipe `fileUpload`. Override
        de cor/borda/bg propaga via `createTheme`.
      </Text>
      <Box>
        <Text variant="label" marginBottom="micro">idle</Text>
        <FileUpload />
      </Box>
      <Box>
        <Text variant="label" marginBottom="micro">invalid (error)</Text>
        <FileUpload error="Selecione um arquivo válido." />
      </Box>
      <Box>
        <Text variant="label" marginBottom="micro">disabled</Text>
        <FileUpload disabled />
      </Box>
      <Box>
        <Text variant="label" marginBottom="micro">loading</Text>
        <FileUpload loading />
      </Box>
    </Flex>
  ),
};

export const Multiple: Story = {
  name: 'Múltiplos arquivos (limite via maxFiles)',
  render: () => (
    <Frame>
      <FileUpload multiple maxFiles={3} onFilesChange={(files) => console.log(files)} />
    </Frame>
  ),
};

function WithPreviewExample() {
  const [url, setUrl] = useState<string | undefined>(
    'https://picsum.photos/seed/arbor/240/240',
  );
  return (
    <Frame>
      <FileUpload
        previewUrl={url}
        onRemove={() => setUrl(undefined)}
        onFilesChange={(files) => {
          const [file] = files;
          if (file) setUrl(URL.createObjectURL(file));
        }}
      />
    </Frame>
  );
}

export const WithPreview: Story = {
  name: 'Preview do arquivo enviado + Remover (Button danger)',
  render: () => <WithPreviewExample />,
};

export const WithFieldContext: Story = {
  name: 'Integração com Field (aria + invalid propaga)',
  render: () => (
    <Frame>
      <Field id="avatar" required invalid>
        <Field.Label>Avatar</Field.Label>
        <Field.Description>JPG ou PNG até 5 MB.</Field.Description>
        <Field.Control>
          <FileUpload accept="image/png,image/jpeg" />
        </Field.Control>
        <Field.Error>Selecione um arquivo válido.</Field.Error>
      </Field>
    </Frame>
  ),
};

export const CustomTexts: Story = {
  name: 'i18n leve via prop `texts`',
  render: () => (
    <Frame>
      <FileUpload
        texts={{
          dropZone: 'Drop a file or click to browse',
          sizeHint: (max) => `Up to ${max}`,
          uploading: 'Uploading...',
          previewLabel: 'File uploaded',
          removeLabel: 'Remove',
        }}
      />
    </Frame>
  ),
};

export const CustomDropZone: Story = {
  name: 'Slot `children` — conteúdo customizado da drop zone',
  render: () => (
    <Frame>
      <FileUpload>
        <Flex flexDirection="column" alignItems="center" gap="micro">
          <Icon name="FileImage" size="xlarge" decorative />
          <Text variant="label" color="text.primary">
            Solte sua foto de perfil aqui
          </Text>
          <Text variant="caption" color="text.secondary">
            Recomendado 400×400 px
          </Text>
        </Flex>
      </FileUpload>
    </Frame>
  ),
};

const brandedTheme = createTheme(themeLight, {
  components: {
    fileUpload: {
      borderRadius: 'large',
      colors: {
        dropZone: {
          background: { idle: 'brand.bgSubtle', dragging: 'brand.bgElement' },
          border: { idle: 'brand.solid' },
          title: 'brand.text',
          hint: 'text.secondary',
          icon: 'brand.solid',
        },
      },
    },
  },
});

export const Theming: Story = {
  name: 'Theming — override de tokens propagam para a recipe',
  render: () => (
    <ArborProvider theme={brandedTheme}>
      <Frame>
        <Text variant="overline" color="text.tertiary" marginBottom="micro">
          override em `components.fileUpload.colors.dropZone.*` + `borderRadius`
        </Text>
        <FileUpload />
      </Frame>
    </ArborProvider>
  ),
};
