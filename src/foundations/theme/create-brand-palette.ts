import type { BrandPalette, BrandShades } from '../tokens/semantics/color/brand';

export type CreateBrandPaletteInput = {
  primary: string;
  secondary?: string;
  accent?: string;
  onPrimary?: string;
  onSecondary?: string;
  subtle?: string;
  soft?: string;
  strong?: string;
  hover?: string;
  active?: string;
};

export type ResolvedBrandPalette = BrandPalette & BrandShades;

export function createBrandPalette(input: CreateBrandPaletteInput): ResolvedBrandPalette {
  const {
    primary,
    secondary = primary,
    accent = primary,
    onPrimary = '#ffffff',
    onSecondary = '#ffffff',
    subtle = primary,
    soft = primary,
    strong = primary,
    hover = strong,
    active = strong,
  } = input;

  return {
    primary,
    secondary,
    accent,
    onPrimary,
    onSecondary,
    subtle,
    soft,
    base: primary,
    strong,
    hover,
    active,
  };
}
