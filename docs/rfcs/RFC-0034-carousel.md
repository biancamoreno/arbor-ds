# RFC-0034 — Carousel: componente canônico cross-platform

**Status**: **Draft (2026-05-03, rev. 2)**
**Autores**: arbor-ds-architect
**Data**: 2026-05-03
**Origem**: review R9 (achado E-Inex-1). Componente declarado nos cenários de produto (`CLAUDE.md` skill — e-commerce vitrine, landing pages, listas) e nunca implementado. `src/components/carousel/` está vazio desde Out/2025.

**Histórico de revisões**
- **rev. 1 (2026-05-03)**: draft inicial.
- **rev. 2 (2026-05-03)**: refina os pontos vagos da rev. 1 — define IO para tracking web, troca `FlatList` por `ScrollView` em native, formaliza máquina de estado de autoplay, move `loop` para PR2, condiciona `inert` à TD-040.

---

## Motivação

Cada produto consumidor reinventa carrossel hoje. Riscos concretos:
- **A11y inconsistente** — `role="region"` + `aria-roledescription="carousel"`, anúncio de slide ativo, controles `prev/next` com nomes acessíveis.
- **Cross-platform divergente** — web idiomático é `scroll-snap` CSS-only; native é `ScrollView horizontal` com `snapToInterval`. Sem componente canônico, cada produto resolve de jeito diferente.
- **Motion/autoplay** — autoplay sem `prefers-reduced-motion` é hostil; ignorar `pageHidden`/`focusWithin` é desperdício de bateria e barreira de acessibilidade.
- **Lazy loading** — slides com mídia pesada precisam montar/desmontar fora da janela visível.

Não há justificativa para deixar v1 sem Carousel — está em todos os cenários declarados. Mas o escopo merece RFC dedicada porque a API impacta vitrines de e-commerce (consumidor mais sensível a regressão) e a paridade web↔native é não-trivial.

---

## Proposta

### Anatomia

Compound-component clássico, padrão Tabs/Accordion:

```tsx
<Carousel
  defaultActiveIndex={0}
  onActiveIndexChange={(i) => …}
  ariaLabel="Produtos em destaque"
  slidesPerView={{ base: 1, md: 2, lg: 4 }}
  gap="medium"
>
  <Carousel.Viewport>
    <Carousel.Track>
      <Carousel.Slide>{…}</Carousel.Slide>
      <Carousel.Slide>{…}</Carousel.Slide>
      <Carousel.Slide>{…}</Carousel.Slide>
    </Carousel.Track>
  </Carousel.Viewport>

  <Carousel.Prev />
  <Carousel.Next />

  <Carousel.Indicators />
</Carousel>
```

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
}

interface CarouselSlideProps {
  children: ReactNode;
  /** Identificador estável; usado para aria-controls dos indicadores. Auto-gerado se ausente. */
  id?: string;
}

interface CarouselIndicatorsProps {
  /** Render prop opcional para customizar cada dot. Default = dot themable via slot recipe. */
  children?: (args: { index: number; active: boolean; goTo: () => void; slideId: string }) => ReactNode;
}

