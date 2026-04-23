import React, { useState, useRef } from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { Box, Flex, Text, Clickable } from '../../core';
import type { FileUploadProps } from '../interfaces';

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept = 'image/*',
  multiple = false,
  maxSize = 5 * 1024 * 1024,
  maxFiles = 5,
  onFileSelect,
  preview = true,
  previewUrl,
  error,
  disabled,
  loading,
  dragAndDrop = true,
  onRemove,
}) => {
  const theme = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const validateFiles = (files: File[]): { valid: File[]; errors: string[] } => {
    const errors: string[] = [];
    const valid: File[] = [];

    files.forEach((file) => {
      if (file.size > maxSize) {
        errors.push(`${file.name} is too large (max ${formatFileSize(maxSize)})`);
      } else {
        valid.push(file);
      }
    });

    if (valid.length > maxFiles && multiple) {
      errors.push(`Maximum ${maxFiles} files allowed`);
      return { valid: valid.slice(0, maxFiles), errors };
    }

    return { valid, errors };
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    const { valid } = validateFiles(fileArray);
    if (valid.length > 0) onFileSelect?.(valid);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (disabled || !dragAndDrop) return;
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    if (disabled || !dragAndDrop) return;
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  return (
    <Flex flexDirection="column" gap="micro">
      {label && (
        <Box
          as="label"
          fontSize="xsmall"
          fontWeight="semibold"
          color={error ? 'feedback.critical.base' : 'text.primary'}
        >
          {label}
        </Box>
      )}

      {previewUrl && preview ? (
        <Flex
          alignItems="center"
          gap="small"
          borderRadius="medium"
          borderWidth={1}
          borderStyle="solid"
          borderColor="border.default"
          style={{ padding: '1rem' }}
        >
          <Box
            as="img"
            src={previewUrl}
            alt="Preview"
            borderRadius="small"
            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
          />
          <Box flex={1}>
            <Text as="p" fontSize="small" fontWeight="medium" color="text.primary" style={{ margin: 0 }}>
              File uploaded
            </Text>
          </Box>
          <Clickable
            as="button"
            type="button"
            onClick={onRemove}
            borderRadius="small"
            fontSize="small"
            backgroundColor="transparent"
            color="feedback.critical.base"
            borderWidth={1}
            borderStyle="solid"
            borderColor="feedback.critical.base"
            cursor="pointer"
            style={{ padding: '0.5rem 1rem' }}
          >
            Remove
          </Clickable>
        </Flex>
      ) : (
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap="micro"
          borderRadius="medium"
          opacity={disabled ? 0.5 : 1}
          cursor={disabled ? 'not-allowed' : 'pointer'}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${isDragging ? theme.colors.brand.base : error ? theme.colors.feedback.critical.base : theme.colors.border.default}`,
            padding: '2rem',
            backgroundColor: isDragging
              ? theme.colors.brand.subtle
              : error
              ? theme.colors.feedback.critical.subtle
              : theme.colors.background.subtle,
            transition: 'all 0.2s',
          }}
        >
          {loading ? (
            <>
              <Box as="span" style={{ fontSize: '2rem' }}>⏳</Box>
              <Text as="p" fontSize="small" color="text.secondary" style={{ margin: 0 }}>
                Uploading...
              </Text>
            </>
          ) : (
            <>
              <Box as="span" style={{ fontSize: '2rem' }}>📤</Box>
              <Text as="p" fontSize="small" fontWeight="semibold" color="text.primary" style={{ margin: 0 }}>
                Drag and drop or click to upload
              </Text>
              <Text as="p" fontSize="xsmall" color="text.secondary" style={{ margin: 0 }}>
                Maximum {formatFileSize(maxSize)}
              </Text>
            </>
          )}
        </Flex>
      )}

      <Box
        as="input"
        innerRef={fileInputRef as React.Ref<unknown>}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        disabled={disabled}
        display="none"
      />

      {error && (
        <Text as="span" fontSize="xsmall" color="feedback.critical.base">
          {error}
        </Text>
      )}
    </Flex>
  );
};

FileUpload.displayName = 'FileUpload';
export default FileUpload;
