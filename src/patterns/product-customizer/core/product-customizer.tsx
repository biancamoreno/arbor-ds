import React, { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { Button } from '../../../components/button';
import { CustomizationField } from './customization-field';
import type { ProductCustomizerProps } from '../interfaces';

export const ProductCustomizer: React.FC<ProductCustomizerProps> = ({
  productName,
  previewImage,
  onPreviewUpdate,
  previewLoading,
  options,
  values: initialValues,
  onChange,
  onConfirm,
  onCancel,
  showPreview = true,
  layout = 'side-by-side',
}) => {
  const theme = useTheme();
  const [values, setValues] = useState<Record<string, any>>(
    initialValues || options.reduce((acc, opt) => ({ ...acc, [opt.id]: opt.value }), {})
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate on change
  useEffect(() => {
    const newErrors: Record<string, string> = {};
    
    options.forEach((option) => {
      if (option.validation) {
        const error = option.validation(values[option.id]);
        if (error) {
          newErrors[option.id] = error;
        }
      }
    });

    setErrors(newErrors);
    onChange?.(values);
  }, [values]);

  // Update preview on customization change
  useEffect(() => {
    onPreviewUpdate?.(values);
  }, [values]);

  const handleFieldChange = (optionId: string, value: any) => {
    setValues({ ...values, [optionId]: value });
  };

  const handleConfirm = () => {
    if (Object.keys(errors).length === 0) {
      onConfirm?.(values);
    }
  };

  const containerStyle: CSSProperties = layout === 'side-by-side' 
    ? {
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)',
        gap: '2rem',
        padding: '1.5rem',
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        padding: '1.5rem',
      };

  return (
    <div style={containerStyle}>
      {/* FORM */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        <h2 style={{ margin: 0, fontSize: theme.fontSizes?.large || '28px' }}>
          Customize {productName}
        </h2>

        <div>
          {options.map((option) => (
            <CustomizationField
              key={option.id}
              option={option}
              value={values[option.id]}
              error={errors[option.id]}
              onChange={(value) => handleFieldChange(option.id, value)}
            />
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
          <Button
            variant="secondary"
            onClick={onCancel}
            style={{ flex: 1 }}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={Object.keys(errors).length > 0}
            style={{ flex: 1 }}
          >
            Confirmar
          </Button>
        </div>
      </div>

      {/* PREVIEW */}
      {showPreview && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <h2 style={{ margin: 0, fontSize: theme.fontSizes?.large || '28px' }}>
            Preview
          </h2>

          <div style={{
            backgroundColor: theme.colors?.background?.subtle || '#f5f5f5',
            borderRadius: theme.radii?.medium || '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {previewLoading ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
              }}>
                <span style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}>
                  🤖
                </span>
                <p style={{
                  fontSize: theme.fontSizes?.small || '16px',
                  color: theme.colors?.text?.secondary || '#757575',
                }}>
                  Generating preview with AI...
                </p>
              </div>
            ) : (
              <img
                src={previewImage}
                alt={productName}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s',
                }}
              />
            )}
          </div>

          <p style={{
            fontSize: theme.fontSizes?.xsmall || '10px',
            color: theme.colors?.text?.secondary || '#757575',
            margin: 0,
          }}>
            Preview updates in real-time as you customize
          </p>
        </div>
      )}
    </div>
  );
};

ProductCustomizer.displayName = 'ProductCustomizer';
export default ProductCustomizer;
