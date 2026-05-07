import React from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { Box, Flex, Text, Clickable, Icon, Image } from '../../core';
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

const FileUploadNativeBase: React.FC<FileUploadProps> = ({
  loading,
  previewUrl,
  onRemove,
  children,
  texts: textsProp,
}) => {
  const theme = useTheme();
  const iconColor = theme.colors.text.secondary;
  const criticalColor = theme.colors.feedback.critical.solid;
  const t: Required<FileUploadTexts> = { ...DEFAULT_TEXTS, ...textsProp };

  if (previewUrl) {
    return (
      <Flex
        alignItems="center"
        gap="small"
        padding="medium"
        borderRadius="medium"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="border.default"
      >
        <Box borderRadius="small" overflow="hidden" width="80px" height="80px" flexShrink={0}>
          <Image
            mode="img"
            source={previewUrl}
            alt={t.previewLabel}
            width="80px"
            height="80px"
            resizeMode="cover"
          />
        </Box>
        <Box flex={1}>
          <Text fontSize="small" fontWeight="medium" color="text.primary">
            {t.previewLabel}
          </Text>
        </Box>
        <Clickable
          onClick={onRemove}
          accessibilityRole="button"
          accessibilityLabel={t.removeLabel}
          paddingX="medium"
          paddingY="small"
          borderRadius="small"
          borderWidth="1px"
          borderStyle="solid"
          borderColor="feedback.critical.solid"
          backgroundColor="transparent"
          color="feedback.critical.solid"
          fontSize="small"
        >
          <Flex alignItems="center" gap="micro">
            <Icon name="X" size="small" color={criticalColor} decorative />
            <Text fontSize="small" color="feedback.critical.solid">
              {t.removeLabel}
            </Text>
          </Flex>
        </Clickable>
      </Flex>
    );
  }

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap="micro"
      padding="large"
      borderRadius="medium"
      borderWidth="2px"
      borderStyle="dashed"
      borderColor="border.default"
      backgroundColor="background.subtle"
      accessibilityRole="text"
      accessibilityLabel={t.dropZone}
    >
      {children ??
        (loading ? (
          <>
            <Icon name="LoaderCircle" size="xlarge" color={iconColor} decorative />
            <Text fontSize="small" color="text.secondary">
              {t.uploading}
            </Text>
          </>
        ) : (
          <>
            <Icon name="Upload" size="xlarge" color={iconColor} decorative />
            <Text fontSize="small" color="text.secondary">
              {t.dropZone}
            </Text>
          </>
        ))}
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
 * TD-025: se 3+ produtos consumidores pedirem implementação real, promover
 * para caminho (a) com `expo-document-picker` peerDep.
 *
 * @see {@link FileUploadProps}
 */
export const FileUpload = markFieldAware(FileUploadNativeBase);
