# RFC-0034 — Carousel: componente canônico cross-platform

**Status**: **Implemented (2026-05-05, rev. 3)** — v1 completa (PR1 + PR2 A/B/C/D)
**Autores**: arbor-ds-arch
**Data**: 2026-05-03
**Origem**: review R9 (achado E-Inex-1). Componente declarado nos cenários de produto (`CLAUDE.md` skill — e-commerce vitrine, landing pages, listas) e nunca implementado. `src/components/carousel/` está vazio desde Out/2025.

**Histórico de revisões**
- **rev. 1 (2026-05-03)**: draft inicial.
- **rev. 2 (2026-05-03)**: refina os pontos vagos da rev. 1 — define IO para tracking web, troca `FlatList` por `ScrollView` em native, formaliza máquina de estado de autoplay, move `loop` para PR2, condiciona `inert` à TD-040.
- **rev. 3 (2026-05-03)**: análise crítica do mercado (Embla, Swiper, shadcn/ui, Mantine, FlatList, FlashList, reanimated-carousel, WAI-ARIA APG) — 9 deltas: nomenclatura alinhada com shadcn (`Content/Item/Previous`), volta a `FlatList` em native (precedente FlatList "basic" vence mainstream), `aria-label` do slide sem palavra "slide" (APG), Tabs pattern condicional para indicadores, `Carousel.PlayPause` obrigatório quando autoplay (APG), `onViewableItemsChanged` em vez de `onMomentumScrollEnd`, escape hatch `nativeListProps`, virtualização vira default "de graça" (FlatList windowSize), FlashList adiada explicitamente (bug Android conhecido).

**Implementação**: PR1 (`e1c4f66`) → PR2.A (`936ca5c`) → PR2.C+D (próximo commit). 1081/1081 testes verdes; lint+typecheck clean; `check-platform-contract --strict` + `check-no-color-literal` verdes.

---

## Motivação

Cada produto consumidor reinventa carrossel hoje. Riscos concretos:
- **A11y inconsistente** — WAI-ARIA APG é categórico sobre `role="region" aria-roledescription="carousel"`, label do slide sem a palavra "slide", Tabs pattern preferível ao "group de botões dot" (APG: "least friendly for keyboard users"), botão pause/play obrigatório quando autoplay.
- **Cross-platform divergente** — web idiomático é `scroll-snap` CSS-only; native idiomático é `FlatList` horizontal com `snapToInterval` + `getItemLayout`. Sem componente canônico, cada produto resolve diferente.
- **Motion/autoplay** — autoplay sem `prefers-reduced-motion` é hostil; ignorar `pageHidden`/`focusWithin` é desperdício de bateria e barreira de acessibilidade.
- **Lazy loading** — slides com mídia pesada precisam montar/desmontar fora da janela visível; FlatList resolve no native, `inert` ajuda no web.

Não há justificativa para deixar v1 sem Carousel — está em todos os cenários declarados.

---

## Proposta

### Anatomia (alinhada com shadcn/ui + WAI-ARIA APG)

Compound-component clássico, padrão estabelecido pela comunidade (shadcn/ui, Mantine, Swiper):

```tsx
<Carousel
  defaultActiveIndex={0}
  onActiveIndexChange={(i) => …}
  ariaLabel="Produtos em destaque"
  slidesPerView={{ base: 1, md: 2, lg: 4 }}
  gap="medium"
>
  <Carousel.Content>
    <Carousel.Item>{…}</Carousel.Item>
    <Carousel.Item>{…}</Carousel.Item>
    <Carousel.Item>{…}</Carousel.Item>
  </Carousel.Content>

  <Carousel.Previous />
  <Carousel.Next />

  <Carousel.Indicators />
</Carousel>
```

**Nomenclatura justificada:** shadcn/ui (wrapper de Embla; padrão de mercado moderno) usa `Carousel / CarouselContent / CarouselItem / CarouselPrevious / CarouselNext`. Adotamos os mesmos nomes — facilita migração para quem vem de shadcn, alinha com vocabulário aprendido pela comunidade.

> **Diferença vs rev. 2:** o nome `Viewport` desaparece. `Content` agora cobre dois papéis (overflow + flex container). Decisão consciente: shadcn não separa, e o ganho de override granular não compensa a camada extra.

