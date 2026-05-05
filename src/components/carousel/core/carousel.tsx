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
import { useAutoplay } from './use-autoplay';
import type {
  CarouselContentProps,
  CarouselIndicatorsProps,
  CarouselItemProps,
  CarouselNavProps,
  CarouselPlayPauseProps,
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
// rootMargin do IO de lazy mounting: monta items "perto" da viewport
// (200px antes de entrar) para evitar flash de placeholder durante drag.
const LAZY_ROOT_MARGIN = '200px';

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
  orientation = 'horizontal',
  autoplay = false,
  lazy = false,
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
  const lazyObserverRef = useRef<IntersectionObserver | null>(null);
  const elementToIndex = useRef<Map<Element, number>>(new Map());

  // Sticky lazy-mount set: índices que já foram visíveis e devem
  // permanecer montados. Se lazy=false, set fica vazio e Item ignora.
  const [mountedSet, setMountedSet] = useState<Set<number>>(() => {
    if (!lazy) return new Set();
    const initial = new Set<number>();
    const start = Math.max(0, defaultActiveIndex);
    const end = start + (typeof slidesPerView === 'number' ? slidesPerView : 1);
    for (let i = start; i < end; i++) initial.add(i);
    return initial;
  });
  const markMounted = useCallback((index: number) => {
    setMountedSet((prev) => {
      if (prev.has(index)) return prev;
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  // ─── Autoplay state machine ──────────────────────────────────────────────
  const autoplayEnabled = autoplay !== false;
  const autoplayInterval = autoplay ? autoplay.interval : 0;
  const pauseOnHover = autoplay ? autoplay.pauseOnHover ?? true : false;
  const pauseOnInteraction = autoplay ? autoplay.pauseOnInteraction ?? true : false;

  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const [isHovered, setHovered] = useState(false);
  const [isFocusedWithin, setFocusedWithin] = useState(false);
  const [isInteracting, setInteracting] = useState(false);
  const [isPageHidden, setPageHidden] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const handler = () => setPageHidden(document.visibilityState === 'hidden');
    document.addEventListener('visibilitychange', handler);
    handler();
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  const paused =
    isPausedByUser ||
    prefersReducedMotion ||
    (pauseOnHover && isHovered) ||
    isFocusedWithin ||
    (pauseOnInteraction && isInteracting) ||
    isPageHidden;

  const isPlaying = autoplayEnabled && !paused;

  const togglePlayPause = useCallback(() => {
    setIsPausedByUser((prev) => !prev);
  }, []);

  const observe = useCallback((el: HTMLElement, index: number) => {
    elementToIndex.current.set(el, index);
    observerRef.current?.observe(el);
    lazyObserverRef.current?.observe(el);
  }, []);

  const unobserve = useCallback((el: HTMLElement) => {
    elementToIndex.current.delete(el);
    observerRef.current?.unobserve(el);
    lazyObserverRef.current?.unobserve(el);
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

  // Autoplay tick: avança um slide; faz wrap quando chega no fim (loop soft).
  useAutoplay({
    enabled: autoplayEnabled,
    interval: autoplayInterval,
    paused,
    onTick: () => {
      if (slideCount === 0) return;
      const lastVisibleIndex = slideCount - resolvedSlidesPerView;
      const nextIndex = activeIndex >= lastVisibleIndex ? 0 : activeIndex + 1;
      setActiveIndex(nextIndex);
      smoothScrollToIndex(contentRef.current, nextIndex, prefersReducedMotion, orientation);
    },
  });

  const indicatorPattern: 'tabs' | 'group' =
    resolvedSlidesPerView === 1 && slideCount <= TABS_PATTERN_MAX_ITEMS ? 'tabs' : 'group';

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
      orientation,
      lazy,
      mountedSet,
      markMounted,
      contentRef,
      flatListRef,
      observe,
      unobserve,
      autoplayEnabled,
      isPlaying,
      togglePlayPause,
      setHovered,
      setFocusedWithin,
      setInteracting,
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
      orientation,
      lazy,
      mountedSet,
      markMounted,
      observe,
      unobserve,
      autoplayEnabled,
      isPlaying,
      togglePlayPause,
    ],
  );

  const slots = useSlotRecipe<CarouselSlots>('carousel', { orientation });

  return (
    <CarouselContext.Provider value={ctxValue as never}>
      <CarouselObserverBootstrap
        contentRef={contentRef}
        observerRef={observerRef}
        lazyObserverRef={lazyObserverRef}
        elementToIndex={elementToIndex}
        onActiveChange={setActiveIndex}
        onMounted={markMounted}
        lazy={lazy}
      />
      <Box
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        onMouseEnter={autoplayEnabled && pauseOnHover ? () => setHovered(true) : undefined}
        onMouseLeave={autoplayEnabled && pauseOnHover ? () => setHovered(false) : undefined}
        onFocus={autoplayEnabled ? () => setFocusedWithin(true) : undefined}
        onBlur={
          autoplayEnabled
            ? (e: React.FocusEvent<HTMLElement>) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                  setFocusedWithin(false);
                }
              }
            : undefined
        }
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
 * Side-effect-only component: cria os `IntersectionObserver`s.
 *
 * - Observer principal (sempre): threshold 0.51, decide qual item é o
 *   ativo para tracking de scroll.
 * - Observer lazy (apenas quando `lazy=true`): rootMargin 200px,
 *   threshold 0, sinaliza "perto de visível, hora de montar". Sticky:
 *   uma vez marcado mounted, permanece (decisão deliberada — preserva
 *   state de form/video/IO).
 */
function CarouselObserverBootstrap({
  contentRef,
  observerRef,
  lazyObserverRef,
  elementToIndex,
  onActiveChange,
  onMounted,
  lazy,
}: {
  contentRef: React.RefObject<HTMLElement | null>;
  observerRef: React.MutableRefObject<IntersectionObserver | null>;
  lazyObserverRef: React.MutableRefObject<IntersectionObserver | null>;
  elementToIndex: React.MutableRefObject<Map<Element, number>>;
  onActiveChange: (index: number) => void;
  onMounted: (index: number) => void;
  lazy: boolean;
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
    elementToIndex.current.forEach((_, el) => observer.observe(el));

    let lazyObserver: IntersectionObserver | null = null;
    if (lazy) {
      lazyObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const idx = elementToIndex.current.get(entry.target);
            if (typeof idx === 'number') onMounted(idx);
          }
        },
        { root, rootMargin: LAZY_ROOT_MARGIN, threshold: 0 },
      );
      lazyObserverRef.current = lazyObserver;
      elementToIndex.current.forEach((_, el) => lazyObserver!.observe(el));
    }

    return () => {
      observer.disconnect();
      observerRef.current = null;
      if (lazyObserver) {
        lazyObserver.disconnect();
        lazyObserverRef.current = null;
      }
    };
  }, [contentRef, observerRef, lazyObserverRef, elementToIndex, onActiveChange, onMounted, lazy]);

  return null;
}

