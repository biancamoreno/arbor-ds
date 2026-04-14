import React from 'react';
import type { ChangeEvent } from 'react';
import { TextInput } from '../../../components/input/core/textinput';
import { Select } from '../../../components/input/core/select';
import { FileUpload } from '../../../components/input/core/fileupload';
import { ColorSelector } from '../../color-selector';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import type { CustomizationOption } from '../interfaces';

interface CustomizationFieldProps {
  option: CustomizationOption;
  value: any;
  error?: string;
  onChange: (value: any) => void;
}

export const CustomizationField: React.FC<CustomizationFieldProps> = ({
  option,
  value,
  error,
  onChange,
}) => {
  const theme = useTheme();

  const handleChange = (newValue: any) => {
    onChange(newValue);
  };

  const renderField = () => {
    switch (option.type) {
      case 'color':
        return (
          <ColorSelector
            colors={option.options?.map(opt => ({ value: opt.value, label: opt.label })) || []}
            value={value}
            onChange={handleChange}
          />
        );

      case 'size':
        return (
          <Select
            options={option.options || []}
            value={value}
            onChange={handleChange}
            label={option.name}
            error={error}
          />
        );

      case 'text':
        return (
          <TextInput
            label={option.name}
            placeholder={option.placeholder}
            value={value || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
            error={error}
            maxLength={option.maxLength}
          />
        );

      case 'upload':
        return (
          <FileUpload
            label={option.name}
            onFileSelect={(files: File[]) => handleChange(files[0])}
            error={error}
          />
        );

      case 'checkbox':
        return (
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
          }}>
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleChange(e.target.checked)}
            />
            <span style={{ fontSize: theme.fontSizes?.small || '16px' }}>
              {option.name}
            </span>
          </label>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {renderField()}
      {error && (
        <span style={{
          color: theme.colors?.feedback?.critical?.base || '#ff0000',
          fontSize: theme.fontSizes?.xsmall || '10px',
          marginTop: '0.25rem',
          display: 'block',
        }}>
          {error}
        </span>
      )}
    </div>
  );
};

CustomizationField.displayName = 'CustomizationField';
export default CustomizationField;