### API pública (PR1)

```ts
interface CarouselRootProps {
  children: ReactNode;

  /** Índice ativo controlado. */
  activeIndex?: number;
  defaultActiveIndex?: number;
  onActiveIndexChange?: (index: number) => void;

  /** Quantos slides exibir simultaneamente. Number ou responsive object. */
  slidesPerView?: number | ResponsiveValue<number>;

  /** Espaço entre slides. Token de spacing. */
  gap?: SpacingToken;

  /** Nome acessível obrigatório do carrossel. */
  ariaLabel: string;

  /**
   * Escape hatch para passar props arbitrárias à FlatList interna em native.
   * Útil para `windowSize`, `removeClippedSubviews`, `initialNumToRender`.
   * No-op no web. Use com parcimônia — abre a anatomia da implementação.
   */
  nativeListProps?: Partial<FlatListProps<ReactElement>>;
}

interface CarouselItemProps {
  children: ReactNode;
  /** Identificador estável; usado para `aria-controls` dos indicadores. Auto-gerado se ausente. */
  id?: string;
}

interface CarouselIndicatorsProps {
  /** Render prop opcional para customizar cada dot. Default = dot themable via slot recipe. */
  children?: (args: { index: number; active: boolean; goTo: () => void; slideId: string }) => ReactNode;
}

// Carousel.Previous / Next são "clean slots" sem props além de className/style.
// Carousel.PlayPause aparece em PR2; obrigatório quando autoplay ativa.
```

**`autoplay`, `loop`, `orientation`, `lazy` ficam fora de PR1** (ver §Plano de execução).

### Cross-platform

| Aspecto | Web | Native |
|---|---|---|
| Render do container | `Box` com `overflow-x: auto`, `scroll-snap-type: x mandatory` | `FlatList` horizontal com `snapToInterval={slideWidth + gap}`, `decelerationRate="fast"`, `disableIntervalMomentum` |
| Item | `Box` com `scroll-snap-align: start` | item da `FlatList` (children declarativo convertido internamente) |
| Tracking de slide ativo | `IntersectionObserver` único, `root: container`, `threshold: 0.51`. Ativo = primeiro item ≥51% visível | `onViewableItemsChanged` com `viewabilityConfig={{ itemVisiblePercentThreshold: 51 }}` |
| Slide width responsive | CSS: `calc((100% - (n-1)*gap) / n)` | JS: `useState` + `onLayout` no container; antes do primeiro layout, render no-op |
| Previous/Next | `Clickable` que chama `container.scrollTo({ left, behavior })` | `flatListRef.scrollToIndex({ index, animated, viewPosition: 0 })` |
| Indicators (≤7 + slidesPerView=1) | `role="tablist"` + cada dot é `role="tab"` + setas trocam slide (APG idiomático) | mesma lógica, `accessibilityRole="tab"` + `accessibilityState={{ selected }}` |
| Indicators (>7 ou slidesPerView>1) | `role="group"` + botões individuais com `aria-controls` + `aria-current` | mesma lógica, `accessibilityRole="button"` + `accessibilityState={{ selected }}` |
| Item fora da janela | `inert` (TD-040 fechada) — atributo HTML padrão | `accessibilityElementsHidden` + `importantForAccessibility="no-hide-descendants"`. FlatList já desmonta via `windowSize` |
| Keyboard | `ArrowLeft`/`ArrowRight` quando container tem foco; `Home`/`End` para extremos; `Tab` move para Previous/Next/Indicators | n/a (touch) |
| Animação programática | `behavior: prefersReducedMotion ? 'auto' : 'smooth'` | `animated: !prefersReducedMotion`. PR1 gateia native em `Platform.OS === 'web'` até **TD-032** fechar |
| Virtualização | DOM monta tudo (precedente Embla) | **De graça** via FlatList `windowSize=3` default; ajustável via `nativeListProps` |

A API pública é **idêntica** entre plataformas. A especialização mora em `carousel-content.tsx` × `carousel-content.native.tsx`.

#### Por que `FlatList` no native, não `ScrollView`

Mercado RN trata FlatList como padrão para carousel "basic" — vence em mainstream porque tem **menos comunicação nativa overhead** que reanimated-carousel (quando não há animação custom) e ainda **virtualiza de graça**. Vitrine de e-commerce com 50–200 produtos funciona out-of-the-box sem o consumidor pensar em performance.

