import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Box, Clickable, Icon } from '../../core';
import { useControllableState } from '../../../ecosystem/primitives';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import {
  useBreakpoint,
  useToken,
  usePrefersReducedMotion,
} from '../../../ecosystem/styled-system/system/hooks';
import { CarouselContext, useCarouselContext } from '../context/carousel-context';
import type {
  CarouselContentProps,
  CarouselIndicatorsProps,
  CarouselItemProps,
  CarouselNavProps,
  CarouselRootProps,
  CarouselSlidesPerView,
} from '../interfaces';

type CarouselSlots =
  | 'root'
  | 'content'
  | 'item'
  | 'previous'
  | 'next'
  | 'indicators'
  | 'indicator';

const BREAKPOINT_ORDER = ['base', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
type BreakpointKey = (typeof BREAKPOINT_ORDER)[number];

const TABS_PATTERN_MAX_ITEMS = 7;

function resolveSlidesPerView(
  spv: CarouselSlidesPerView | undefined,
  breakpoint: string,
): number {
  if (typeof spv === 'number') return spv;
  if (!spv) return 1;
  const bpIdx = BREAKPOINT_ORDER.indexOf(breakpoint as BreakpointKey);
  for (let i = bpIdx >= 0 ? bpIdx : 0; i >= 0; i--) {
    const value = (spv as Record<string, number | undefined>)[BREAKPOINT_ORDER[i]];
    if (value != null) return value;
  }
  return spv.base ?? 1;
}

interface CarouselItemContextValue {
  index: number;
  total: number;
  slideId: string;
}

const CarouselItemContext = createContext<CarouselItemContextValue | null>(null);

function useCarouselItemContext(): CarouselItemContextValue {
  const ctx = useContext(CarouselItemContext);
  if (!ctx) {
    throw new Error('Carousel.Item must be rendered inside <Carousel.Content>.');
  }
  return ctx;
}

// ─── Root ───────────────────────────────────────────────────────────────────

function CarouselRoot({
  children,
  activeIndex: activeIndexProp,
  defaultActiveIndex = 0,
  onActiveIndexChange,
  slidesPerView = 1,
  gap = 'medium',
  ariaLabel,
  className,
  style,
}: CarouselRootProps) {
  const baseId = useId();
  const [activeIndex, setActiveIndex] = useControllableState({
    value: activeIndexProp,
    defaultValue: defaultActiveIndex,
    onChange: onActiveIndexChange,
  });

  const breakpoint = useBreakpoint();
  const resolvedSlidesPerView = useMemo(
    () => resolveSlidesPerView(slidesPerView, breakpoint),
    [slidesPerView, breakpoint],
  );

  const [slideCount, setSlideCount] = useState(0);
  const contentRef = useRef<HTMLElement | null>(null);
  const flatListRef = useRef<unknown>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementToIndex = useRef<Map<Element, number>>(new Map());

  const observe = useCallback((el: HTMLElement, index: number) => {
    elementToIndex.current.set(el, index);
    observerRef.current?.observe(el);
  }, []);

  const unobserve = useCallback((el: HTMLElement) => {
    elementToIndex.current.delete(el);
    observerRef.current?.unobserve(el);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const target = Math.max(0, Math.min(index, slideCount - 1));
      setActiveIndex(target);
    },
    [setActiveIndex, slideCount],
  );

  const next = useCallback(() => {
    goTo(activeIndex + 1);
  }, [goTo, activeIndex]);

  const prev = useCallback(() => {
    goTo(activeIndex - 1);
  }, [goTo, activeIndex]);

  const indicatorPattern: 'tabs' | 'group' =
    resolvedSlidesPerView === 1 && slideCount <= TABS_PATTERN_MAX_ITEMS ? 'tabs' : 'group';

  const slots = useSlotRecipe<CarouselSlots>('carousel');

  const ctxValue = useMemo(
    () => ({
      activeIndex,
      setActiveIndex,
      goTo,
      next,
      prev,
      slideCount,
      setSlideCount,
      resolvedSlidesPerView,
      gap,
      ariaLabel,
      baseId,
      indicatorPattern,
      contentRef,
      flatListRef,
      observe,
      unobserve,
    }),
    [
      activeIndex,
      setActiveIndex,
      goTo,
      next,
      prev,
      slideCount,
      resolvedSlidesPerView,
      gap,
      ariaLabel,
      baseId,
      indicatorPattern,
      observe,
      unobserve,
    ],
  );

  return (
    <CarouselContext.Provider value={ctxValue as never}>
      <CarouselObserverBootstrap
        contentRef={contentRef}
        observerRef={observerRef}
        elementToIndex={elementToIndex}
        onActiveChange={setActiveIndex}
      />
      <Box
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        {...slots.root}
        className={className}
        style={style}
      >
        {children}
      </Box>
    </CarouselContext.Provider>
  );
}

/**
 * Side-effect-only component: cria o `IntersectionObserver` quando o
 * `Content` monta, observando os items registrados via `observe`. Isolado
 * em componente para que `useEffect` rode após o `contentRef` ter sido
 * setado.
 */
function CarouselObserverBootstrap({
  contentRef,
  observerRef,
  elementToIndex,
  onActiveChange,
}: {
  contentRef: React.RefObject<HTMLElement | null>;
  observerRef: React.MutableRefObject<IntersectionObserver | null>;
  elementToIndex: React.MutableRefObject<Map<Element, number>>;
  onActiveChange: (index: number) => void;
}) {
  useEffect(() => {
    const root = contentRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting && e.intersectionRatio >= 0.51)
          .map((e) => elementToIndex.current.get(e.target))
          .filter((i): i is number => typeof i === 'number')
          .sort((a, b) => a - b);
        if (visible.length > 0) {
          onActiveChange(visible[0]);
        }
      },
      { root, threshold: [0.51] },
    );

    observerRef.current = observer;
    // Observa items que já se registraram antes do observer existir
    elementToIndex.current.forEach((_, el) => observer.observe(el));

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [contentRef, observerRef, elementToIndex, onActiveChange]);

  return null;
}

