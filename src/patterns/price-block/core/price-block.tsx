import { useTheme } from '../../../ecosystem';
import type { PriceBlockProps } from '../interfaces';

function formatCurrency(value: number, locale: string, currency: string) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

export function PriceBlock({
  price,
  compareAtPrice,
  badge,
  note,
  installmentText,
  locale = 'pt-BR',
  currency = 'BRL',
  showSavings = true,
}: PriceBlockProps) {
  const theme = useTheme();
  const hasDiscount = typeof compareAtPrice === 'number' && compareAtPrice > price;
  const savings = hasDiscount ? compareAtPrice - price : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {badge}
      {hasDiscount && (
        <span
          style={{
            color: theme.colors.text.tertiary,
            fontSize: theme.fontSizes.xsmall,
            textDecoration: 'line-through',
          }}
        >
          {formatCurrency(compareAtPrice, locale, currency)}
        </span>
      )}
      <strong
        style={{
          color: theme.colors.text.primary,
          fontSize: theme.fontSizes.medium,
        }}
      >
        {formatCurrency(price, locale, currency)}
      </strong>
      {showSavings && hasDiscount && (
        <span
          style={{
            color: theme.colors.feedback.success.strong,
            fontSize: theme.fontSizes.xsmall,
          }}
        >
          Economize {formatCurrency(savings, locale, currency)}
        </span>
      )}
      {installmentText && (
        <span
          style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.xsmall,
          }}
        >
          {installmentText}
        </span>
      )}
      {note && (
        <span
          style={{
            color: theme.colors.text.secondary,
            fontSize: theme.fontSizes.xsmall,
          }}
        >
          {note}
        </span>
      )}
    </div>
  );
}

export default PriceBlock;
