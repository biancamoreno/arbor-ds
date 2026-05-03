# Review — `Toast`

**Fase:** R8 · **Camada:** `feedback` · **Status:** `concluído`
**Revisor:** arbor-ds-arch · **Data:** 2026-05-02 · **Versão atual:** `1.0.0-beta`

---

## 0. Escopo

- **Arquivos fonte:** `src/components/toast/{core/{toast.tsx, toast.native.tsx, use-toast.ts}, store/toast-store.ts, interfaces/ToastProps.ts, index.ts}`
- **Story:** `src/components/toast/core/toast.stories.tsx`
- **Testes:** `core/toast.test.tsx` (9) · `core/toast.native.test.tsx` (11)
- **Implementação nativa:** `sim` (`toast.native.tsx`).
- **Classificação cross-platform:** `platform-split` (web + native distintos por causa de animação).
- **Dependências internas:** `Box`, `Flex`, `Text`, `Clickable`, `Icon`, `Portal`.
- **Consumidores conhecidos:** —

---

## 1. Visual

| # | Item | Status | Nota |
|---|---|---|---|
| 1.1 | Variantes declaradas × renderizadas no Storybook batem | ✅ OK | 5 tones cobertos (Default/Success/Warning/Critical/Info/AllTones). |
| 1.2 | Tokens semânticos | ❌ Quebra | **T-CRIT-1:** `tone='info'` aponta para `status.info` (web e native) — token **inexistente**, mesmo bug do Alert (A-CRIT-1). **T-1:** `zIndex: 9999` literal no `getPlacementStyle` — `zIndex.toast=1700` existe nos tokens. **T-4:** `borderLeftWidth={4}` literal (devia ser `borderWidths.thick`). |
| 1.3 | Estados visuais | ⚠️ Melhoria | Sem hover/focus-visible no Close (mesmo gap do Alert). |
| 1.4 | Escala coerente | ✅ OK | Sem `size`, intencional. |
| 1.5 | Contraste WCAG AA | ⚠️ Melhoria | Não verificável para `info` (token quebrado). Demais tones presumem-se OK. |
| 1.6 | Microinterações via `transition()`/motion tokens | ❌ Quebra | **T-2 (web):** `style={{ animation: 'arbor-toast-in 0.2s ease forwards' }}` — duração `0.2s` e curva `ease` literais; ignora `motion.duration` e `motion.easing`. **T-3 (native):** `Animated.timing` com `duration: 200` literal e `Easing.out(Easing.ease)` — mesmo gap (carry-over do issue PB-4 do R7). |
| 1.7 | Reduced motion | ❌ Quebra | Web usa CSS `animation` direto (sem checar `prefers-reduced-motion`). Native: bloqueado pelo R1-C4 carry-over (sem hook native). Pattern recorrente. |
| 1.8 | Ícones via `<Icon>` | ✅ OK | Implementação ✅. Stories ❌ usam HTML `<button>` (não tem emoji aqui — sweet). |

**Observações livres:**
- Web injeta `<style id="arbor-toast-keyframes">` no `document.head` em runtime. Funcional, mas viola SSR puro (depende de `typeof document !== 'undefined'`). Mais coerente seria usar o `GLOBAL_CSS` do provider (mesmo padrão que Skeleton ganhou em R7).
- Native cria animação por `Animated.parallel(opacity, translateY)` — implementação correta; merece migrar para `useTransition()` quando houver shim native do hook.

---

## 2. Comportamental

| # | Item | Status | Nota |
|---|---|---|---|
| 2.1 | Teclado | ✅ OK | Close é Clickable as="button". |
| 2.2 | Focus management | ⚠️ Melhoria | Toast novo não recebe foco (correto — não é overlay). Mas não há mecanismo para acessar o Close por teclado se o toast não estiver em foco — `tabindex` na lista de toasts? Decisão de produto. |
| 2.3 | `role` + `aria-*` | ✅ OK web | `role='status'` + `aria-live` correto. **T-5 (native):** `accessibilityRole={isCritical ? 'alert' : 'text'}` — `'text'` é semântica errada para Toast (Toast não é texto bruto, é region de status). Usar `'none'` ou omitir; `accessibilityLiveRegion` cobre o anúncio em Android. |
| 2.4 | Anúncios SR | ✅ OK | aria-live e accessibilityLiveRegion ✅. |
| 2.5 | Touch target ≥ 44×44 | ❌ Quebra | **T-6:** Close `width={20} height={20}` — mesmo bug do Alert A-5. TD-016 não aplicada. |
| 2.6 | Controlado/não-controlado | ✅ OK | API imperativa via store + componível via slots. Coerente. |
| 2.7 | Evento cancelável | N/A | |
| 2.8 | RTL | ❌ Quebra | **T-7:** `marginLeft: 'auto'` no Close (web e native). Devia ser `marginInlineStart` web; native usa `start: 16`/`end: 16` da RN. Border-left também. |