// ─── Content ────────────────────────────────────────────────────────────────

function CarouselContent({ children, className, style }: CarouselContentProps) {
  const ctx = useCarouselContext();
  const slots = useSlotRecipe<CarouselSlots>('carousel');
  const gapPx = useToken('space', ctx.gap) as string;

  const items = useMemo(
    () =>
      React.Children.toArray(children).filter(
        (c): c is React.ReactElement => React.isValidElement(c),
      ),
    [children],
  );

  useEffect(() => {
    ctx.setSlideCount(items.length);
  }, [items.length, ctx]);

  return (
    <Box
      innerRef={ctx.contentRef}
      gap={ctx.gap}
      {...slots.content}
      className={className}
      style={{
        overflowX: 'auto',
        overflowY: 'hidden',
        scrollSnapType: 'x mandatory',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        ['--arbor-carousel-gap' as string]: gapPx,
        ...style,
      }}
    >
      {items.map((child, index) => (
        <CarouselItemContext.Provider
          key={(child as React.ReactElement & { key?: React.Key }).key ?? index}
          value={{ index, total: items.length, slideId: `${ctx.baseId}-slide-${index}` }}
        >
          {child}
        </CarouselItemContext.Provider>
      ))}
    </Box>
  );
}

// ─── Item ───────────────────────────────────────────────────────────────────

