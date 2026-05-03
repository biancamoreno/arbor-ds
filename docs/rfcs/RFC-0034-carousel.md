# RFC-0034 — Carousel: componente canônico cross-platform

**Status**: **Draft (2026-05-03)**
**Autores**: arbor-ds-architect
**Data**: 2026-05-03
**Origem**: review R9 (achado E-Inex-1). Componente declarado nos cenários de produto (`CLAUDE.md` skill — e-commerce vitrine, landing pages, listas) e nunca implementado. `src/components/carousel/` está vazio desde Out/2025.

---

## Motivação

Cada produto consumidor reinventa carrossel hoje. Riscos concretos:
- **A11y inconsistente** — `role="region"` + `aria-roledescription="carousel"`, anúncio de slide ativo, controles `prev/next` com nomes acessíveis.
- **Cross-platform divergente** — web idiomático é `scroll-snap` CSS-only; native é `FlatList horizontal` com `snapToInterval`. Sem componente canônico, cada produto resolve de jeito diferente.
- **Motion/autoplay** — autoplay sem `prefers-reduced-motion` é hostil.
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
  autoplay={false}             // ou { interval: 5000, pauseOnHover: true }
  loop={false}
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

  <Carousel.Indicators />     {/* dots clicáveis com aria-current */}
</Carousel>
```

### API pública (resumo)

```ts
interface CarouselRootProps {
  children: ReactNode;
  /** Índice ativo controlado. */
  activeIndex?: number;
  defaultActiveIndex?: number;
  onActiveIndexChange?: (index: number) => void;

  /** Quantos slides exibir simultaneamente. Number ou responsive object. */
  slidesPerView?: number | ResponsiveValue<number>;
  /** Largura fixa por slide; alternativa a slidesPerView. */
  slideWidth?: SizeToken;
  /** Espaço entre slides. */
  gap?: SpacingToken;

  loop?: boolean;
  autoplay?: false | { interval: number; pauseOnHover?: boolean; pauseOnInteraction?: boolean };

  /** Nome acessível obrigatório do carrossel. */
  ariaLabel: string;

  orientation?: 'horizontal' | 'vertical'; // PR2
}

interface CarouselSlideProps {
  children: ReactNode;
  /** Identificador estável; usado para aria-controls dos indicadores. */
  id?: string;
}