**Observações livres:** placement `top-left`/`bottom-right` etc. são keywords absolutas. Em RTL a expectativa do usuário inverte (left↔right). Decisão a registrar.

---

## 3. Funcional (API)

| # | Item | Status | Nota |
|---|---|---|---|
| 3.1 | API mínima | ✅ OK | Store + 4 slots + Toaster. Bem dimensionado. |
| 3.2 | Naming | ⚠️ Melhoria | `tone` ✅; `Toast.Close` tem `onClose?` ✅ (melhor que `Alert.Close` que só tem `onClick`). **T-Naming:** Tone default do Toast é `'neutral'`; do Alert é `'info'`. Divergência. Definir um padrão (sugestão: `'neutral'` ambos, com ícone tone-driven só quando explicitado). |
| 3.3 | Defaults | ✅ OK | `tone='neutral'`, `placement='bottom-right'`, `duration=5000` no store. Razoáveis. |
| 3.4 | Discriminated unions | N/A | |
| 3.5 | Polimorfismo | N/A | |
| 3.6 | `forwardRef` + `displayName` | ✅ OK | `displayName` em todos os 5 (Root/Title/Description/Close/Toaster). Web e native. |
| 3.7 | Compound: contratos | ✅ OK | JSDoc lista uso composto + uso imperativo + slot map. |
| 3.8 | Tipos públicos | ✅ OK | 9 tipos exportados (`ToastTone`, `ToastPlacement`, `ToastItem`, 5 props, `ToastInput`). |

**Surface area atual:**
```ts
ToastTone        = 'neutral' | 'success' | 'warning' | 'critical' | 'info'
ToastPlacement   = 'top-left' | ... | 'bottom-right'
ToastItem        = { id; title?; description?; tone?; duration? }
ToastInput       = Omit<ToastItem, 'id'>
ToastRootProps   = { children; tone?; style?; testID? }     // limpo, sem HTMLAttributes
ToastTitleProps  = { children; style?; testID? }
...
ToasterProps     = { placement? }
```

**Observações livres:** Interfaces **não estendem HTMLAttributes** — pattern R7 já aplicado aqui. Mantido, é referência para Alert/Tag/Chip.

---

## 4. Código

| # | Item | Status | Nota |
|---|---|---|---|
| 4.1 | Sem tags HTML puras | ✅ OK | Implementação ✅. Stories ❌ — `<button style={{...}}>` em `ToastDemo` e `AllTonesDemo` (TD-024 carry-over). |
| 4.2 | Sem `style={{...}}` para CSS coberto por prop | ❌ Quebra | **T-CSS-1:** `getPlacementStyle` retorna `CSSProperties` puro (`position: 'fixed'`, `zIndex: 9999`, `display: 'flex'`, `flexDirection`, `gap: '8px'`, `maxWidth: '420px'`, `top/left/right/bottom: '16px'`, `transform`). Tudo passa via `<Box style={...}>`. Quase nada via prop declarativa. **T-CSS-2:** `Title`/`Description` repetem `style={{ margin: 0, lineHeight: '20px' }}` (idêntico ao Alert A-7). **T-CSS-3:** Close tem `style={{ marginLeft, padding, border, background }}` (idêntico ao Alert). **T-CSS-4 (web):** `style={{ animation: 'arbor-toast-in 0.2s ease forwards' }}` — animation é caso aceitável (não há prop), mas a string deveria vir de motion tokens, não literal. |
| 4.3 | Estrutura de pasta | ✅ OK | core/, interfaces/, store/. Boa modulação. |
| 4.4 | `defineRecipe`/`defineSlotRecipe` | ⚠️ Melhoria | `TONE_BORDER` + `getPlacementStyle` locais (web e native). Slot recipe (`toast.frame/title/description/close` × `tone`) candidata, mesmo gate do Alert (resolver tokens info primeiro). |
| 4.5 | Sem `any`/cast | ❌ Quebra | **T-Cast:** `borderLeftColor={borderColor as never}` (web+native), `style={style as ViewStyle}` no native, `style={style as never}` no Title/Description native. Mesmo padrão Alert A-1. |
| 4.6 | Cobertura de testes | ✅ OK | Web 9 + native 11. Native até mais cobertura (placement, persistente, label custom). Excelente. |
| 4.7 | Story cobre default + variantes + states + playground | ⚠️ Melhoria | 6 stories (5 tones + AllTones). **T-Story-1:** Demos usam `<button style={{}}>` — TD-024. Faltam: playground com argTypes (`tone`/`placement`/`duration` controláveis), story `MultipleStacked`, story `LongMessage`, story `Persistent` (duration=0). |
| 4.8 | `.native.tsx` ou platform-split | ✅ OK | platform-split correto. |
| 4.9 | Imports respeitam camadas | ✅ OK | |