function CarouselItem({ children, id, className, style }: CarouselItemProps) {
  const ctx = useCarouselContext();
  const itemCtx = useCarouselItemContext();
  const slots = useSlotRecipe<CarouselSlots>('carousel');
  const ref = useRef<HTMLElement | null>(null);

  const slideId = id ?? itemCtx.slideId;
  const inWindow =
    itemCtx.index >= ctx.activeIndex &&
    itemCtx.index < ctx.activeIndex + ctx.resolvedSlidesPerView;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    ctx.observe(el, itemCtx.index);
    return () => ctx.unobserve(el);
  }, [ctx, itemCtx.index]);

  const itemWidth =
    ctx.resolvedSlidesPerView === 1
      ? '100%'
      : `calc((100% - ${ctx.resolvedSlidesPerView - 1} * var(--arbor-carousel-gap, 0px)) / ${ctx.resolvedSlidesPerView})`;

  return (
    <Box
      innerRef={ref as React.Ref<HTMLElement>}
      id={slideId}
      role="group"
      aria-roledescription="slide"
      aria-label={`${itemCtx.index + 1} de ${itemCtx.total}`}
      inert={!inWindow ? true : undefined}
      {...slots.item}
      className={className}
      style={{
        width: itemWidth,
        scrollSnapAlign: 'start',
        ...style,
      }}
    >
      {children}
    </Box>
  );
}

// ─── Previous / Next ────────────────────────────────────────────────────────

function CarouselPrevious({ ariaLabel, children, className, style }: CarouselNavProps) {
  const ctx = useCarouselContext();
  const slots = useSlotRecipe<CarouselSlots>('carousel');
  const prefersReducedMotion = usePrefersReducedMotion();
  const disabled = ctx.activeIndex <= 0;

  const handleClick = () => {
    if (disabled) return;
    ctx.prev();
    smoothScrollToIndex(ctx.contentRef.current, ctx.activeIndex - 1, prefersReducedMotion);
  };

  return (
    <Clickable
      as="button"
      type="button"
      aria-label={ariaLabel ?? 'Slide anterior'}
      onClick={handleClick}
      disabled={disabled}
      {...slots.previous}
      className={className}
      style={style}
    >
      {children ?? <Icon name="ChevronLeft" decorative size="medium" />}
    </Clickable>
  );
}

function CarouselNext({ ariaLabel, children, className, style }: CarouselNavProps) {
  const ctx = useCarouselContext();
  const slots = useSlotRecipe<CarouselSlots>('carousel');
  const prefersReducedMotion = usePrefersReducedMotion();
  const disabled = ctx.activeIndex >= ctx.slideCount - ctx.resolvedSlidesPerView;

  const handleClick = () => {
    if (disabled) return;
    ctx.next();
    smoothScrollToIndex(ctx.contentRef.current, ctx.activeIndex + 1, prefersReducedMotion);
  };

  return (
    <Clickable
      as="button"
      type="button"
      aria-label={ariaLabel ?? 'Próximo slide'}
      onClick={handleClick}
      disabled={disabled}
      {...slots.next}
      className={className}
      style={style}
    >
      {children ?? <Icon name="ChevronRight" decorative size="medium" />}
    </Clickable>
  );
}

function smoothScrollToIndex(
  container: HTMLElement | null,
  index: number,
  prefersReducedMotion: boolean,
) {
  if (!container) return;
  const item = container.children[index] as HTMLElement | undefined;
  if (!item) return;
  // jsdom não implementa scrollTo. Guard para ambientes sem suporte.
  if (typeof container.scrollTo !== 'function') return;
  container.scrollTo({
    left: item.offsetLeft - container.offsetLeft,
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
  });
}

// ─── Indicators ─────────────────────────────────────────────────────────────