// Carousel.Prev / Next são "clean slots" sem props além de className/style.
// Carousel.Viewport e Carousel.Track existem para que recipes possam estilizar
// independentemente (viewport tem overflow:hidden; track é o flex container que desliza).
```

**`autoplay`, `loop`, `orientation`, `lazy` ficam fora de PR1** (ver §Plano de execução).

### Cross-platform

| Aspecto | Web | Native |
|---|---|---|
| Render do track | `Box` com `overflow-x: auto`, `scroll-snap-type: x mandatory` | `ScrollView` horizontal com `pagingEnabled` (quando `slidesPerView=1`) ou `snapToInterval={slideWidth+gap}` + `decelerationRate="fast"` |
| Slide | `Box` com `scroll-snap-align: start` | `View` com `width={slideWidth}` |
| Tracking de slide ativo | `IntersectionObserver` único, `root: viewport`, `threshold: 0.51`. Ativo = primeiro slide ≥51% visível | `onMomentumScrollEnd` → `Math.round(contentOffset.x / (slideWidth + gap))` |
| Slide width responsive | CSS: `calc((100% - (n-1)*gap) / n)` | JS: `useState` + `onLayout` no Viewport para obter largura, dividir por `slidesPerView` |
| Prev/Next | `Clickable` que chama `viewport.scrollTo({ left, behavior })` | `scrollViewRef.scrollTo({ x, animated })` |
| Indicators | mapeia slides → `Clickable` com `aria-controls={slideId}` + `aria-current` | mesma lógica, `accessibilityState.selected` |
| Slide fora da janela | `inert` (depende de **TD-040**); fallback `aria-hidden + tabIndex=-1` em descendentes | `accessibilityElementsHidden` + `importantForAccessibility="no-hide-descendants"` |
| Keyboard | `ArrowLeft`/`ArrowRight` quando viewport tem foco; `Home`/`End` para extremos | n/a (touch) |
| Animação programática | `behavior: prefersReducedMotion ? 'auto' : 'smooth'` | `animated: !prefersReducedMotion`. Em native, `prefersReducedMotion` depende de **TD-032**; gate temporário `Platform.OS === 'web'` no PR1 |

A API pública é **idêntica** entre plataformas. Renderização especializa-se em `.tsx` × `.native.tsx`.

#### Por quê `ScrollView`, não `FlatList`

Carousel não é uma lista virtualizada. Caso típico: 3–10 slides, mídia já carregada (vitrine, banners, onboarding). `ScrollView` dá controle preciso, paridade visual com web e simplicidade. Se um produto real precisar virtualizar 50+ slides com mídia pesada, o caminho não é dobrar Carousel sobre `FlatList` — é abrir RFC para um componente novo (`MediaCarousel`/`Gallery`) com contrato adequado a virtualização. **Não inflar a API atual por antecipação.**

#### Por quê `IntersectionObserver`, não `onScroll`

- Robusto a `slidesPerView` responsive sem reler `clientWidth` a cada scroll
- Funciona com slides heterogêneos (largura variável) — útil para hero+thumb mistos
- Não requer throttle/RAF manual
- Suporte universal (Safari 12.1+, todos navegadores tier-A)
- Em SSR/JSDOM sem IO, `activeIndex = controlled || defaultActiveIndex || 0`. `setupTests` web já tem shim de IO.

### A11y

- `Carousel.Root` → `role="region" aria-roledescription="carousel" aria-label`.
- `Carousel.Slide` → `role="group" aria-roledescription="slide" aria-label="Slide N de M"`.
- `Carousel.Prev`/`Next` → `<Clickable>` com `aria-label="Slide anterior"`/`"Próximo slide"` (textos via TD-033 quando resolvida; default pt-BR no PR1).
- `Carousel.Indicators` → cada dot é `<Clickable>` com `aria-controls={slideId}` + `aria-current={active ? 'true' : undefined}`. Touch target 44×44 via overlay `::before` (padrão TD-016).
- Slides fora da janela → `inert` (PR1 depende de **TD-040** entregar suporte na engine; sem ela, fallback `aria-hidden + tabIndex=-1`).
- `aria-live="off"` em PR1 — sem autoplay, não há mudança automática a anunciar. PR2 ativa `polite` quando autoplay roda.

### Motion

- Programatic scroll respeita `prefers-reduced-motion` (web) e `accessibilityReduceMotion` (native, condicionado a TD-032).
- `transition()` themable já existente; nada novo na engine.

### Recipe

```ts
defineSlotRecipe('carousel', {
  slots: ['root', 'viewport', 'track', 'slide', 'prev', 'next', 'indicators', 'indicator'],
  variants: {
    /* PR2: orientation */
  },
});
```

Identidade visual (background dos botões prev/next, formato do indicador, tamanho do dot) é themable via override do slot recipe + tokens (`sizes.control.*`, `colors.surface.*`, `colors.brand.*`). **Sem cor literal, sem px hardcoded.**

### Máquina de estado do autoplay (PR2 — referência adiantada)

```
autoplay ativo  ⇔
  enabled === true
  AND !prefersReducedMotion
  AND !isHovered            (web; default true em pauseOnHover)
  AND !isFocusedWithin      (default true — comportamento, não prop)
  AND !isInteracting        (touch/scroll em curso, last 1500ms)
  AND document.visibilityState === 'visible'  (default true — comportamento, não prop)
