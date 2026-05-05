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
import { FlatList, type ViewToken } from 'react-native';
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

interface CarouselItemNativeContextValue {
  index: number;
  total: number;
  slideId: string;
  width: number;
  isLast: boolean;
  gapPx: number;
}

const CarouselItemNativeContext = createContext<CarouselItemNativeContextValue | null>(null);

function useCarouselItemNativeContext(): CarouselItemNativeContextValue {
  const ctx = useContext(CarouselItemNativeContext);
  if (!ctx) {
    throw new Error('Carousel.Item must be rendered inside <Carousel.Content>.');
  }
  return ctx;
}

function parsePxToken(token: unknown): number {
  if (typeof token === 'number') return token;
  if (typeof token === 'string') {
    const parsed = parseFloat(token);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

const noopObserver = () => {};
const noopBool = (_: boolean) => {};

// ─── Root ───────────────────────────────────────────────────────────────────

function CarouselRoot({
  children,
  activeIndex: activeIndexProp,
  defaultActiveIndex = 0,
  onActiveIndexChange,
  slidesPerView = 1,
  gap = 'medium',
  autoplay = false,
  ariaLabel,
  nativeListProps,
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

  // ─── Autoplay state machine (native: sem hover/visibility) ──────────────
  const autoplayEnabled = autoplay !== false;
  const autoplayInterval = autoplay ? autoplay.interval : 0;
  const pauseOnInteraction = autoplay ? autoplay.pauseOnInteraction ?? true : false;

  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const [isFocusedWithin, setFocusedWithin] = useState(false);
  const [isInteracting, setInteracting] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const paused =
    isPausedByUser ||
    prefersReducedMotion ||
    isFocusedWithin ||
    (pauseOnInteraction && isInteracting);

  const isPlaying = autoplayEnabled && !paused;

  const togglePlayPause = useCallback(() => {
    setIsPausedByUser((prev) => !prev);
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

  // Autoplay tick (loop soft: wrap para 0 ao atingir o fim).
  useAutoplay({
    enabled: autoplayEnabled,
    interval: autoplayInterval,
    paused,
    onTick: () => {
      if (slideCount === 0) return;
      const lastVisibleIndex = slideCount - resolvedSlidesPerView;
      const nextIndex = activeIndex >= lastVisibleIndex ? 0 : activeIndex + 1;
      setActiveIndex(nextIndex);
      const list = flatListRef.current as FlatList<unknown> | null;
      list?.scrollToIndex({ index: nextIndex, animated: !prefersReducedMotion });
    },
  });

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
      observe: noopObserver,
      unobserve: noopObserver,
      nativeListProps,
      autoplayEnabled,
      isPlaying,
      togglePlayPause,
      setHovered: noopBool,
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
      nativeListProps,
      autoplayEnabled,
      isPlaying,
      togglePlayPause,
    ],
  );

  return (
    <CarouselContext.Provider value={ctxValue as never}>
      <Box
        accessibilityRole="adjustable"
        accessibilityLabel={ariaLabel}
        {...slots.root}
        className={className}
        style={style}
      >
        {children}
      </Box>
    </CarouselContext.Provider>
  );
}

// ─── Content (FlatList interno) ─────────────────────────────────────────────

function CarouselContent({ children, className, style, testID }: CarouselContentProps) {
  const ctx = useCarouselContext();
  const slots = useSlotRecipe<CarouselSlots>('carousel');
  const gapPx = parsePxToken(useToken('space', ctx.gap));
  const [viewportWidth, setViewportWidth] = useState(0);

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

  const slideWidth =
    viewportWidth > 0
      ? (viewportWidth - (ctx.resolvedSlidesPerView - 1) * gapPx) / ctx.resolvedSlidesPerView
      : 0;

  const localFlatListRef = useRef<FlatList<React.ReactElement> | null>(null);

  // Espelha o FlatList ref no context para Previous/Next acessarem.
  useEffect(() => {
    ctx.flatListRef.current = localFlatListRef.current;
    return () => {
      ctx.flatListRef.current = null;
    };
  }, [ctx]);

  const viewabilityConfigRef = useRef({ itemVisiblePercentThreshold: 51 });

  // RN exige que onViewableItemsChanged não mude entre renders.
  const handleViewableRef = useRef<(info: { viewableItems: ViewToken[] }) => void>(() => {});
  handleViewableRef.current = ({ viewableItems }) => {
    const indices = viewableItems
      .map((v) => v.index)
      .filter((i): i is number => typeof i === 'number')
      .sort((a, b) => a - b);
    if (indices.length > 0) ctx.setActiveIndex(indices[0]);
  };
  const onViewableItemsChanged = useRef(
    (info: { viewableItems: ViewToken[] }) => handleViewableRef.current(info),
  ).current;

  if (slideWidth === 0 && viewportWidth === 0) {
    // Antes do primeiro layout: render no-op para descobrir a largura.
    return (
      <Box
        testID={testID}
        {...slots.content}
        className={className}
        style={style}
        onLayout={(e: { nativeEvent: { layout: { width: number } } }) => setViewportWidth(e.nativeEvent.layout.width)}
      />
    );
  }

  return (
    <FlatList
      ref={localFlatListRef}
      testID={testID}
      horizontal
      data={items}
      keyExtractor={(_, i) => String(i)}
      showsHorizontalScrollIndicator={false}
      snapToInterval={slideWidth + gapPx}
      decelerationRate="fast"
      disableIntervalMomentum
      onLayout={(e) => setViewportWidth(e.nativeEvent.layout.width)}
      onScrollBeginDrag={() => ctx.setInteracting(true)}
      onScrollEndDrag={() => ctx.setInteracting(false)}
      getItemLayout={(_, index) => ({
        length: slideWidth + gapPx,
        offset: (slideWidth + gapPx) * index,
        index,
      })}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfigRef.current}
      renderItem={({ item, index }) => (
        <CarouselItemNativeContext.Provider
          value={{
            index,
            total: items.length,
            slideId: `${ctx.baseId}-slide-${index}`,
            width: slideWidth,
            gapPx,
            isLast: index === items.length - 1,
          }}
        >
          {item}
        </CarouselItemNativeContext.Provider>
      )}
      style={style as object | undefined}
      {...(ctx.nativeListProps ?? {})}
    />
  );
}

// ─── Item ───────────────────────────────────────────────────────────────────

function CarouselItem({ children, id, className, style }: CarouselItemProps) {
  const ctx = useCarouselContext();
  const itemCtx = useCarouselItemNativeContext();
  const slots = useSlotRecipe<CarouselSlots>('carousel');

  const slideId = id ?? itemCtx.slideId;
  const inWindow =
    itemCtx.index >= ctx.activeIndex &&
    itemCtx.index < ctx.activeIndex + ctx.resolvedSlidesPerView;

  return (
    <Box
      nativeID={slideId}
      accessibilityRole="none"
      accessibilityLabel={`${itemCtx.index + 1} de ${itemCtx.total}`}
      accessibilityElementsHidden={!inWindow}
      importantForAccessibility={inWindow ? 'auto' : 'no-hide-descendants'}
      width={itemCtx.width}
      marginRight={itemCtx.isLast ? 0 : itemCtx.gapPx}
      {...slots.item}
      className={className}
      style={style}
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

  const handlePress = () => {
    if (disabled) return;
    const target = ctx.activeIndex - 1;
    ctx.prev();
    const list = ctx.flatListRef.current as FlatList<unknown> | null;
    list?.scrollToIndex({ index: target, animated: !prefersReducedMotion });
  };

  return (
    <Clickable
      accessibilityRole="button"
      accessibilityLabel={ariaLabel ?? 'Slide anterior'}
      accessibilityState={{ disabled }}
      onClick={handlePress}
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

  const handlePress = () => {
    if (disabled) return;
    const target = ctx.activeIndex + 1;
    ctx.next();
    const list = ctx.flatListRef.current as FlatList<unknown> | null;
    list?.scrollToIndex({ index: target, animated: !prefersReducedMotion });
  };

  return (
    <Clickable
      accessibilityRole="button"
      accessibilityLabel={ariaLabel ?? 'Próximo slide'}
      accessibilityState={{ disabled }}
      onClick={handlePress}
      disabled={disabled}
      {...slots.next}
      className={className}
      style={style}
    >
      {children ?? <Icon name="ChevronRight" decorative size="medium" />}
    </Clickable>
  );
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
    const list = ctx.flatListRef.current as FlatList<unknown> | null;
    list?.scrollToIndex({ index, animated: !prefersReducedMotion });
  };

  return (
    <Box
      accessibilityRole={isTabs ? 'tablist' : 'none'}
      accessibilityLabel={containerLabel}
      {...slots.indicators}
      className={className}
      style={style}
    >
      {indices.map((index) => {
        const active = index === ctx.activeIndex;
        const slideId = `${ctx.baseId}-slide-${index}`;
        const tabId = `${ctx.baseId}-indicator-${index}`;

        if (children) {
          return (
            <React.Fragment key={index}>
              {children({ index, active, goTo: () => handleSelect(index), slideId, total: ctx.slideCount })}
            </React.Fragment>
          );
        }

        const indicatorStyle = (active ? slotsActive : slotsInactive).indicator;

        return (
          <Clickable
            key={index}
            nativeID={tabId}
            accessibilityRole={isTabs ? 'tab' : 'button'}
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Ir para slide ${index + 1}`}
            onClick={() => handleSelect(index)}
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
  const slots = useSlotRecipe<CarouselSlots>('carousel');
  if (!ctx.autoplayEnabled) return null;

  const labels = ariaLabel ?? { play: 'Reproduzir autoplay', pause: 'Pausar autoplay' };
  const label = ctx.isPlaying ? labels.pause : labels.play;

  if (children) {
    return <>{children({ isPlaying: ctx.isPlaying, toggle: ctx.togglePlayPause })}</>;
  }

  return (
    <Clickable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: !ctx.isPlaying }}
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
 * @platform native
 *
 * Carousel em React Native — paridade de API com web (RFC-0034 rev. 3).
 *
 * - `Carousel.Content` é uma `FlatList` horizontal interna com
 *   `snapToInterval` + `getItemLayout` + `onViewableItemsChanged`
 *   (`itemVisiblePercentThreshold: 51`). `Children.toArray` extrai os
 *   items para `data`.
 * - `Carousel.Item` recebe `width` + `marginRight` calculados pelo
 *   Content baseado em `slidesPerView` resolvido pelo breakpoint atual.
 *   `accessibilityElementsHidden` quando fora da janela visível.
 * - `Carousel.Previous`/`Next` chamam `flatListRef.scrollToIndex`.
 * - `Carousel.Indicators` mantém o **dual pattern** APG (tabs vs group)
 *   via `accessibilityRole`. Sem keyboard nav (touch-only).
 * - `prefers-reduced-motion` será considerado em PR2 (depende de
 *   TD-032).
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