**Métricas rápidas:**
- LOC: 237 (toast.tsx) + 255 (toast.native.tsx) + 71 (interfaces) + 45 (store) + 12 (use-toast)
- Testes: 9 web + 11 native
- Stories: 6
- Dependências externas runtime: 0 (Animated/Easing são parte do RN)

**Observações livres:**
- **T-Drift-1:** Title/Description **web** usam `style={{ margin: 0, lineHeight: '20px' }}`; **native** não passa style nenhum. Drift web↔native silencioso (RN não suporta margin/lineHeight em px da mesma forma). Refletir após sweep do A-7/T-CSS-2.
- **T-A11y-Label:** Toaster web tem `aria-label="Notificações"`, native tem `accessibilityLabel="Notificações"` — pt-BR hardcoded. Pattern carry-over (Alert "Fechar", Spinner "Carregando…").
- Native injeta animação inline (`Animated.parallel`); web injeta keyframes em `document.head`. Gate naturalmente assimétrico — vale documentar a divergência no JSDoc do `Toaster`.

---

## 5. Governança

| # | Item | Status | Nota |
|---|---|---|---|
| 5.1 | Export público | ✅ OK | `Toast`, `Toaster`, `useToast` re-exportados. |
| 5.2 | Tipos públicos | ✅ OK | 9 tipos. |
| 5.3 | Changeset | N/A | Pre-v1. |
| 5.4 | Breaking change → RFC | N/A | |
| 5.5 | Migration guide | N/A | |

---

## 6. Resumo executivo

**Score por eixo:** Visual `3/8` · Comportamental `5/8` · Funcional `7/8` · Código `5/9` · Governança `5/5`

**Top 3 achados (por impacto):**

1. **T-CRIT-1 — `status.info` morto reaparece em `TONE_BORDER` (web + native).** Mesmo bug do Alert. Será resolvido junto no fix-imediato A-CRIT-1 (adicionar `feedback.info.{base,subtle,strong}`) — Toast só precisa trocar `status.info` por `feedback.info.base`.
2. **T-CSS-1 — `getPlacementStyle` é uma fortaleza de literais.** `position`, `zIndex: 9999` (literal!), `gap`, `maxWidth`, posições, transform — tudo CSS objeto. `Toaster` deveria modelar placement como variant de slot recipe consumindo `zIndex.toast`, `spacing.medium`, etc.
3. **T-CSS-2/3 + T-Cast — Style-inline + cast em surface dupla (web+native).** Mesmo sweep do Alert. Solução paralela.

**Classificação geral:**
- [ ] ✅ Aprovado sem mudanças
- [ ] ⚠️ Aprovado com fixes menores
- [x] ❌ Requer mudanças antes da próxima release  *(token info quebrado + zIndex literal)*

---

## 7. Follow-ups

### Fix imediato (sweep coletivo R8)

