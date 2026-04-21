# Fase 16 — Polish Visual e Animações dos Componentes Existentes

**Status:** Concluída (2026-04-20)
**Estimativa:** 3–5 dias-pessoa
**Risco:** Médio (muitos componentes tocados; risco de regressão visual sutil)
**Pré-requisito:** Fases 13 (motion utility) e 14 (Icon)

---

## Contexto

Após as fundações visuais (Fase 13) e a biblioteca de ícones (Fase 14), todos os componentes existentes precisam ser atualizados para:

1. Consumir `transition()` em vez de strings hardcoded de transition CSS.
2. Substituir placeholders (spinner `...`) por ícones reais.
3. Reforçar estados interativos (`_hover`, `_active`, `_focus-visible`, `_disabled`) com consistência visual entre componentes.
4. Adicionar microinterações coerentes com motion tokens.

Esta fase é de **refinamento contínuo** — cada componente é tocado de forma pequena e localizada. O trabalho é particionado em sub-contextos (sprints internas) para permitir merge incremental e reduzir risco de conflito.

---

## Princípios de Animação

Antes de detalhar cada componente, três princípios que **todos** os refinamentos devem seguir:

### P1. Todo `transition` consome `transition()` da Fase 13
Nenhuma string hardcoded tipo `"background-color 150ms ease-in-out"`. Toda transição passa pelo utilitário — type-safe, consistente, audit-friendly.

### P2. Microinteração tem propósito
Animação existe para **comunicar estado ou direção**, não para decorar. Critérios:
- **Entrada/saída de overlay:** decelerate (chegada "suave")
- **Resposta a input:** fast duration (feedback quase imediato)
- **Transição de fundo/cor:** normal duration
- **Indicador de progresso:** standard easing, loop contínuo

### P3. Reduced motion é default
A camada CSS global da Fase 13 já zera transições quando `prefers-reduced-motion: reduce`. Nenhum componente precisa checar isso manualmente, exceto quando anima via JS (ex: Web Animations API, `Animated` do RN) — nesses casos usar o hook `usePrefersReducedMotion`.

---

## Estrutura em Sub-Contextos

| Sub-contexto | Componentes | Foco |
|--------------|-------------|------|
| **16.A — Interação** | Button, Input, Switch, Checkbox, Radio, RadioCard | Estados (`hover/active/focus/disabled/error`) |
| **16.B — Conteúdo** | Card, Badge, Chip, Tag, Avatar | Visual polish, hover elevate |
| **16.C — Overlays** | Modal, Dialog, Drawer, Tooltip, Popover, Menu | Animações entrada/saída |
| **16.D — Feedback** | Toast, Alert, Skeleton, Spinner, ProgressBar, ProgressCircle | Animações de estado |
| **16.E — Disclosure** | Accordion, Tabs | Transições de conteúdo |

Cada sub-contexto pode virar uma PR separada. Ordem sugerida: A → C → D → E → B (B é puramente cosmético, menor risco/prioridade).

---

## 16.A — Componentes de Interação

### Button

**Mudanças:**

- Substituir spinner `...` por `<Icon name="loader-circle" />` com animação `spin` via keyframe CSS (`@keyframes spin { to { transform: rotate(360deg) } }`) e `animation: spin 600ms linear infinite`.
- Consolidar estados via recipe:
  ```
  hover        → filter: brightness(0.92); transition: fast
  active       → transform: scale(0.97); transition: fast
  focus-visible→ box-shadow: 0 0 0 2px surface, 0 0 0 4px brand.primary
  disabled     → opacity: 0.45; cursor: not-allowed; sem transition
  loading      → ícone spinner + texto mantido + aria-busy="true"
  ```
- Nova variante `danger` para ações destrutivas (cor `feedback.error`).
- Nova variante `ghost` (sem background; hover aplica `surface.subtle`).

**ADR-16-01:** `focus-visible` (não `focus`) — evita ring em clique de mouse, mantém em navegação por teclado.

### Input

**Mudanças:**