// ─── Content ────────────────────────────────────────────────────────────────

function CarouselContent({ children, className, style, testID }: CarouselContentProps) {
  const ctx = useCarouselContext();
  const slots = useSlotRecipe<CarouselSlots>('carousel', { orientation: ctx.orientation });
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

  // Pause on interaction (touchstart/mousedown/scroll). Reset 1500ms apos
  // ultima interacao via timer.
  const interactionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!ctx.autoplayEnabled) return;
    const el = ctx.contentRef.current;
    if (!el) return;

    const ping = () => {
      ctx.setInteracting(true);
      if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
      interactionTimerRef.current = setTimeout(() => ctx.setInteracting(false), 1500);
    };
    el.addEventListener('touchstart', ping, { passive: true });
    el.addEventListener('mousedown', ping);
    el.addEventListener('scroll', ping, { passive: true });

    return () => {
      el.removeEventListener('touchstart', ping);
      el.removeEventListener('mousedown', ping);
      el.removeEventListener('scroll', ping);
      if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
    };
  }, [ctx]);

  const isVertical = ctx.orientation === 'vertical';

  return (
    <Box
      innerRef={ctx.contentRef}
      gap={ctx.gap}
      data-testid={testID}
      aria-live={ctx.autoplayEnabled ? (ctx.isPlaying ? 'polite' : 'off') : undefined}
      {...slots.content}
      className={className}
      style={{
        overflowX: isVertical ? 'hidden' : 'auto',
        overflowY: isVertical ? 'auto' : 'hidden',
        scrollSnapType: isVertical ? 'y mandatory' : 'x mandatory',
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
  const slots = useSlotRecipe<CarouselSlots>('carousel', { orientation: ctx.orientation });
  const ref = useRef<HTMLElement | null>(null);

  const slideId = id ?? itemCtx.slideId;
  const inWindow =
    itemCtx.index >= ctx.activeIndex &&
    itemCtx.index < ctx.activeIndex + ctx.resolvedSlidesPerView;

  // Sticky lazy mount: uma vez montado, permanece. Preserva state de
  // form/video/IO em re-scroll (custa mais que DOM stale).
  const mounted = !ctx.lazy || ctx.mountedSet.has(itemCtx.index);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    ctx.observe(el, itemCtx.index);
    return () => ctx.unobserve(el);
  }, [ctx, itemCtx.index]);

  const isVertical = ctx.orientation === 'vertical';
  const spv = ctx.resolvedSlidesPerView;
  const sizeCalc =
    spv === 1
      ? '100%'
      : `calc((100% - ${spv - 1} * var(--arbor-carousel-gap, 0px)) / ${spv})`;
  const dimensionStyle: React.CSSProperties = isVertical
    ? { width: '100%', height: sizeCalc }
    : { width: sizeCalc, height: 'auto' };

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
        ...dimensionStyle,
        scrollSnapAlign: 'start',
        ...style,
      }}
    >
      {mounted ? children : null}
    </Box>
  );
}

