import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Box, Flex, Text, Icon } from '../../core';
import { Field } from '../../field';
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
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Box width="420px">
      <FileUpload onFilesChange={(files) => console.log('files', files)} />
    </Box>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Box width="420px">
      <FileUpload multiple maxFiles={3} onFilesChange={(files) => console.log(files)} />
    </Box>
  ),
};

function WithPreviewExample() {
  const [url, setUrl] = useState<string | undefined>(
    'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=160',
  );
  return (
    <Box width="420px">
      <FileUpload
        previewUrl={url}
        onRemove={() => setUrl(undefined)}
        onFilesChange={(files) => {
          const [file] = files;
          if (file) setUrl(URL.createObjectURL(file));
        }}
      />
    </Box>
  );
}

export const WithPreview: Story = {
  render: () => <WithPreviewExample />,
};

export const Disabled: Story = {
  render: () => (
    <Box width="420px">
      <FileUpload disabled />
    </Box>
  ),
};

export const Loading: Story = {
  render: () => (
    <Box width="420px">
      <FileUpload loading />
    </Box>
  ),
};

export const WithError: Story = {
  render: () => (
    <Box width="420px">
      <FileUpload error="Arquivo inválido. Tente outro formato." />
    </Box>
  ),
};

export const WithFieldContext: Story = {
  render: () => (
    <Box width="420px">
      <Field id="avatar" required invalid>
        <Field.Label>Avatar</Field.Label>
        <Field.Description>JPG ou PNG até 5 MB.</Field.Description>
        <Field.Control>
          <FileUpload accept="image/png,image/jpeg" />
        </Field.Control>
        <Field.Error>Selecione um arquivo válido.</Field.Error>
      </Field>
    </Box>
  ),
};

export const CustomTexts: Story = {
  render: () => (
    <Box width="420px">
      <FileUpload
        texts={{
          dropZone: 'Drop a file or click to browse',
          sizeHint: (max) => `Up to ${max}`,
          uploading: 'Uploading...',
          previewLabel: 'File uploaded',
          removeLabel: 'Remove',
        }}
      />
    </Box>
  ),
};

export const CustomDropZone: Story = {
  render: () => (
    <Box width="420px">
      <FileUpload>
        <Flex flexDirection="column" alignItems="center" gap="micro">
          <Icon name="FileImage" size="xlarge" color="brand.solid" decorative />
          <Text as="p" fontSize="small" fontWeight="semibold" color="text.primary">
            Solte sua foto de perfil aqui
          </Text>
          <Text as="p" fontSize="xsmall" color="text.secondary">
            Recomendado 400x400 px
          </Text>
        </Flex>
      </FileUpload>
    </Box>
  ),
};