ScrollView só fazia sentido se `Children.toArray` fosse impeditivo. Não é — Embla, shadcn, Mantine, Swiper **todos** convertem children declarativo para estrutura interna (web) e o custo é trivial.

#### Por que **não** `FlashList` em v1

[Bug Android conhecido (#1153)](https://github.com/Shopify/flash-list/issues/1153): `snapToInterval` com float screen widths quebra alinhamento. Risco de produção real em vitrines de e-commerce (caso de uso primário). Migration FlatList→FlashList é trivial quando o issue fechar (API quase idêntica).

#### Por que `IntersectionObserver`, não `onScroll` (web)

- Robusto a `slidesPerView` responsive sem reler `clientWidth` a cada scroll
- Funciona com items heterogêneos
- Não requer throttle/RAF manual
- Suporte universal (Safari 12.1+, todos navegadores tier-A)
- SSR/JSDOM sem IO: `activeIndex = controlled || defaultActiveIndex || 0`. `setupTests` web já tem shim de IO.

#### Por que `onViewableItemsChanged`, não `onMomentumScrollEnd` (native)

`onViewableItemsChanged` é a API idiomática de FlatList para "qual item está visível agora". Suporta `itemVisiblePercentThreshold` análogo ao `threshold` de IO — ganha simetria web↔native. `onMomentumScrollEnd` é mais low-level e exige cálculo manual do índice.

#### Por que **não** virtualização default no web

Embla (~7KB; 800K downloads/semana) — referência canônica e wrappada por shadcn/Mantine — **não inclui virtualização por design**. Para >100 items, comunidade implementa sob demanda via plugin (`embla-carousel-react-virtualization`). Adotamos o mesmo princípio: `inert` em items fora da janela (CSS já mantém DOM montado mas painted off-screen). Caso real de virtualização → opt-in PR3 com prop `virtualizeWhenAtLeast?: number`.

### A11y (alinhada com WAI-ARIA APG 2025)

- `Carousel` (root) → `role="region"` + `aria-roledescription="carousel"` + `aria-label`.
- `Carousel.Item` → `role="group"` + `aria-roledescription="slide"` + `aria-label="N de M"` (**sem** a palavra "slide" — APG é categórico: o `roledescription` já fornece o termo).
- `Carousel.Previous`/`Next` → `<Clickable>` com `aria-label="Slide anterior"`/`"Próximo slide"` (textos via TD-033 quando resolvida; default pt-BR no PR1).
- `Carousel.Indicators` — **dois patterns condicionais**:
  - **Tabs pattern** (APG idiomático): `slidesPerView=1` **e** #items ≤ 7. Dots viram `role="tab"` dentro de `role="tablist"`; setas trocam slide. Mais friendly ao teclado (1 tab stop coletivo).
  - **Group pattern**: caso contrário. Dots viram botões individuais dentro de `role="group"`. Cada um é tab stop (APG: "least friendly" — usar só quando Tabs não cabe).
- Items fora da janela → `inert` (TD-040 fechada).
- `aria-live="off"` em PR1 — sem autoplay, não há mudança automática a anunciar. PR2 ativa `polite` quando autoplay roda.
- Touch target 44×44 nos indicators via overlay `::before` (padrão TD-016).

### Motion

- Programatic scroll respeita `prefers-reduced-motion` (web) e `accessibilityReduceMotion` (native, condicionado a TD-032).
- `transition()` themable já existente; nada novo na engine.

### Recipe

```ts
defineSlotRecipe('carousel', {
  slots: ['root', 'content', 'item', 'previous', 'next', 'indicators', 'indicator', 'playPause'],
  variants: {
    /* PR2: orientation, autoplay state */
  },
});
```

Identidade visual themable via override do slot recipe + tokens (`sizes.control.*`, `colors.surface.*`, `colors.brand.*`). Sem cor literal, sem px hardcoded.

### Máquina de estado do autoplay (PR2 — referência adiantada)

```
autoplay ativo  ⇔
  enabled === true
  AND !prefersReducedMotion
  AND !isHovered            (web; default true em pauseOnHover)
  AND !isFocusedWithin      (default true — comportamento, não prop)
  AND !isInteracting        (touch/scroll em curso, last 1500ms)
  AND document.visibilityState === 'visible'  (default true — comportamento, não prop)
  AND !isPausedByUser        (botão Carousel.PlayPause)
```

`pauseOnFocusWithin` e `pauseOnPageHidden` **não viram props** — são comportamento. `Carousel.PlayPause` é **obrigatório quando autoplay ativa** (APG requirement) — renderizado automaticamente no compound se `autoplay !== false`.

API PR2:
```ts
autoplay?: false | { interval: number; pauseOnHover?: boolean; pauseOnInteraction?: boolean };
```

---

## Plano de execução

### Pré-PR1 (gates)

- ✅ **TD-040 fechada** (commit `fe25121`): engine bloqueia `inert` em native + testes documentam suporte web.

### PR1 — anatomia + a11y core

- Compound `Carousel.{Root,Content,Item,Previous,Next,Indicators}` cross-platform (sem `PlayPause` — vem em PR2 com autoplay)
- `slidesPerView` (number e `ResponsiveValue<number>`)
- Native: `FlatList` interno + `Children.toArray` adapter; `nativeListProps` escape hatch
- Tracking ativo: IO no web, `onViewableItemsChanged` no native
- Slide width responsive: CSS calc no web, `useState`+`onLayout` no native
- `Previous`/`Next` + scroll programático respeitando `prefers-reduced-motion` (web; native gated em `Platform.OS === 'web'` até TD-032)
- Keyboard web: `ArrowLeft`/`ArrowRight`/`Home`/`End`
- A11y completa (region/slide/aria-roledescription/aria-current/inert; **`aria-label="N de M"`** no slide)
- `aria-live="off"` (sem autoplay)
- `Indicators` com **dual pattern** (Tabs ≤7+spv1 / Group caso contrário) + render prop opcional + default themable
- Slot recipe `carousel`
- Stories + testes web + native (incluindo "drag → activeIndex muda" via mock IO web; mock de `onViewableItemsChanged` native)
- Sem `loop`, sem `autoplay`, sem `orientation`, sem `lazy`

### PR2 — motion + variantes

- `autoplay` com máquina de estado completa (web + native; native condicional a TD-032 fechada)
- **`Carousel.PlayPause` obrigatório quando autoplay ativa** (APG requirement)
- `loop`: caminho A "loop com clones" vs caminho B "loop soft" — decisão final aqui. Recomendação preliminar: B em v1, A só se reclamo real
- `orientation: 'vertical'`
- `lazy?: boolean` — items fora da janela não montam children pesados (web; FlatList já faz no native)
- `aria-live="polite"` quando autoplay ativo

### PR3 (não escopo de v1) — virtualização web opt-in

- `virtualizeWhenAtLeast?: number` — abre virtualização web quando #items >= N. Implementação custom (precedente: comunidade Embla via plugin). Só quando reclamo real materializar.

### Decisões deliberadas

1. **Nomenclatura shadcn/ui** (`Content/Item/Previous`) — alinha com padrão de mercado moderno, facilita migração de quem vem de shadcn.
2. **`FlatList` no native, não `ScrollView`** — mainstream RN (basic carousel); vence em vitrines de produto sem custo de animação custom; virtualização de graça.
3. **Não `FlashList` em v1** — bug Android `snapToInterval` é risco real; migração trivial quando issue fechar.
4. **Não virtualização default no web** — precedente Embla (líder de mercado): virtualização é opt-in, não default.
5. **`aria-label="N de M"`** (sem "slide") — APG categórico; rev. 2 errava aqui.
6. **Tabs pattern condicional para indicadores** — APG considera "group de botões" o pior para teclado.
7. **`Carousel.PlayPause` obrigatório quando autoplay** — APG requirement; renderizado automaticamente.
8. **`onViewableItemsChanged` em vez de `onMomentumScrollEnd`** — API idiomática FlatList; simétrica com IO no web.
9. **`nativeListProps` como escape hatch** — abre `windowSize`/`removeClippedSubviews`/`initialNumToRender` sem inflar a API pública. Precedente: aprendizado RFC-0026 (FileUpload).
10. **Sem dependência externa** — Embla cabe em 7KB headless; replicar a essência (snap + IO + APG) cabe no Arbor sem importar lib. Reanimated-carousel só se demanda real de animação custom aparecer (RFC futura).
11. **`children → data + renderItem` no native** — única forma de manter compound API uniforme. Custo `Children.toArray` por render é mitigado por `useMemo` keyado em children. Embla/shadcn/Mantine fazem o equivalente conceitual no web.

---

## Riscos / Trade-offs

| Risco | Mitigação |
|---|---|
| `scroll-snap` em mobile web tem quirks (Safari iOS) | Testar matriz; documentar comportamento em CONTRIBUTING |
| `slidesPerView` responsive em native depende de `onLayout` | Antes do primeiro layout, render no-op (skeleton); requisito de largura no pai documentado |
| TD-032 não fechada → `prefers-reduced-motion` native sub-optimal | PR1 gateia native em `Platform.OS === 'web'`; PR2 bloqueia em TD-032 |
| `Children.toArray` no FlatList custa por render | `useMemo` keyado em children ref; benchmark contra ScrollView no PR1 |
| FlatList `getItemLayout` falha se item width muda mid-scroll | API public garante width homogêneo via `slidesPerView`+`onLayout` — não é caminho aberto |
| Tabs pattern em ≤7+spv1 vira Group em >7 — switch implícito | Documentar em Stories; Story explícita de "8+ items" mostra group fallback |
| Loop com clones tem zona de bug histórica em libs concorrentes | PR2 começa por loop soft; clones só sob demanda real |

---

## Critérios de aceite

- [ ] Compound `Carousel.{Root,Content,Item,Previous,Next,Indicators}` — web + native paritários
- [ ] `defineSlotRecipe('carousel')` themable, sem cor literal/px hardcoded
- [ ] Web: `IntersectionObserver` para detecção; `inert` em items fora da janela
- [ ] Native: `FlatList` com `snapToInterval`+`getItemLayout`+`onViewableItemsChanged`; `Children.toArray` adapter
- [ ] `slidesPerView` aceita `number | ResponsiveValue<number>`; `onLayout` calcula slide width em native
- [ ] `nativeListProps` escape hatch tipado e documentado
- [ ] `Previous`/`Next`/indicator click → scroll com `behavior: 'smooth' | 'auto'` conforme `prefers-reduced-motion`
- [ ] Keyboard nav web: `ArrowLeft`/`ArrowRight`/`Home`/`End`
- [ ] A11y verificada: NVDA + VoiceOver iOS + TalkBack Android
- [ ] `aria-label="N de M"` no slide (sem "slide" — APG)
- [ ] `Indicators` dual pattern: Tabs (≤7+spv1) / Group (caso contrário) — testes cobrem switch
- [ ] `aria-live="off"` em PR1 (autoplay = PR2 → `polite` + `Carousel.PlayPause` obrigatório)
- [ ] Stories: 1/2/4 slides simultâneos; responsive (`{ base, md, lg }`); render prop em `Indicators`; controlled vs uncontrolled; **8+ items mostrando Group fallback**
- [ ] Testes web + native verdes; teste explícito de "drag → activeIndex muda"
- [ ] CONTRIBUTING §Carousel: requisito de largura no pai (RN); trade-off FlatList vs FlashList (futuro); `nativeListProps` como escape hatch

---

## Dependências

- ✅ **TD-040** — engine `inert` (Resolved 2026-05-03, commit `fe25121`).
- **TD-032** (`usePrefersReducedMotion.native` ausente) — PR1 gateia native em `Platform.OS === 'web'`; PR2 bloqueia em TD-032.
- **TD-033** (labels hardcoded) — textos default ("Slide anterior" etc.) entram no escopo da resolução de TD-033, não desta RFC.

---

## Notas de evolução

- **v1 (PR1+PR2)**: horizontal, items homogêneos, sem zoom/parallax.
- **PR3**: virtualização web opt-in (`virtualizeWhenAtLeast`).
- **v2 (não escopo)**: efeitos (cover-flow, parallax) — abrir RFC dedicada quando demanda materializar; provavelmente reanimated-carousel vira peerDep.
- **FlashList**: reavaliar em v2 quando bug Android `snapToInterval` fechar; migração trivial.
