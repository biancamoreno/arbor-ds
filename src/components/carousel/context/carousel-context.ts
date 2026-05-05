import { createContext, useContext, type ReactElement, type RefObject } from 'react';
import type { FlatListProps } from 'react-native';
import type { CarouselGap } from '../interfaces';

/**
 * Pattern do `Carousel.Indicators`, decidido pelo `Carousel.Root` com
 * base em `slidesPerView` e total de items:
 *
 * - `tabs`: `slidesPerView=1` e `total ≤ 7`. Indicadores viram
 *   `role="tablist"` + `role="tab"`. Setas `←`/`→` trocam slide.
 *   APG: forma idiomática para teclado.
 * - `group`: caso contrário. Indicadores viram `role="group"` + botões
 *   individuais. Cada um é tab stop. APG: "least friendly to keyboard".
 */
export type CarouselIndicatorPattern = 'tabs' | 'group';

export interface CarouselContextValue {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;

  /** Total de items registrados (atualizado pelo `Content`). */
  slideCount: number;
  setSlideCount: (count: number) => void;
  /** `slidesPerView` resolvido para o breakpoint atual (sempre número). */
  resolvedSlidesPerView: number;
  /** Gap entre items (token semântico). */
  gap: CarouselGap;
  /** Nome acessível da região (`aria-label` do root). */
  ariaLabel: string;
  /** Prefixo de IDs (auto-gerado por `useId`). */
  baseId: string;
  /** Decisão dual pattern para indicadores. */
  indicatorPattern: CarouselIndicatorPattern;

  /** Ref do `Content` (web: viewport scrollável; root do IO; alvo do scrollTo). */
  contentRef: RefObject<HTMLElement | null>;

  /** Ref do `FlatList` interno (native). Tipado como `unknown` para evitar leak de
   *  tipos de `react-native` no bundle web. Cast feito dentro do `.native.tsx`. */
  flatListRef: { current: unknown };

  /** Registra item para o `IntersectionObserver` (web; no-op em native). */
  observe: (el: HTMLElement, index: number) => void;
  unobserve: (el: HTMLElement) => void;

  /** Escape hatch para `FlatList` (native; ignorado no web). */
  nativeListProps?: Partial<FlatListProps<ReactElement>>;

  /** Autoplay ativo? Calculado pelo Root com base na config. */
  autoplayEnabled: boolean;
  /**
   * `true` quando autoplay deveria estar rodando neste exato momento
   * (não há nenhum pause flag ativo). `Carousel.Content` usa para
   * decidir `aria-live='polite'` vs `'off'`.
   */
  isPlaying: boolean;
  /** Toggle manual via `Carousel.PlayPause`. Sobrescreve outros pauses. */
  togglePlayPause: () => void;
  /** Hooks de interação (web Root listeners chamam quando aplicável). */
  setHovered: (v: boolean) => void;
  setFocusedWithin: (v: boolean) => void;
  setInteracting: (v: boolean) => void;
}

export const CarouselContext = createContext<CarouselContextValue | null>(null);

export function useCarouselContext(): CarouselContextValue {
  const ctx = useContext(CarouselContext);
  if (!ctx) {
    throw new Error(
      'Carousel subcomponents (Content, Item, Previous, Next, Indicators) must be rendered inside <Carousel>.',
    );
  }
  return ctx;
}