```

`pauseOnFocusWithin` e `pauseOnPageHidden` **não viram props** — são comportamento. Não há razão legítima para desligar (a11y + economia de bateria). Documentar.

API PR2:
```ts
autoplay?: false | { interval: number; pauseOnHover?: boolean; pauseOnInteraction?: boolean };
```

---

## Plano de execução

### Pré-PR1 (bloqueio)

- **TD-040** (nova): engine suporta `inert`. ~30 min de trabalho. Bloqueia PR1 — sem `inert`, o fallback (`aria-hidden + tabIndex=-1` via varredura DOM) tem custo de runtime evitável.

### PR1 — anatomia + a11y core

- Compound `Carousel.{Root,Viewport,Track,Slide,Prev,Next,Indicators}` cross-platform
- `slidesPerView` (number e `ResponsiveValue<number>`)
- Tracking ativo: IO no web, `onMomentumScrollEnd` no native
- Slide width responsive: CSS calc no web, `useState`+`onLayout` no native
- `Prev`/`Next` + scroll programático respeitando `prefers-reduced-motion` (web; native gated em `Platform.OS === 'web'` até TD-032)
- Keyboard web: `ArrowLeft`/`ArrowRight`/`Home`/`End`
- A11y completa (region/slide/aria-roledescription/aria-current/inert)
- `aria-live="off"` (sem autoplay)
- `Indicators` com render prop opcional + default themable
- Slot recipe `carousel`
- Stories + testes web + native (incluindo "drag → activeIndex muda" via mock IO entries)
- Sem `loop`, sem `autoplay`, sem `orientation`, sem `lazy`

### PR2 — motion + variantes

- `autoplay` com máquina de estado completa (web + native; native condicional a TD-032 fechada)
- `loop`: decisão final aqui — caminho A "loop com clones" (Embla-style) ou caminho B "loop soft" (reset visual ao chegar na borda). Recomendação preliminar: B em v1, A só se reclamo real
- `orientation: 'vertical'`
- `lazy?: boolean` — slides fora da janela não montam children pesados
- `aria-live="polite"` quando autoplay ativo

### Decisões deliberadas

1. **`ScrollView`, não `FlatList`** — Carousel ≠ lista virtualizada.
2. **IO threshold = 0.51, primeiro slide visível define ativo** — não centralizado; alinhado com UX de e-commerce ("o próximo produto" entra na viewport).
3. **`pauseOnFocusWithin` e `pauseOnPageHidden` são comportamento, não prop** — a11y + bateria.
4. **`loop` adiada para PR2** — implementação séria é não-trivial; melhor não entregar do que entregar quebrado.
5. **`inert` antes do `aria-hidden`** — engine ganha suporte (TD-040), evita varredura DOM em runtime.
6. **Sem dependência externa (Embla/Swiper/Splide)** — mantém princípio "zero deps de runtime"; reabrir só se 1+ produto reportar bug não trivial em scroll-snap.

---

## Riscos / Trade-offs

| Risco | Mitigação |
|---|---|
| `scroll-snap` em mobile web tem quirks (Safari iOS) | Testar matriz; documentar comportamento em CONTRIBUTING |
| `slidesPerView` responsive em native depende de `onLayout` | Antes do primeiro layout, render no-op (skeleton); requisito de largura no pai documentado |
| TD-032 não fechada → autoplay native sub-optimal | PR1 não usa autoplay; PR2 bloqueia em TD-032 |
| TD-040 não fechada → `inert` indisponível | PR1 cai no fallback `aria-hidden + tabIndex=-1` (custo aceitável, mas evitável) |
| Loop com clones tem zona de bug histórica em libs concorrentes | PR2 começa por loop soft; clones só sob demanda real |

---

## Critérios de aceite

- [ ] Compound `Carousel.{Root,Viewport,Track,Slide,Prev,Next,Indicators}` — web + native paritários
- [ ] `defineSlotRecipe('carousel')` themable, sem cor literal/px hardcoded
- [ ] `IntersectionObserver` para detecção web; `onMomentumScrollEnd` para native
- [ ] `slidesPerView` aceita `number | ResponsiveValue<number>`; `onLayout` calcula slide width em native
- [ ] `inert` suportado pela engine (TD-040 fechada) e aplicado em slides fora da janela; fallback `aria-hidden + tabIndex=-1` documentado
- [ ] `Prev`/`Next`/indicator click → `scrollTo` com `behavior: 'smooth' | 'auto'` conforme `prefers-reduced-motion`
- [ ] Keyboard nav web: `ArrowLeft`/`ArrowRight`/`Home`/`End`
- [ ] A11y verificada: NVDA + VoiceOver iOS + TalkBack Android (region+aria-roledescription+aria-current)
- [ ] `aria-live="off"` em PR1 (autoplay = PR2 → `polite`)
- [ ] Stories: 1/2/4 slides simultâneos; responsive (`{ base: 1, md: 2, lg: 4 }`); render prop em `Indicators`; controlled vs uncontrolled
- [ ] Testes web + native verdes; teste explícito de "drag → activeIndex muda" (mock IO entries no web; `onMomentumScrollEnd` simulado no native)
- [ ] CONTRIBUTING §Carousel: requisito de largura no pai (RN); trade-off ScrollView vs futura `MediaList` para virtualização

---

## Dependências

- **TD-040** (nova): engine `inert` — bloqueia PR1.
- **TD-032** (`usePrefersReducedMotion.native` ausente) — PR1 gateia native em `Platform.OS === 'web'`; PR2 bloqueia em TD-032.
- **TD-033** (labels hardcoded) — textos default ("Slide anterior" etc.) entram no escopo da resolução de TD-033, não desta RFC.

---

## Notas de evolução

- **v1 (PR1+PR2)**: horizontal, slides homogêneos, sem zoom/parallax.
- **v2 (não escopo)**: efeitos (cover-flow, parallax) — abrir RFC dedicada quando demanda materializar.
- **Virtualização (não escopo)**: caso real de 50+ slides com mídia pesada → RFC para componente novo (`MediaCarousel`/`Gallery`), não opção desta API.