- [ ] **T-CRIT-1** — Trocar `status.info` por `feedback.info.base` em `TONE_BORDER` (web + native), após criação dos tokens (A-CRIT-1).
- [ ] **T-1** — `zIndex: 9999` → `zIndex.toast` (consumir do tema; web via `useToken('zIndex','toast')` ou prop `zIndex='toast'`).
- [ ] **T-4** — `borderLeftWidth={4}` → `borderLeftWidth='thick'` (web e native).
- [ ] **T-5** — Native: `accessibilityRole={isCritical ? 'alert' : 'text'}` → `accessibilityRole={isCritical ? 'alert' : undefined}` (omitir para non-critical; `accessibilityLiveRegion` já anuncia).
- [ ] **T-6** — Close ganha `minWidth={44}`, `minHeight={44}` + overlay `::before` (TD-016).
- [ ] **T-7** — `marginLeft: 'auto'` → `marginInlineStart='auto'` (web). Native: avaliar `start`/`end` do RN.
- [ ] **T-CSS-1** — Reescrever `getPlacementStyle`/`getPlacementContainerStyle` como **variant de recipe** ou função que retorna **props declarativas** (`{ position:'fixed', top:'medium', right:'medium', maxWidth:420, gap:'small', zIndex:'toast' }`). Nada de `CSSProperties` puro a menos que seja CSS sem prop equivalente.
- [ ] **T-CSS-2** — Title/Description: remover `style={{ margin: 0, lineHeight: '20px' }}`; usar prop `margin={0}`. lineHeight literal sai (Text resolve via tipografia).
- [ ] **T-CSS-3** — Close: `style={{ marginLeft, padding: 0, border: 'none', background: 'none' }}` → props declarativas.
- [ ] **T-Cast** — Tipar `TONE_BORDER` como `Record<ToastTone, ColorToken>`; remover 4× `as never`. Native: corrigir tipagem do `style` para `ViewStyle` sem `as never`.
- [ ] **T-Drift-1** — Após T-CSS-2, validar que web e native têm o mesmo conjunto de props no Title/Description (sem drift silencioso).
- [ ] **T-Story-1** — Stories trocam `<button style={{}}>` por `<Button>` ou `<Clickable>` do DS. Adicionar story `Playground` com argTypes.
- [ ] **T-Keyframes-Centralizar** — Migrar `arbor-toast-in` para `GLOBAL_CSS` do provider (mesmo padrão de `arbor-shimmer` do Skeleton em R7). Remove side-effect SSR-fragile.
- [ ] Adicionar `_focusVisible: focusRing` ao `ToastClose` (TD-014).

### Issue (mudança localizada, sem breaking change)

- [ ] **T-Recipe** — Migrar `TONE_BORDER` + placement para `defineSlotRecipe('toast', { slots: ['toaster','frame','title','description','close'], variants: { tone, placement } })`. Bloqueado por T-CRIT-1 + T-CSS-1.
- [ ] **T-Naming-Default-Tone** — Alinhar default tone entre Alert e Toast (sugestão: `'neutral'` em ambos). Carry-over para RFC feedback-tones.
- [ ] **T-A11y-Label** — `'Notificações'` hardcoded no Toaster + `'Fechar'` no Close. Carry-over R7 i18n.
- [ ] **T-Motion-Tokens** — `Animated.timing duration: 200 + Easing.out(Easing.ease)` migra para consumir `motion.duration.fast` + `motion.easing.standard` quando o shim native do `useTransition()` chegar (carry-over PB-4/R1-C4).

### RFC (sistêmico ou breaking change)

- [ ] **RFC SP-1** — Toast usa `fontSize="small"` no Title e `fontSize="sm"` no Description (mesma inconsistência interna do Alert). 6ª evidência consolidada.
- [ ] **RFC feedback-tones** — Toast adiciona `'neutral'` (que o Alert não tem). Catálogo cross-componente precisa decidir se `neutral` é tone universal ou só do Toast.

---

## 8. Notas de arquiteto

- **Toast é o componente mais bem-preparado da R8 em surface (interfaces limpas, displayName, testes paritários native), mas o mais sujo em styling primitivo (`getPlacementStyle` é um anti-pattern fechado em CSSProperties).** Sweep cosmético é grande mas mecânico.
- **Pattern emergente: keyframes globais centralizados.** Skeleton já migrou em R7 (`arbor-shimmer` no GLOBAL_CSS); Toast precisa fazer o mesmo (`arbor-toast-in`). Vale virar checklist em CONTRIBUTING para qualquer animação CSS futura.
- **Pattern emergente: motion tokens em Animated.** Toast.native usa `duration: 200` + `Easing.out(Easing.ease)` literais; ProgressBar/PB-4 do R7 idem. Issue cross-componente que só fecha quando `useTransition()` ganhar shim native (R1-C4).
- **Pattern emergente: Toast/Alert/Badge compartilham TONE_X locais.** Indicação clara para tokens `feedback.{info, success, warning, critical, neutral}.{base, subtle, strong}` virarem **fonte única** + componentes consumirem aliases. Combina A-CRIT-1 + T-CRIT-1 + B-4/B-5 do R7 numa RFC só.
- **Boa decisão arquitetural preservada:** `useSyncExternalStore` + store imperativa com `subscribe`/`getSnapshot` — pattern correto para state cross-component sem render extra. Manter.
