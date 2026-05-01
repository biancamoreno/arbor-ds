import React, { useId, useRef, useState } from 'react';
import { transition } from '../../../ecosystem/utils/functions';
import { useFieldContext } from '../../field/context/field-context';
import { markFieldAware } from '../../field/utils/is-field-aware';
import { Box, Flex, Text, Clickable, Icon, Image } from '../../core';
import type { FileUploadProps, FileUploadTexts } from '../interfaces';

const DEFAULT_TEXTS: Required<FileUploadTexts> = {
  dropZone: 'Arraste e solte ou clique para enviar',
  sizeHint: (max) => `Máximo ${max}`,
  uploading: 'Enviando...',
  previewLabel: 'Arquivo enviado',
  removeLabel: 'Remover',
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

const FileUploadBase: React.FC<FileUploadProps> = ({
  accept = 'image/*',
  multiple = false,
  maxSize = 5 * 1024 * 1024,
  maxFiles = 5,
  dragAndDrop = true,
  loading,
  error,
  disabled,
  onFilesChange,
  previewUrl,
  onRemove,
  children,
  texts: textsProp,
}) => {
  const fieldCtx = useFieldContext();
  const autoId = useId();
  const inputId = fieldCtx?.fieldId ?? autoId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const t: Required<FileUploadTexts> = { ...DEFAULT_TEXTS, ...textsProp };
  const isDisabled = disabled ?? fieldCtx?.disabled ?? false;
  const isInvalid = !!error || !!fieldCtx?.invalid;

  const validateFiles = (files: File[]): File[] => {
    const valid = files.filter((file) => file.size <= maxSize);
    if (multiple && valid.length > maxFiles) return valid.slice(0, maxFiles);
    return valid;
  };

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    const valid = validateFiles(Array.from(list));
    if (valid.length > 0) onFilesChange?.(valid);
  };

  const handleDragOver = (event: React.DragEvent) => {
    if (isDisabled || !dragAndDrop) return;
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (event: React.DragEvent) => {
    if (isDisabled || !dragAndDrop) return;
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const handleClick = () => {
    if (!isDisabled) inputRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
  };

  const hiddenInput = (
    <Box
      as="input"
      innerRef={inputRef as React.Ref<unknown>}
      id={inputId}
      type="file"
      accept={accept}
      multiple={multiple}
      onChange={handleChange}
      disabled={isDisabled}
      aria-describedby={fieldCtx?.descriptionRegistered ? fieldCtx.descriptionId : undefined}
      aria-required={fieldCtx?.required || undefined}
      aria-invalid={fieldCtx?.invalid || undefined}
      aria-errormessage={fieldCtx?.invalid && fieldCtx?.errorRegistered ? fieldCtx.errorId : undefined}
      display="none"
    />
  );

  if (previewUrl) {
    return (
      <Flex flexDirection="column" gap="micro">
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
            <Text as="p" fontSize="small" fontWeight="medium" color="text.primary">
              {t.previewLabel}
            </Text>
          </Box>
          <Clickable
            as="button"
            type="button"
            onClick={onRemove}
            aria-label={t.removeLabel}
            paddingX="medium"
            paddingY="small"
            borderRadius="small"
            borderWidth="1px"
            borderStyle="solid"
            borderColor="feedback.critical.base"
            backgroundColor="transparent"
            color="feedback.critical.base"
            fontSize="small"
          >
            <Flex as="span" alignItems="center" gap="micro">
              <Icon name="X" size="sm" decorative />
              {t.removeLabel}
            </Flex>
          </Clickable>
        </Flex>
        {hiddenInput}
        {error && !fieldCtx && (
          <Text as="span" fontSize="xsmall" color="feedback.critical.base">
            {error}
          </Text>
        )}
      </Flex>
    );
  }

  const dropZoneBorderColor = isDragging
    ? 'brand.base'
    : isInvalid
      ? 'feedback.critical.base'
      : 'border.default';
  const dropZoneBackgroundColor = isDragging
    ? 'brand.subtle'
    : isInvalid
      ? 'feedback.critical.subtle'
      : 'background.subtle';

  return (
    <Flex flexDirection="column" gap="micro">
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="micro"
        padding="large"
        borderRadius="medium"
        borderWidth="2px"
        borderStyle="dashed"
        borderColor={dropZoneBorderColor}
        backgroundColor={dropZoneBackgroundColor}
        opacity={isDisabled ? 0.5 : 1}
        cursor={isDisabled ? 'not-allowed' : 'pointer'}
        onClick={isDisabled ? undefined : handleClick}
        {...(dragAndDrop && !isDisabled
          ? { onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop }
          : {})}
        transition={transition(['border-color', 'background-color'], 'fast')}
      >
        {children ??
          (loading ? (
            <>
              <Icon name="LoaderCircle" size="xl" color="text.secondary" decorative />
              <Text as="p" fontSize="small" color="text.secondary">
                {t.uploading}
              </Text>
            </>
          ) : (
            <>
              <Icon name="Upload" size="xl" color="text.secondary" decorative />
              <Text as="p" fontSize="small" fontWeight="semibold" color="text.primary">
                {t.dropZone}
              </Text>
              <Text as="p" fontSize="xsmall" color="text.secondary">
                {t.sizeHint(formatBytes(maxSize))}
              </Text>
            </>
          ))}
      </Flex>
      {hiddenInput}
      {error && !fieldCtx && (
        <Text as="span" fontSize="xsmall" color="feedback.critical.base">
          {error}
        </Text>
      )}
    </Flex>
  );
};

FileUploadBase.displayName = 'FileUpload';

export const FileUpload = markFieldAware(FileUploadBase);
