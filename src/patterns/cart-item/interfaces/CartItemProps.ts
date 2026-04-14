export interface CartItemProps {
  // Identity
  id: string;
  name: string;

  // Media & Display
  image: string;
  customizations?: Record<string, string>;

  // Pricing
  price: number;
  quantity: number;
  onQuantityChange?: (quantity: number) => void;

  // Actions
  onRemove?: () => void;

  // Constraints
  minQuantity?: number;
  maxQuantity?: number;

  // Display
  showImage?: boolean;
}