- Focus ring animado: `box-shadow` expand de `0 → 0 0 3px brand.primary/30` com `transition(['box-shadow'], 'fast')`.
- Border color animada em hover e focus (`transition(['border-color'], 'fast')`).
- Estado `error`: shake sutil via keyframe breve (`@keyframes shake { 0,100% {tx:0} 25% {tx:-4px} 75% {tx:4px} }`, duration 300ms, once).
- Estado `success`: `<Icon name="check" color="feedback.success" />` como suffix.
- Estado `loading`: `<Icon name="loader-circle" />` spin como suffix.
- Opcional: prop `floatingLabel` — label flutuante com transição `transform: translateY + scale` em focus.

### Switch

- Thumb já usa `transform: translateX()` — garantir `transition(['transform', 'background-color'], 'fast')`.
- Adicionar `<Icon name="check" />` pequeno no thumb quando `checked` (fade-in).
- Track background anima de neutro → brand quando check.

### Checkbox

- Checkmark via SVG `strokeDashoffset` animado de `24 → 0` com `transition(['stroke-dashoffset'], 'fast', 'decelerate')`.
- Indeterminate: traço horizontal com mesma animação.
- Focus ring consistente com Button/Input.

### Radio / RadioCard

- Dot interno anima `scale(0) → scale(1)` com `transition(['transform'], 'fast', 'decelerate')`.
- RadioCard: borda anima color + background anima de `surface` → `brand.subtle` em `checked`.

---

## 16.B — Componentes de Conteúdo

### Card

- Nova variant `hoverable`:
  - `_hover`: `transform: translateY(-2px)` + shadow upgrade de `sm` → `md`.
  - Transition: `transition(['transform', 'box-shadow'], 'normal', 'decelerate')`.
- Nova variant `clickable`: combina hoverable + `_active: scale(0.99)` + cursor pointer + `role="button"`.

### Badge / Chip / Tag

- Aplicar `fontFamily="sans"` via recipe (Fase 13 já estabelece default global; aqui confirmamos).
- `fontWeight: medium` para maior legibilidade.
- Chip: nova prop `removable` — botão X no end com animação de saída (`scale(1) → scale(0)` + remove do DOM).
- Badge com número: `transition(['transform'], 'fast')` quando valor muda (pulse sutil).

### Avatar

- `transition(['box-shadow', 'border-color'], 'fast')` em estados hover (quando dentro de `Clickable`).
- Fallback animado: quando `src` falha, fade-in do iniciais em 150ms.

---

## 16.C — Overlays

### Modal / Dialog

**Entrada:**
- Overlay: `opacity: 0 → 1` com `transition(['opacity'], 'normal')`.
- Dialog: `scale(0.95) → scale(1)` + `opacity: 0 → 1` combinados com `transition(['transform', 'opacity'], 'normal', 'decelerate')`.

**Saída:**
- Animação reversa; `unmount` só após `animationend` (usar state machine ou `AnimatePresence`-like interno).

**ADR-16-02:** Saída animada é implementada via state `'entering' | 'entered' | 'exiting' | 'exited'` no hook de disclosure (já existe no projeto como `useDisclosure`). Não adicionar dependência de motion lib externa.

### Drawer

- Slide: `translateX(100%) → translateX(0)` (right), `translateX(-100%) → translateX(0)` (left), análogo vertical para top/bottom.
- Overlay: fade como Modal.
- `transition(['transform'], 'normal', 'decelerate')`.

### Tooltip

- `opacity: 0 → 1` + `scale(0.95) → scale(1)` com `transition(['opacity', 'transform'], 'fast', 'decelerate')`.
- Delay de `300ms` antes de aparecer via `transition-delay` CSS — evita tooltips "flashando" em passagens rápidas do mouse.

### Popover / Menu

- Mesma animação do Tooltip, mas sem delay.
- Origin da animação baseada em `placement` (ex: `placement="bottom"` → `transformOrigin: "top center"`).

---

## 16.D — Feedback

### Toast

**Entrada:**
- Do topo: `translateY(-16px) + opacity:0` → `translateY(0) + opacity:1`.
- Do lado: `translateX(110%) → translateX(0)`.
- Duração: `normal`, easing: `decelerate`.

