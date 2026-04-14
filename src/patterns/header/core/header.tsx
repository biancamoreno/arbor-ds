import { useTheme } from '../../../ecosystem';
import { Badge, Button, SearchInput } from '../../../components';
import type { HeaderProps } from '../interfaces';

export function Header({
  brand = 'FazPraMim',
  navItems = [],
  searchValue,
  onSearchValueChange,
  searchPlaceholder = 'Buscar na vitrine',
  primaryActionLabel = 'Criar o meu',
  secondaryActionLabel = 'Entrar',
  cartCount = 0,
  onPrimaryAction,
  onSecondaryAction,
}: HeaderProps) {
  const theme = useTheme();

  return (
    <header
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        alignItems: 'center',
        gap: theme.space.small,
        padding: theme.space.small,
        borderRadius: theme.radii.large,
        border: `1px solid ${theme.colors.border.subtle}`,
        backgroundColor: theme.colors.surface.raised,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: theme.radii.medium,
            backgroundColor: theme.colors.brand.subtle,
            color: theme.colors.brand.strong,
            fontWeight: theme.fontWeights.bold,
          }}
        >
          FP
        </div>
        <strong style={{ color: theme.colors.text.primary }}>{brand}</strong>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.space.small }}>
        {navItems.length > 0 && (
          <nav style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                style={{
                  color: item.active ? theme.colors.text.primary : theme.colors.text.secondary,
                  fontSize: theme.fontSizes.xsmall,
                  fontWeight: item.active ? theme.fontWeights.medium : theme.fontWeights.regular,
                  textDecoration: 'none',
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
        <SearchInput
          value={searchValue}
          onValueChange={onSearchValueChange}
          placeholder={searchPlaceholder}
          aria-label="Buscar no cabeçalho"
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Button variant="ghost" onClick={onSecondaryAction}>
          {secondaryActionLabel}
        </Button>
        <Button onClick={onPrimaryAction}>{primaryActionLabel}</Button>
        <Badge tone={cartCount > 0 ? 'brand' : 'neutral'}>{cartCount} itens</Badge>
      </div>
    </header>
  );
}

export default Header;
