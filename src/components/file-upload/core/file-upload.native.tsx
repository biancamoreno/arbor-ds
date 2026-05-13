import React from 'react';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { Box, Flex, Text, Icon, Image } from '../../core';
import { Button } from '../../button';
import { markFieldAware } from '../../field/utils/is-field-aware';
import type { FileUploadProps, FileUploadTexts } from '../interfaces';

const DEFAULT_TEXTS: Required<FileUploadTexts> = {
  dropZone:
    'Upload de arquivos requer integração nativa específica (expo-document-picker, expo-image-picker, expo-camera). Veja docs do Arbor-DS.',
  sizeHint: (max) => `Máximo ${max}`,
  uploading: 'Enviando...',
  previewLabel: 'Arquivo enviado',
  removeLabel: 'Remover',
};

type FileUploadSlots =
  | 'root'
  | 'dropZone'
  | 'idleIcon'
  | 'idleTitle'
  | 'idleHint'
  | 'previewFrame'
  | 'previewThumbnail'
  | 'previewLabel';

const FileUploadNativeBase: React.FC<FileUploadProps> = ({
  loading,
  disabled,
  previewUrl,
  onRemove,
  children,
  texts: textsProp,
}) => {
  const t: Required<FileUploadTexts> = { ...DEFAULT_TEXTS, ...textsProp };
  const state = disabled ? 'disabled' : 'idle';
  const slots = useSlotRecipe<FileUploadSlots>('fileUpload', { state });

  if (previewUrl) {
    return (
      <Flex {...slots.root}>
        <Flex {...slots.previewFrame}>
          <Box {...slots.previewThumbnail}>
            <Image
              mode="img"
              source={previewUrl}
              alt={t.previewLabel}
              width="100%"
              height="100%"
              resizeMode="cover"
            />
          </Box>
          <Box flex={1}>
            <Text variant="label" {...slots.previewLabel}>
              {t.previewLabel}
            </Text>
          </Box>
          <Button
            variant="danger"
            size="small"
            onClick={onRemove}
            accessibilityLabel={t.removeLabel}
          >
            <Flex alignItems="center" gap="micro">
              <Icon name="X" size="small" decorative />
              <Text variant="bodySmall" color="text.inverse">
                {t.removeLabel}
              </Text>
            </Flex>
          </Button>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex {...slots.root}>
      <Flex
        {...slots.dropZone}
        accessibilityRole="text"
        accessibilityLabel={t.dropZone}
      >
        {children ??
          (loading ? (
            <>
              <Box {...slots.idleIcon}>
                <Icon name="LoaderCircle" size="xlarge" decorative />
              </Box>
              <Text variant="bodySmall" {...slots.idleHint}>
                {t.uploading}
              </Text>
            </>
          ) : (
            <>
              <Box {...slots.idleIcon}>
                <Icon name="Upload" size="xlarge" decorative />
              </Box>
              <Text variant="bodySmall" {...slots.idleHint}>
                {t.dropZone}
              </Text>
            </>
          ))}
      </Flex>
    </Flex>
  );
};

FileUploadNativeBase.displayName = 'FileUpload';

/**
 * @platform native
 *
 * `FileUpload` em React Native — placeholder informativo (RFC-0026, caminho c).
 * Não captura toque nem abre picker: a escolha de lib
 * (`expo-document-picker`, `expo-image-picker`, `expo-camera`, `expo-av`) fica
 * por conta do consumidor. O slot `children` permite substituir o conteúdo
 * inteiro da drop zone para encaixar a integração de picker preferida sem
 * perder o frame visual paritário com o web. Quando `previewUrl` é fornecido,
 * renderiza preview + remove normalmente (independem de picker).
 *
 * Anatomia (cores, espaços, raios) resolvida pela slot recipe `fileUpload`;
 * override via `createTheme`.
 *
 * TD-025: se 3+ produtos consumidores pedirem implementação real, promover
 * para caminho (a) com `expo-document-picker` peerDep.
 *
 * @see {@link FileUploadProps}
 */
export const FileUpload = markFieldAware(FileUploadNativeBase);