**Saída:**
- Slide para fora na direção de entrada.
- Se `duration` está definida, progress bar horizontal anima `width: 100% → 0%` em `linear` durante a duração — countdown visual.

### Alert

- Entrada: `opacity: 0 → 1` + `translateY(-4px) → translateY(0)` com `fast`.
- `dismissible` Alert: animação de saída `opacity 1→0` + `scale 1→0.98`.
- Ícone semântico consome `Icon` da Fase 14:
  - `variant="info"` → `name="info"`
  - `variant="success"` → `name="check-circle-2"`
  - `variant="warning"` → `name="triangle-alert"`
  - `variant="error"` → `name="circle-alert"`

### Skeleton

- Shimmer via gradient deslizante: pseudo-element com `background: linear-gradient(90deg, transparent, surface.subtle, transparent)` e `animation: shimmer 1400ms ease-in-out infinite`.
- Respeita `prefers-reduced-motion` (camada global zera).

### Spinner

- Substituir implementação placeholder por `<Icon name="loader-circle" />` girando com `animation: spin 600ms linear infinite`.
- Tamanhos consomem tokens: `sm=16`, `md=24`, `lg=32`.

### ProgressBar

- `transition(['width'], '300ms', 'standard')` no fill.
- Variant `indeterminate`: barra deslizante animada via keyframe infinito.

### ProgressCircle

- `transition(['stroke-dashoffset'], '300ms', 'standard')` no círculo.
- Indeterminate: rotação contínua via `animation: spin`.

---

## 16.E — Disclosure

### Accordion

- Altura do conteúdo animada:
  - Preferência: `grid-template-rows: 0fr → 1fr` (CSS moderno, sem medição JS).
  - Fallback: `max-height` com valor generoso + `overflow: hidden`.
  - Transition: `transition(['grid-template-rows'], 'normal')`.
- Chevron rotaciona `0deg → 180deg` com `transition(['transform'], 'fast')`.

### Tabs

- Indicator (underline ou pill) desliza entre tabs:
  - Posição calculada via `useRef` + `getBoundingClientRect()` ou `<ResizeObserver>`.
  - `transition(['left', 'width'], 'fast', 'standard')` aplicado ao indicator.
- Content panels: fade opcional (`opacity: 0 → 1`, `fast`) na troca.

---

## Estratégia Cross-Platform

A maioria das animações é **web-only via CSS**. Componentes com paridade RN (`.native.tsx`) adotam estratégia análoga com `Animated` API:

| Padrão | Web | Native |
|--------|-----|--------|
| Fade | CSS `opacity` + `transition` | `Animated.timing(opacity)` |
| Scale | CSS `transform` + `transition` | `Animated.spring(scale)` |
| Slide | CSS `transform: translate` + `transition` | `Animated.timing(translateY)` |
| Spin | CSS `@keyframes` + `animation` | `Animated.loop(Animated.timing(rotate))` |

Um helper `src/ecosystem/utils/animation/motion-duration.ts` converte tokens em números (ms) para consumo no RN:

```ts
export function motionDurationMs(token: Duration): number {
  return parseInt(motionTokens.duration[token], 10);
}
```

**ADR-16-03:** Nenhuma dependência nova (nem `framer-motion`, nem `react-native-reanimated`) nesta fase. `Animated` nativo cobre o escopo atual. Reanimated fica como upgrade futuro se a complexidade das animações demandar gestos/valores compartilhados.

---

## Impacto em DX

- Todos os componentes passam a ter feedback visual previsível em estados.
- Consumidores ganham `danger` e `ghost` em Button sem trocar estrutura.
- `removable` em Chip, `hoverable`/`clickable` em Card, `floatingLabel` em Input — novas props aditivas.
- Sem breaking change de API em nenhum componente.

---

## Impacto em Acessibilidade

- `focus-visible` universal — foco só aparece para teclado.
- Overlays com animação de saída respeitam `aria-hidden` timing (não "some" antes do screen reader ler).
- `aria-busy` adicionado em estados loading.
- Alert com variant semântica ganha `role="alert"` (erro/warning) ou `role="status"` (info/success).
- Reduced motion respeitado globalmente.

