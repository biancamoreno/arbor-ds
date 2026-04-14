import React from 'react';
import { useTheme } from '../../../ecosystem';
import type { ProductGalleryProps } from '../interfaces';

const aspectMap = {
  square: '1 / 1',
  landscape: '4 / 3',
  portrait: '3 / 4',
} as const;

export function ProductGallery({
  images,
  value,
  defaultValue,
  onValueChange,
  aspectRatio = 'square',
  showThumbnails = true,
}: ProductGalleryProps) {
  const theme = useTheme();
  const fallbackId = images[0]?.id;
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? fallbackId);
  const selectedId = value ?? internalValue ?? fallbackId;
  const selectedImage = images.find((image) => image.id === selectedId) ?? images[0];

  if (!selectedImage) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.space.small }}>
      <div
        style={{
          overflow: 'hidden',
          borderRadius: theme.radii.large,
          border: `1px solid ${theme.colors.border.subtle}`,
          backgroundColor: theme.colors.background.subtle,
          aspectRatio: aspectMap[aspectRatio],
        }}
      >
        <img
          src={selectedImage.src}
          alt={selectedImage.alt ?? ''}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>
      {showThumbnails && images.length > 1 && (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {images.map((image) => {
            const isActive = image.id === selectedImage.id;

            return (
              <button
                key={image.id}
                type="button"
                aria-label={image.label ?? image.alt ?? image.id}
                onClick={() => {
                  if (value === undefined) {
                    setInternalValue(image.id);
                  }
                  onValueChange?.(image.id);
                }}
                style={{
                  width: '72px',
                  height: '72px',
                  overflow: 'hidden',
                  padding: 0,
                  borderRadius: theme.radii.medium,
                  border: `2px solid ${isActive ? theme.colors.brand.base : theme.colors.border.default}`,
                  backgroundColor: theme.colors.surface.default,
                  cursor: 'pointer',
                }}
              >
                <img
                  src={image.thumbnailSrc ?? image.src}
                  alt={image.alt ?? ''}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProductGallery;