// ─── Previous / Next ────────────────────────────────────────────────────────

function CarouselPrevious({ ariaLabel, children, className, style }: CarouselNavProps) {
  const ctx = useCarouselContext();
  const slots = useSlotRecipe<CarouselSlots>('carousel', { orientation: ctx.orientation });
  const prefersReducedMotion = usePrefersReducedMotion();
  const disabled = ctx.activeIndex <= 0;

  const handleClick = () => {
    if (disabled) return;
    ctx.prev();
    smoothScrollToIndex(
      ctx.contentRef.current,
      ctx.activeIndex - 1,
      prefersReducedMotion,
      ctx.orientation,
    );
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
  const slots = useSlotRecipe<CarouselSlots>('carousel', { orientation: ctx.orientation });
  const prefersReducedMotion = usePrefersReducedMotion();
  const disabled = ctx.activeIndex >= ctx.slideCount - ctx.resolvedSlidesPerView;

  const handleClick = () => {
    if (disabled) return;
    ctx.next();
    smoothScrollToIndex(
      ctx.contentRef.current,
      ctx.activeIndex + 1,
      prefersReducedMotion,
      ctx.orientation,
    );
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
  orientation: 'horizontal' | 'vertical',
) {
  if (!container) return;
  const item = container.children[index] as HTMLElement | undefined;
  if (!item) return;
  if (typeof container.scrollTo !== 'function') return;
  const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';
  if (orientation === 'vertical') {
    container.scrollTo({
      top: item.offsetTop - container.offsetTop,
      behavior,
    });
  } else {
    container.scrollTo({
      left: item.offsetLeft - container.offsetLeft,
      behavior,
    });
  }
}

// ─── Indicators ─────────────────────────────────────────────────────────────

function CarouselIndicators({
  children,
  ariaLabel,
  className,
  style,
}: CarouselIndicatorsProps) {
  const ctx = useCarouselContext();
  const slots = useSlotRecipe<CarouselSlots>('carousel', { orientation: ctx.orientation });
  const slotsActive = useSlotRecipe<CarouselSlots>('carousel', {
    orientation: ctx.orientation,
    state: 'active',
  });
  const slotsInactive = useSlotRecipe<CarouselSlots>('carousel', {
    orientation: ctx.orientation,
    state: 'inactive',
  });
  const prefersReducedMotion = usePrefersReducedMotion();

  const indices = useMemo(
    () => Array.from({ length: ctx.slideCount }, (_, i) => i),
    [ctx.slideCount],
  );

  if (ctx.slideCount === 0) return null;

  const isTabs = ctx.indicatorPattern === 'tabs';
  const isVertical = ctx.orientation === 'vertical';
  const containerLabel = ariaLabel ?? 'Selecione um slide';

  const handleSelect = (index: number) => {
    ctx.goTo(index);
    smoothScrollToIndex(
      ctx.contentRef.current,
      index,
      prefersReducedMotion,
      ctx.orientation,
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!isTabs) return;
    const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';
    const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';
    let nextIndex: number | null = null;
    if (e.key === nextKey) nextIndex = (index + 1) % ctx.slideCount;
    else if (e.key === prevKey) nextIndex = (index - 1 + ctx.slideCount) % ctx.slideCount;
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
      aria-orientation={isTabs && isVertical ? 'vertical' : undefined}
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

// ─── PlayPause (APG: obrigatório quando autoplay ativo) ─────────────────────

function CarouselPlayPause({
  ariaLabel,
  children,
  className,
  style,
}: CarouselPlayPauseProps) {
  const ctx = useCarouselContext();
  const slots = useSlotRecipe<CarouselSlots>('carousel', { orientation: ctx.orientation });
  if (!ctx.autoplayEnabled) return null;

  const labels = ariaLabel ?? { play: 'Reproduzir autoplay', pause: 'Pausar autoplay' };
  const label = ctx.isPlaying ? labels.pause : labels.play;

  if (children) {
    return <>{children({ isPlaying: ctx.isPlaying, toggle: ctx.togglePlayPause })}</>;
  }

  return (
    <Clickable
      as="button"
      type="button"
      aria-label={label}
      aria-pressed={!ctx.isPlaying}
      onClick={ctx.togglePlayPause}
      {...slots.previous}
      className={className}
      style={style}
    >
      <Icon name={ctx.isPlaying ? 'Pause' : 'Play'} decorative size="medium" />
    </Clickable>
  );
}

// ─── displayName ────────────────────────────────────────────────────────────

CarouselRoot.displayName = 'Carousel.Root';
CarouselContent.displayName = 'Carousel.Content';
CarouselItem.displayName = 'Carousel.Item';
CarouselPrevious.displayName = 'Carousel.Previous';
CarouselNext.displayName = 'Carousel.Next';
CarouselIndicators.displayName = 'Carousel.Indicators';
CarouselPlayPause.displayName = 'Carousel.PlayPause';

/**
 * @platform shared
 *
 * Compound de carousel cross-platform com naming alinhado a shadcn/ui
 * e a11y WAI-ARIA APG (rev. 3 RFC-0034).
 *
 * Web: `scroll-snap` CSS + `IntersectionObserver` (`threshold: 0.51`)
 * para tracking ativo. Items fora da janela visível recebem `inert`
 * (TD-040). `Prev`/`Next`/indicator click → `scrollTo` respeitando
 * `prefers-reduced-motion`.
 *
 * `orientation` (horizontal default | vertical): troca eixo do
 * scroll-snap, do calc dimensional do Item e dos atalhos de teclado
 * dos Indicators (`ArrowUp`/`ArrowDown` em vertical). Indicators
 * permanecem dispostos horizontalmente — convenção visual.
 *
 * `lazy` (default `false`): items fora da janela expandida (200px de
 * margem) renderizam placeholder vazio; quando entram, montam e
 * ficam montados. Princípio Embla — virtualização é opt-in.
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
  PlayPause: CarouselPlayPause,
});

export default Carousel;