---

## Impacto em Performance

- Animações **CSS-only** onde possível — GPU-accelerated (`transform`, `opacity`).
- Evitar animar propriedades que forcem reflow (`width`, `height`, `top`, `left`) exceto onde inevitável (Tabs indicator).
- Skeleton shimmer usa pseudo-element — zero re-render React.
- Keyframes definidos globalmente no `ArborProvider` para evitar duplicação por instância.

---

## Plano de Execução

### Sprint 16.A — Interação (1.5 dias)
1. Button (spinner, variants, states) + testes
2. Input (focus ring, error shake, success icon) + testes
3. Switch/Checkbox/Radio (animações de check) + testes

### Sprint 16.C — Overlays (1 dia)
4. State machine de animação em `useDisclosure`
5. Modal/Dialog (fade + scale) + testes
6. Drawer (slide) + testes
7. Tooltip/Popover/Menu (fade + scale com delay) + testes

### Sprint 16.D — Feedback (1 dia)
8. Toast (slide + progress countdown) + testes
9. Alert (ícones semânticos Lucide) + testes
10. Skeleton shimmer + Spinner refactor
11. ProgressBar/ProgressCircle (animação de fill)

### Sprint 16.E — Disclosure (0.5 dia)
12. Accordion (grid-template-rows) + chevron
13. Tabs (indicator slide)

### Sprint 16.B — Conteúdo (0.5 dia)
14. Card (hoverable/clickable variants)
15. Badge/Chip/Tag (typography fine-tune, Chip removable)
16. Avatar (fallback fade)

### Consolidação (0.5 dia)
17. Validação visual no Storybook
18. Atualização de stories existentes para refletir novos estados
19. Teste de regressão completo

---

## Critérios de Qualidade

### Animações
- [ ] Nenhum componente usa string hardcoded de transition CSS (grep por `"transition"` em `.tsx` aponta só para `transition()` calls)
- [ ] `prefers-reduced-motion` zera todas as animações (validado no Storybook via emulation)
- [ ] Todas as animações rodam a 60fps em devices mid-range (profile via DevTools)

### Estados
- [ ] Todo componente interativo tem `_hover`, `_active`, `_focus-visible`, `_disabled` definidos
- [ ] Ring de foco é consistente em Button, Input, Switch, Checkbox, Radio, Card clickable

### Ícones
- [ ] Button loading usa `<Icon name="loader-circle" />`
- [ ] Alert usa ícone semântico por variant
- [ ] Input success/error/loading usam ícones como suffix
- [ ] Chip removable tem X via `<Icon name="x" />`

### Breaking changes
- [ ] Nenhuma API pública quebrada (snapshots de tipo comparam idênticos)
- [ ] Novas props são todas aditivas

### Testes
- [ ] Suite verde (base esperada após Fase 15: 452)
- [ ] Testes novos de interação cobrem: focus-visible aplicado, disabled bloqueia click, loading seta `aria-busy`
- [ ] Mínimo +30 testes nesta fase (total projetado: 482)

### Performance
- [ ] `size-limit` não aumenta mais que 5% (ícones Lucide + keyframes definidos uma vez)
- [ ] Nenhum jank visível no Storybook

---

## Decisões Arquiteturais (ADRs desta fase)

- **ADR-16-01:** `focus-visible` (não `focus`) para ring de foco — evita ruído em cliques de mouse.
- **ADR-16-02:** Animação de saída de overlays via state machine em `useDisclosure` — sem dep de motion lib externa.
- **ADR-16-03:** Nenhuma dependência de motion lib nova (`framer-motion`/`reanimated` rejeitados nesta fase). CSS + `Animated` nativo cobrem o escopo.
- **ADR-16-04:** Keyframes (`spin`, `shake`, `shimmer`) definidos globalmente no `ArborProvider` — zero duplicação por instância de componente.

---

## Próximas Fases

- **Fase 17** valida todo o polish desta fase no playground mobile (Expo), exercitando Button, Input, Toast, NavBar, FAB em fluxos reais.