function CarouselIndicators({
  children,
  ariaLabel,
  className,
  style,
}: CarouselIndicatorsProps) {
  const ctx = useCarouselContext();
  const slots = useSlotRecipe<CarouselSlots>('carousel');
  const slotsActive = useSlotRecipe<CarouselSlots>('carousel', { state: 'active' });
  const slotsInactive = useSlotRecipe<CarouselSlots>('carousel', { state: 'inactive' });
  const prefersReducedMotion = usePrefersReducedMotion();

  const indices = useMemo(
    () => Array.from({ length: ctx.slideCount }, (_, i) => i),
    [ctx.slideCount],
  );

  if (ctx.slideCount === 0) return null;

  const isTabs = ctx.indicatorPattern === 'tabs';
  const containerLabel = ariaLabel ?? 'Selecione um slide';

  const handleSelect = (index: number) => {
    ctx.goTo(index);
    smoothScrollToIndex(ctx.contentRef.current, index, prefersReducedMotion);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!isTabs) return;
    let nextIndex: number | null = null;
    if (e.key === 'ArrowRight') nextIndex = (index + 1) % ctx.slideCount;
    else if (e.key === 'ArrowLeft') nextIndex = (index - 1 + ctx.slideCount) % ctx.slideCount;
    else if (e.key === 'Home') nextIndex = 0;
    else if (e.key === 'End') nextIndex = ctx.slideCount - 1;
    if (nextIndex !== null) {
      e.preventDefault();
      handleSelect(nextIndex);
      const tabId = `${ctx.baseId}-indicator-${nextIndex}`;
      requestAnimationFrame(() => document.getElementById(tabId)?.focus());
    }
  };

  return (
    <Box
      role={isTabs ? 'tablist' : 'group'}
      aria-label={containerLabel}
      {...slots.indicators}
      className={className}
      style={style}
    >
      {indices.map((index) => {
        const active = index === ctx.activeIndex;
        const slideId = `${ctx.baseId}-slide-${index}`;
        const tabId = `${ctx.baseId}-indicator-${index}`;
        const goTo = () => handleSelect(index);

        if (children) {
          return (
            <React.Fragment key={index}>
              {children({ index, active, goTo, slideId, total: ctx.slideCount })}
            </React.Fragment>
          );
        }

        const indicatorStyle = (active ? slotsActive : slotsInactive).indicator;

        return (
          <Clickable
            key={index}
            as="button"
            type="button"
            id={tabId}
            role={isTabs ? 'tab' : 'button'}
            aria-controls={slideId}
            aria-current={!isTabs && active ? 'true' : undefined}
            aria-selected={isTabs ? active : undefined}
            tabIndex={isTabs ? (active ? 0 : -1) : 0}
            aria-label={`Ir para slide ${index + 1}`}
            onClick={goTo}
            onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => handleKeyDown(e, index)}
            {...indicatorStyle}
          />
        );
      })}
    </Box>
  );
}

// ─── displayName ────────────────────────────────────────────────────────────

CarouselRoot.displayName = 'Carousel.Root';
CarouselContent.displayName = 'Carousel.Content';
CarouselItem.displayName = 'Carousel.Item';
CarouselPrevious.displayName = 'Carousel.Previous';
CarouselNext.displayName = 'Carousel.Next';
CarouselIndicators.displayName = 'Carousel.Indicators';

/**
 * @platform shared
 *
 * Compound de carousel cross-platform com naming alinhado a shadcn/ui
 * e a11y WAI-ARIA APG (rev. 3 RFC-0034). PR1 sem `autoplay`/`loop`/
 * `vertical`/`lazy`.
 *
 * Web: `scroll-snap` CSS + `IntersectionObserver` (`threshold: 0.51`)
 * para tracking ativo. Items fora da janela visível recebem `inert`
 * (TD-040). `Prev`/`Next`/indicator click → `scrollTo` respeitando
 * `prefers-reduced-motion`.
 *
 * Indicators usa **dual pattern** APG-aligned:
 * - `tabs` (slidesPerView=1 ∧ total ≤ 7): `role="tablist"` +
 *   `role="tab"` + setas trocam slide.
 * - `group` (caso contrário): `role="group"` + botões individuais.
 *
 * @example
 * <Carousel ariaLabel="Produtos em destaque" slidesPerView={{ base: 1, md: 2, lg: 4 }}>
 *   <Carousel.Content>
 *     <Carousel.Item>...</Carousel.Item>
 *     <Carousel.Item>...</Carousel.Item>
 *   </Carousel.Content>
 *   <Carousel.Previous />
 *   <Carousel.Next />
 *   <Carousel.Indicators />
 * </Carousel>
 *
 * @see {@link CarouselRootProps}
 * @see RFC-0034 (rev. 3)
 */
export const Carousel = Object.assign(CarouselRoot, {
  Root: CarouselRoot,
  Content: CarouselContent,
  Item: CarouselItem,
  Previous: CarouselPrevious,
  Next: CarouselNext,
  Indicators: CarouselIndicators,
});

export default Carousel;
