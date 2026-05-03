import type { CSSProperties, ReactElement, ReactNode } from 'react';
import type { FlatListProps } from 'react-native';

/** @platform shared */
export type CarouselGap = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

/** @platform shared */
export type CarouselSlidesPerView =
  | number
  | {
      base?: number;
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
      '2xl'?: number;
    };

/** @platform shared */
export interface CarouselIndicatorRenderArgs {
  index: number;
  active: boolean;
  goTo: () => void;
  slideId: string;
  total: number;
}

/**
 * @platform shared
 *
 * `Carousel` compound. `Root` controla `activeIndex`
 * (controlled/uncontrolled), `slidesPerView`, `gap` e o nome acessível
 * obrigatório. `Content` é o trilho horizontal (web: `scroll-snap`;
 * native: `FlatList` interna). `Item` é cada slide.
 * `Previous`/`Next`/`Indicators` controlam a navegação.
 *
 * Web: keyboard nav `ArrowLeft`/`ArrowRight`/`Home`/`End` com foco no
 * `Content`. Tracking via `IntersectionObserver` (`threshold: 0.51`).
 * Items fora da janela visível recebem `inert` (TD-040).
 *
 * Native: `FlatList` horizontal com `snapToInterval` + `getItemLayout`
 * + `onViewableItemsChanged` (`itemVisiblePercentThreshold: 51`). Items
 * recebem `accessibilityElementsHidden` quando fora da janela.
 *
 * Indicators usa **dual pattern** APG-aligned:
 * - **Tabs pattern** (`role="tablist"` + `role="tab"` em cada dot, setas
 *   trocam slide): quando `slidesPerView=1` e total ≤ 7. Mais
 *   friendly ao teclado (1 tab stop coletivo).
 * - **Group pattern** (`role="group"` + botões individuais): caso
 *   contrário. APG marca como "least friendly to keyboard"; usar só
 *   quando Tabs não cabe.
 *
 * Naming alinhado com shadcn/ui (`Carousel`, `Carousel.Content`,
 * `Carousel.Item`, `Carousel.Previous`, `Carousel.Next`,
 * `Carousel.Indicators`).
 *
 * @see WAI-ARIA APG Carousel pattern
 * @see RFC-0034 (rev. 3)
 */
export interface CarouselRootProps {
  children: ReactNode;

  /** Índice ativo controlado. */
  activeIndex?: number;
  /** Índice ativo inicial uncontrolled. Default `0`. */
  defaultActiveIndex?: number;
  /** Callback quando o índice ativo muda. */
  onActiveIndexChange?: (index: number) => void;

  /**
   * Quantos itens exibir simultaneamente. Number ou objeto responsivo
   * (`{ base, sm, md, lg, xl, '2xl' }`). Default `1`.
   */
  slidesPerView?: CarouselSlidesPerView;

  /** Espaço entre itens. Token de spacing. Default `'medium'`. */
  gap?: CarouselGap;

  /** Nome acessível obrigatório do carrossel. */
  ariaLabel: string;

  /**
   * Escape hatch para repassar props arbitrárias à `FlatList` interna em
   * native (`windowSize`, `removeClippedSubviews`, `initialNumToRender`,
   * etc.). No-op no web. Use com parcimônia — abre a anatomia da
   * implementação.
   */
  nativeListProps?: Partial<FlatListProps<ReactElement>>;

  className?: string;
  style?: CSSProperties;
  testID?: string;
}

/** @platform shared */
export interface CarouselContentProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  testID?: string;
}

/** @platform shared */
export interface CarouselItemProps {
  children: ReactNode;
  /**
   * Identificador estável; usado para `aria-controls` dos indicadores.
   * Auto-gerado se ausente.
   */
  id?: string;
  className?: string;
  style?: CSSProperties;
}

/** @platform shared */
export interface CarouselNavProps {
  /**
   * Override do label acessível. Default pt-BR
   * (`Carousel.Previous`: `"Slide anterior"`; `Carousel.Next`:
   * `"Próximo slide"`).
   */
  ariaLabel?: string;
  /** Conteúdo customizado (ex: outro ícone). Default = ChevronLeft / ChevronRight. */
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** @platform shared */
export interface CarouselIndicatorsProps {
  /**
   * Render prop opcional para customizar cada dot. Default = dot
   * circular themable via slot recipe.
   */
  children?: (args: CarouselIndicatorRenderArgs) => ReactNode;
  /**
   * Override do label do `tablist`/`group`. Default pt-BR
   * (`"Selecione um slide"`).
   */
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}
