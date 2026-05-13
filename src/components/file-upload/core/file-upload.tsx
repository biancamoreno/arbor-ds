import React, { useId, useRef, useState } from 'react';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { useFieldContext } from '../../field/context/field-context';
import { markFieldAware } from '../../field/utils/is-field-aware';
import { Box, Flex, Text, Icon, Image } from '../../core';
import { Button } from '../../button';
import type { FileUploadProps, FileUploadTexts } from '../interfaces';

const DEFAULT_TEXTS: Required<FileUploadTexts> = {
  dropZone: 'Arraste e solte ou clique para enviar',
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

type FileUploadState = 'idle' | 'dragging' | 'invalid' | 'disabled';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

const visuallyHiddenInputStyle: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  border: 0,
};

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

  const state: FileUploadState = isDisabled
    ? 'disabled'
    : isDragging
      ? 'dragging'
      : isInvalid
        ? 'invalid'
        : 'idle';

  const slots = useSlotRecipe<FileUploadSlots>('fileUpload', { state });

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
  };

  const handleClick = () => {
    if (!isDisabled) inputRef.current?.click();
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
      style={visuallyHiddenInputStyle}
    />
  );

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
          <Button variant="danger" size="small" onClick={onRemove} aria-label={t.removeLabel}>
            <Flex as="span" alignItems="center" gap="micro">
              <Icon name="X" size="small" decorative />
              {t.removeLabel}
            </Flex>
          </Button>
        </Flex>
        {hiddenInput}
        {error && !fieldCtx && (
          <Text as="span" variant="caption" color="feedback.critical.solid">
            {error}
          </Text>
        )}
      </Flex>
    );
  }

  const dragProps =
    dragAndDrop && !isDisabled
      ? { onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop }
      : {};

  return (
    <Flex {...slots.root}>
      <Box
        as="button"
        type="button"
        disabled={isDisabled}
        aria-controls={inputId}
        onClick={handleClick}
        {...slots.dropZone}
        {...dragProps}
      >
        {hiddenInput}
        {children ??
          (loading ? (
            <>
              <Box as="span" {...slots.idleIcon}>
                <Icon name="LoaderCircle" size="xlarge" decorative />
              </Box>
              <Text as="p" variant="bodySmall" {...slots.idleHint}>
                {t.uploading}
              </Text>
            </>
          ) : (
            <>
              <Box as="span" {...slots.idleIcon}>
                <Icon name="Upload" size="xlarge" decorative />
              </Box>
              <Text as="p" variant="label" {...slots.idleTitle}>
                {t.dropZone}
              </Text>
              <Text as="p" variant="caption" {...slots.idleHint}>
                {t.sizeHint(formatBytes(maxSize))}
              </Text>
            </>
          ))}
      </Box>
      {error && !fieldCtx && (
        <Text as="span" variant="caption" color="feedback.critical.solid">
          {error}
        </Text>
      )}
    </Flex>
  );
};

FileUploadBase.displayName = 'FileUpload';

/**
 * @platform shared
 *
 * Componente de upload de arquivo Field-aware (RFC-0026). Web combina
 * `<input type="file">` visually-hidden com dropzone como `<label>`
 * (Enter/Space e clique acionam o picker por construção, foco visível premium
 * via `_focusVisibleWithin` na recipe). Drag-and-drop (`dragAndDrop`, default
 * `true`), preview de imagem quando `previewUrl` existe e fallback de loading.
 * Validações de cliente: `accept` (MIME), `maxSize` (bytes, default 5 MB),
 * `maxFiles` (default `5`, requer `multiple`). Textos podem ser customizados
 * via `texts` (parcial — aplica defaults aos não fornecidos).
 *
 * Anatomia (cores, espaços, raios, foco) resolvida pela slot recipe
 * `fileUpload`; override completo via `createTheme({ recipes: { fileUpload: ... },
 * components: { fileUpload: ... } })`.
 *
 * @see {@link FileUploadProps}
 */
export const FileUpload = markFieldAware(FileUploadBase);
