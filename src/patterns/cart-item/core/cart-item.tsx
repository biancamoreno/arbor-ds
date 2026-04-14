import React from 'react';
import { useTheme } from '../../../ecosystem';
import type { CartItemProps } from '../interfaces';

export const CartItem: React.FC<CartItemProps> = ({
  name,
  image,
  customizations,
  price,
  quantity,
  onQuantityChange,
  onRemove,
  minQuantity = 1,
  maxQuantity = 999,
  showImage = true,
}) => {
  const theme = useTheme();
  const subtotal = price * quantity;

  const priceFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const handleDecrease = () => {
    if (quantity > minQuantity && onQuantityChange) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity && onQuantityChange) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: showImage ? 'auto 1fr auto auto' : '1fr auto auto',
        gap: '1rem',
        alignItems: 'center',
        padding: '1rem',
        borderBottom: `1px solid ${theme.colors.gray200}`,
        minHeight: '120px',
      }}
    >
      {/* Image */}
      {showImage && (
        <img
          src={image}
          alt={name}
          style={{
            width: '100px',
            height: '100px',
            borderRadius: theme.radii.md,
            objectFit: 'cover',
          }}
        />
      )}

      {/* Product Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h4
          style={{
            margin: 0,
            fontSize: theme.typography.sizes.sm,
            fontWeight: 600,
            color: theme.colors.gray900,
          }}
        >
          {name}
        </h4>

        {customizations && Object.entries(customizations).length > 0 && (
          <div
            style={{
              fontSize: theme.typography.sizes.xs,
              color: theme.colors.gray600,
            }}
          >
            {Object.entries(customizations).map(([key, value]) => (
              <div key={key}>
                {key}: {value}
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            fontSize: theme.typography.sizes.sm,
            fontWeight: 600,
            color: theme.colors.primary,
          }}
        >
          {priceFormatter.format(price)}
        </div>
      </div>

      {/* Quantity Counter */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          border: `1px solid ${theme.colors.gray300}`,
          borderRadius: theme.radii.sm,
          padding: '0.25rem',
        }}
      >
        <button
          onClick={handleDecrease}
          disabled={quantity <= minQuantity}
          style={{
            width: '32px',
            height: '32px',
            border: 'none',
            background: 'transparent',
            cursor: quantity <= minQuantity ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            color: quantity <= minQuantity ? theme.colors.gray400 : theme.colors.gray700,
            borderRadius: theme.radii.xs,
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            if (quantity > minQuantity) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = theme.colors.gray100;
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
          }}
        >
          −
        </button>

        <div
          style={{
            width: '30px',
            textAlign: 'center',
            fontSize: theme.typography.sizes.sm,
            fontWeight: 500,
            color: theme.colors.gray900,
          }}
        >
          {quantity}
        </div>

        <button
          onClick={handleIncrease}
          disabled={quantity >= maxQuantity}
          style={{
            width: '32px',
            height: '32px',
            border: 'none',
            background: 'transparent',
            cursor: quantity >= maxQuantity ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            color: quantity >= maxQuantity ? theme.colors.gray400 : theme.colors.gray700,
            borderRadius: theme.radii.xs,
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            if (quantity < maxQuantity) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = theme.colors.gray100;
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
          }}
        >
          +
        </button>
      </div>

      {/* Subtotal + Remove */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          alignItems: 'flex-end',
        }}
      >
        <div
          style={{
            fontSize: theme.typography.sizes.sm,
            fontWeight: 600,
            color: theme.colors.gray900,
          }}
        >
          {priceFormatter.format(subtotal)}
        </div>

        <button
          onClick={onRemove}
          style={{
            padding: '0.5rem 1rem',
            fontSize: theme.typography.sizes.xs,
            border: `1px solid ${theme.colors.red500}`,
            borderRadius: theme.radii.sm,
            background: 'transparent',
            color: theme.colors.red500,
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontWeight: 500,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = theme.colors.red50;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
          }}
        >
          ✕ Remover
        </button>
      </div>
    </div>
  );
};

CartItem.displayName = 'CartItem';
export default CartItem;
