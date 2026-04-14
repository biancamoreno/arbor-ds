export interface CategoryMenuItem {
  value: string;
  label: string;
  count?: number;
}

export interface CategoryMenuProps {
  items: CategoryMenuItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}
