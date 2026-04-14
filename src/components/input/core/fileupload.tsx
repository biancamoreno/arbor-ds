import React, { useState, useRef } from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
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

    if (valid.length > 0) {
      onFileSelect?.(valid);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (disabled || !dragAndDrop) return;
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (disabled || !dragAndDrop) return;
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {label && (
        <label
          style={{
            fontSize: theme.fontSizes.xsmall,
            fontWeight: 600,
            color: error ? theme.colors.error : theme.colors.gray900,
          }}
        >
          {label}
        </label>
      )}

      {previewUrl && preview ? (
        <div
          style={{
            border: `1px solid ${theme.colors.gray300}`,
            borderRadius: theme.radii.medium,
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: theme.radii.small,
              objectFit: 'cover',
            }}
          />
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: theme.fontSizes.small,
                fontWeight: 500,
                color: theme.colors.gray900,
                margin: 0,
              }}
            >
              File uploaded
            </p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            style={{
              padding: '0.5rem 1rem',
              border: `1px solid ${theme.colors.error}`,
              borderRadius: theme.radii.small,
              backgroundColor: 'transparent',
              color: theme.colors.error,
              cursor: 'pointer',
              fontSize: theme.fontSizes.small,
            }}
          >
            Remove
          </button>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${isDragging ? theme.colors.brand.base : error ? theme.colors.error : theme.colors.gray300}`,
            borderRadius: theme.radii.medium,
            padding: '2rem',
            backgroundColor: isDragging
              ? theme.colors.brand.base + '20'
              : error
              ? theme.colors.error + '20'
              : theme.colors.gray100,
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s',
          }}
        >
          {loading ? (
            <>
              <span style={{ fontSize: '2rem' }}>⏳</span>
              <p style={{ fontSize: theme.fontSizes.small, color: theme.colors.gray700 }}>
                Uploading...
              </p>
            </>
          ) : (
            <>
              <span style={{ fontSize: '2rem' }}>📤</span>
              <p
                style={{
                  fontSize: theme.fontSizes.small,
                  fontWeight: 600,
                  color: theme.colors.gray900,
                  margin: 0,
                }}
              >
                Drag and drop or click to upload
              </p>
              <p
                style={{
                  fontSize: theme.fontSizes.xsmall,
                  color: theme.colors.gray600,
                  margin: 0,
                }}
              >
                Maximum {formatFileSize(maxSize)}
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        disabled={disabled}
        style={{ display: 'none' }}
      />

      {error && (
        <span
          style={{
            fontSize: theme.fontSizes.xsmall,
            color: theme.colors.error,
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
};

FileUpload.displayName = 'FileUpload';
export default FileUpload;