// Carousel.Prev / Next / Indicators são "clean slots" sem props além de className/style.
// Carousel.Viewport e Carousel.Track existem para que recipes possam estilizar
// independentemente (ex: viewport tem overflow:hidden, track é o flex container que desliza).
```

### Cross-platform

| Aspecto | Web | Native |
|---|---|---|
| Render do track | `Box` com `overflow-x: auto`, `scroll-snap-type: x mandatory` | `FlatList` horizontal com `pagingEnabled` ou `snapToInterval` |
| Slide | `Box` com `scroll-snap-align: start` | item da `FlatList` |
| Prev/Next | `Clickable` que chama `scrollTo` com offset calculado | `FlatList.scrollToIndex` |
| Indicators | mapeia slides → `Clickable` com `aria-current` | mesma lógica, `accessibilityState.selected` |
| Autoplay | `setInterval` + `usePrefersReducedMotion()` para auto-pausa | `setInterval` + `usePrefersReducedMotion.native` (TD-032; bloqueio temporário se ainda não houver) |
| Keyboard | `ArrowLeft`/`ArrowRight` quando viewport tem foco; `Home`/`End` para extremos | n/a (touch) |

API pública é **idêntica** entre plataformas. Renderização especializa-se em `.tsx` × `.native.tsx`.

### A11y

- `Carousel.Root` → `role="region" aria-roledescription="carousel" aria-label`.
- `Carousel.Slide` → `role="group" aria-roledescription="slide" aria-label="Slide N de M"`.
- Quando autoplay ativo → `aria-live="polite"`; quando manual ou pausado → `aria-live="off"`.
- `Carousel.Prev`/`Next` → `<Clickable>` com `aria-label="Slide anterior"`/`"Próximo slide"` (textos via TD-033 quando resolvida).
- `Carousel.Indicators` → cada dot é `<Clickable>` com `aria-controls={slideId}` + `aria-current={isActive ? 'true' : undefined}`.
- Slide fora da janela → `inert` quando suportado, ou `aria-hidden="true"` + `tabindex="-1"` em descendentes focáveis.

### Motion

- `transition()` themable já existente; nada novo a propor.
- Autoplay: respeita `usePrefersReducedMotion()` automaticamente — se reduzido, autoplay vira no-op (não pula slide sozinho). Documentar.

### Recipe

`defineSlotRecipe('carousel', { slots: ['root', 'viewport', 'track', 'slide', 'prev', 'next', 'indicators', 'indicator'], variants: { orientation, slidesPerView? } })`. Identidade visual (background do botão prev/next, formato do indicador) themable via override.

---

## Plano de execução

**PR1 (anatomia + a11y core)**:
- Compound completo cross-platform
- `slidesPerView` (number e responsive)
- `loop` + `Prev`/`Next`/`Indicators`
- A11y completa (region/slide/aria-roledescription/aria-current)
- Keyboard nav web (ArrowLeft/ArrowRight/Home/End)
- Slot recipe `carousel`
- Stories + testes web + native

**PR2 (motion + variantes opcionais)**:
- `autoplay` com `usePrefersReducedMotion`
- `orientation: 'vertical'`
- Lazy loading de slides fora da janela (opt-in via prop `lazy?: boolean`)

**Decisões deliberadas**:
- **Sem dependência externa** (Embla, Swiper). Princípio "zero dependências de runtime" do CLAUDE.md. Reavaliar **somente** se a complexidade de `scroll-snap + a11y` justificar (1 produto consumidor real reportando bug não trivial).
- **`slidesPerView` é responsive**: o caso vitrine (1 mobile / 2 tablet / 4 desktop) é canônico.

---

## Riscos / Trade-offs

| Risco | Mitigação |
|---|---|
| `scroll-snap` em mobile web tem quirks (Safari iOS) | Testar matriz; fallback documentado |
| `FlatList.scrollToIndex` falha quando slides têm altura dinâmica | Documentar requisito `slideWidth` fixo em RN |
| Autoplay + reduced motion + manual interaction → estado complexo | Diagrama de estado na docs; testes E2E |
| API com `slidesPerView` responsive vira complicada em SSR | Default 1 + hidratação; precedente `useBreakpoint` |

---

## Critérios de aceite

- [ ] Compound `Carousel.Root/Viewport/Track/Slide/Prev/Next/Indicators` em web + native.
- [ ] `defineSlotRecipe('carousel')` declarado e themable.
- [ ] A11y verificada: NVDA + VoiceOver iOS + TalkBack Android.
- [ ] `prefers-reduced-motion` respeitado em autoplay.
- [ ] Stories cobrindo: 1/2/3 slides simultâneos, autoplay on/off, vertical, loop on/off.
- [ ] Testes web + native verdes.
- [ ] CONTRIBUTING §Carousel documenta requisito `slideWidth` fixo em RN.

---

## Dependências

- **TD-032** (`usePrefersReducedMotion.native` ausente) — autoplay native fica suboptimal até essa dívida fechar; PR1 pode ignorar e PR2 incorpora.
- **TD-033** (labels hardcoded) — textos default ("Slide anterior" etc.) entram no escopo da resolução de TD-033, não desta RFC.

---

## Notas de evolução

Versão 1: horizontal puro, slides homogêneos, sem zoom/parallax.
Versão 2 (não escopo): vertical, autoplay/lazy, focus management ao "saltar" slides via indicator.
Versão 3 (não escopo): efeitos (cover-flow, parallax) — abrir RFC dedicada quando demanda materializar.
