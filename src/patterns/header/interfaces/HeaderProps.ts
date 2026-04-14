export interface HeaderNavItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface HeaderProps {
  brand?: string;
  navItems?: HeaderNavItem[];
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
  searchPlaceholder?: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  cartCount?: number;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}
