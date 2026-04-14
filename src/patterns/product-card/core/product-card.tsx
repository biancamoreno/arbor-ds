import { useTheme } from '../../../ecosystem';
import { Badge, Button } from '../../../components';
import { FavoriteButton } from '../../favorite-button';
import { PriceBlock } from '../../price-block';
import type { ProductCardProps } from '../interfaces';

export function ProductCard({
  title,
  image,
  imageAlt,
  description,
  badge,
  eta,
  price,
  compareAtPrice,
  locale,
  currency,
  favorite,
  onFavoriteChange,
  primaryActionLabel = 'Escolher produto',
  secondaryActionLabel,
  onPrimaryAction,
  onSecondaryAction,
  footer,
}: ProductCardProps) {
  const theme = useTheme();

  return (
    <article
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.space.small,
        padding: theme.space.small,
        borderRadius: theme.radii.large,
        border: `1px solid ${theme.colors.border.subtle}`,
        backgroundColor: theme.colors.surface.default,
      }}
    >
      <div style={{ position: 'relative' }}>
        <div
          style={{
            overflow: 'hidden',
            borderRadius: theme.radii.medium,
            aspectRatio: '1 / 1',
            backgroundColor: theme.colors.background.subtle,
          }}
        >
          <img
            src={image}
            alt={imageAlt ?? ''}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '8px' }}>
          {typeof badge === 'string' ? <Badge tone="brand">{badge}</Badge> : badge}
        </div>
        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
          <FavoriteButton checked={favorite} onCheckedChange={onFavoriteChange} tooltip="Salvar nos favoritos" />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h3
            style={{
              margin: 0,
              color: theme.colors.text.primary,
              fontSize: theme.fontSizes.small,
            }}
          >
            {title}
          </h3>
          {description && (
            <p
              style={{
                margin: 0,
                color: theme.colors.text.secondary,
                fontSize: theme.fontSizes.xsmall,
              }}
            >
              {description}
            </p>
          )}
          {eta && (
            <span
              style={{
                color: theme.colors.text.secondary,
                fontSize: theme.fontSizes.xsmall,
              }}
            >
              {eta}
            </span>
          )}
        </div>
        <PriceBlock price={price} compareAtPrice={compareAtPrice} locale={locale} currency={currency} />
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Button onClick={onPrimaryAction} style={{ flex: 1 }}>
          {primaryActionLabel}
        </Button>
        {secondaryActionLabel && (
          <Button variant="secondary" onClick={onSecondaryAction} style={{ flex: 1 }}>
            {secondaryActionLabel}
          </Button>
        )}
      </div>
      {footer}
    </article>
  );
}

export default ProductCard;
