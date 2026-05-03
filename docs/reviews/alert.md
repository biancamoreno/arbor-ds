# Review — `Alert`

**Fase:** R8 · **Camada:** `feedback` · **Status:** `concluído`
**Revisor:** arbor-ds-arch · **Data:** 2026-05-02 · **Versão atual:** `1.0.0-beta`

---

## 0. Escopo

- **Arquivos fonte:** `src/components/alert/{core/alert.tsx, context/alert-context.ts, interfaces/AlertProps.ts, index.ts}`
- **Story:** `src/components/alert/core/alert.stories.tsx`
- **Testes:** `core/alert.test.tsx` (14) · `core/alert.native.test.tsx` (2)
- **Implementação nativa:** `não` — declarado `@platform shared`. Compõe Flex/Text/Icon/Clickable, cada um com `.native`.
- **Classificação cross-platform:** `universal (shared)`
- **Dependências internas:** `Flex`, `Text`, `Clickable`, `Icon`.
- **Consumidores conhecidos:** —

---

## 1. Visual

| # | Item | Status | Nota |
|---|---|---|---|
| 1.1 | Variantes declaradas × renderizadas no Storybook batem | ✅ OK | 4 tones + AllTones. |
| 1.2 | Tokens semânticos (sem valores crus) | ❌ Quebra | **A-CRIT-1:** `tone='info'` aponta para `status.info` — token **inexistente** em `themeLight/Dark.colors`. Engine resolve undefined → border-color/icon-color invisíveis. Default tone quebrado. **A-3:** outros tones usam `feedback.X.{base,subtle,strong}` mas `feedback.info` também não existe. **A-4:** `borderLeftWidth={4}` literal — `borderWidths.thick` está exposto via baseTheme. |
| 1.3 | Estados visuais: hover/focus/active/disabled em Close | ⚠️ Melhoria | `Alert.Close` tem `cursor:pointer` mas zero feedback hover/focus-visible. Padrão R7 (TD-014) deve aplicar `_focusVisible: focusRing`. |
| 1.4 | Escala de tamanhos coerente | ✅ OK | Sem `size` prop — escolha intencional (Alert é uniforme). |
| 1.5 | Contraste WCAG AA light/dark | ⚠️ Melhoria | Não verificável para `info` (token quebrado). Para success/warning/critical: `feedback.X.strong` sobre `feedback.X.subtle` é o padrão consagrado, presume-se OK. |
| 1.6 | Microinterações via `transition()` | ⚠️ Melhoria | `Alert.Close` deveria ter `transition()` para hover/focus suave (PR1 RFC-0027 não cobriu). |
| 1.7 | Reduced motion | N/A | Componente estático. |
| 1.8 | Ícones via `<Icon>` | ⚠️ Melhoria | Implementação ✅ (`Icon name={TONE_ICON[tone]}`). **Stories ❌** injetam emojis (`ℹ️`, `✅`, `⚠️`, `🚨`) — viola convenção e contraria a documentação viva (consumidor copia o emoji). |

**Observações livres:**
- `info` é o único tone com `bg: 'transparent'` enquanto os outros têm subtle. Inconsistência visual (info "desaparece" em background neutro).
- `borderLeftStyle="solid"` e `borderLeftColor` separados de `borderLeftWidth` — funciona, mas vale uniformizar com `borderInlineStartWidth/Style/Color` para preparar RTL (ver 2.8).

---

## 2. Comportamental

| # | Item | Status | Nota |
|---|---|---|---|
| 2.1 | Teclado | ✅ OK | `Alert.Close` é `Clickable as="button"` — Tab/Enter/Space funcionam. |
| 2.2 | Focus management | N/A | Sem trap (Alert não é overlay). |
| 2.3 | `role` + `aria-*` | ✅ OK | `role='alert'` para critical+warning (assertive); `role='status'` para info+success (polite). Decisão correta. |
| 2.4 | Anúncios SR em estados dinâmicos | ✅ OK | Implícito via role=alert/status. |
| 2.5 | Touch target ≥ 44×44 | ❌ Quebra | **A-5:** `Alert.Close` com `width={20} height={20}` — abaixo do mínimo WCAG 2.5.5. TD-016 (padrão `minHeight`+overlay `::before`) não foi aplicada. |
| 2.6 | Controlado/não-controlado | ⚠️ Melhoria | Alert não é dismissable de fato — `Alert.Close` só dispara `onClick`; consumidor controla montagem. Pattern legítimo (composable) mas merece nota no JSDoc. |
| 2.7 | Evento cancelável | N/A | |
| 2.8 | RTL | ❌ Quebra | **A-6:** `Alert.Close` usa `style={{ marginLeft: 'auto' }}` — em RTL devia ser `marginInlineStart`. Border-left também precisaria ser `borderInlineStart`. |

**Observações livres:** Native test só cobre 2 cases (render+text). Nenhum teste de role/aria-hidden/onClick (paridade com 14 web). Drift web↔native iminente.

---

## 3. Funcional (API)

| # | Item | Status | Nota |
|---|---|---|---|
| 3.1 | API mínima | ✅ OK | 5 slots: Root/Icon/Title/Description/Close. Bem dimensionado. |
| 3.2 | Naming | ⚠️ Melhoria | `tone` ✅; **A-14:** `Alert.Close` recebe `onClick` (herdado de ButtonHTMLAttributes), enquanto convenção do DS para overlays é `onOpenChange`. Para Alert (sem estado interno), `onClick` é defensável, mas docstring promete "Close" sem expor `onClose`. Decisão de naming. |
| 3.3 | Defaults "least surprise" | ⚠️ Melhoria | `tone='info'` ❌ (quebrado, ver A-CRIT-1). `label='Fechar'` (PT-BR hardcoded — pattern R7 carry-over). |
| 3.4 | Discriminated unions | N/A | |
| 3.5 | Polimorfismo `as` | N/A | |
| 3.6 | `forwardRef` + `displayName` | ❌ Quebra | **A-12:** zero `forwardRef`, zero `displayName` em todos os 5 subcomponentes. Pattern R7 sweep deveria ter coberto, mas Alert ficou de fora. |
| 3.7 | Compound: contratos de slot | ✅ OK | JSDoc lista todos slots + exemplo. |
| 3.8 | Tipos públicos exportados | ✅ OK | 5 interfaces re-exportadas em `index.ts`. |

**Surface area atual:**
```ts
AlertRootProps        extends HTMLAttributes<HTMLDivElement>      { children; tone? }
AlertIconProps        extends HTMLAttributes<HTMLSpanElement>     { children? }
AlertTitleProps       extends HTMLAttributes<HTMLParagraphElement>{ children }
AlertDescriptionProps extends HTMLAttributes<HTMLParagraphElement>{ children }
AlertCloseProps       extends ButtonHTMLAttributes<HTMLButtonElement> { label? }
```

**Observações livres:** **A-11:** `extends HTMLAttributes<...>` em todas as 5 — pattern R7 fechado para Spinner/Skeleton/Badge/ProgressBar precisa também aplicar aqui. Surface inflada (todos os ~60 atributos HTML herdados aparecem em IntelliSense + d.ts).

---

## 4. Código

| # | Item | Status | Nota |
|---|---|---|---|
| 4.1 | Sem tags HTML puras | ✅ OK | Implementação usa Flex/Text/Clickable/Icon. (Stories ❌ — ver 4.7.) |
| 4.2 | Sem `style={{...}}` para CSS coberto por prop | ❌ Quebra | **A-7:** `AlertTitle`/`AlertDescription` usam `style={{ margin: 0, lineHeight: '20px', ...style }}` — `lineHeight: '20px'` é literal (devia ser `'small'` via tipografia tokens), `margin: 0` tem prop equivalente. **A-CSS:** `AlertClose` tem `style={{ marginLeft, padding: 0, border, background, ...style }}` — todos com prop declarativa. Viola memória `feedback_no_style_prop.md`. |
| 4.3 | Estrutura de pasta | ✅ OK | core/, interfaces/, context/. |
| 4.4 | `defineRecipe`/`defineSlotRecipe` | ⚠️ Melhoria | Pattern R7 #6 — recipes mortas/ausentes. Alert tem `TONE_COLORS`/`TONE_ICON` Records locais. Slot recipe (`alert.frame`/`icon`/`title`/`description`/`close`) é candidato natural quando os tokens de feedback estiverem completos. Bloqueado por A-CRIT-1. |
| 4.5 | Sem `any`/cast | ❌ Quebra | **A-1:** 4 ocorrências de `as never` para passar `colors.X` (string) onde Flex espera token. Sintoma de tipagem fraca em `TONE_COLORS`. Resolver com tipo `ColorToken` ou via slot recipe (4.4). |
| 4.6 | Cobertura de testes | ⚠️ Melhoria | Web 14 cases (sólido). **Native 2 cases** — paridade fraca. Padrão R7 sugere replicar role/aria/onClick em native. |
| 4.7 | Story cobre default + variantes + states + playground | ❌ Quebra | **A-8:** emojis em vez de Icon. **A-9:** `AllTones` usa `<div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 400 }}>` — TD-024 carry-over. Faltam: playground com `argTypes`, story interactive de Close (com onClick mostrando dismiss), story compound (Alert + Button + Field). |
| 4.8 | `.native.tsx` ou platform-split registrado | ✅ OK | Genuinamente shared (compõe primitives). Apenas `alert.native.test.tsx` para validar. |
| 4.9 | Imports respeitam camadas | ✅ OK | |

**Métricas rápidas:**
- LOC: 158 (alert.tsx) + 28 (interfaces) + 10 (context) = ~196
- Testes: 14 web + 2 native
- Stories: 5 (Info/Success/Warning/Critical/AllTones)
- Dependências externas runtime: 0

**Observações livres:**
- Inconsistência **interna** SP-1: `fontSize="small"` no Title (linha 82) **vs** `fontSize="sm"` no Description (linha 95). Mesmo arquivo, mesmo componente. Evidência forte para a RFC SP-1 candidata.

---

## 5. Governança

| # | Item | Status | Nota |
|---|---|---|---|
| 5.1 | Export público em `src/components/index.ts` | ✅ OK | `Alert` exportado. |
| 5.2 | Tipos públicos exportados | ✅ OK | 5 interfaces. |
| 5.3 | Changeset entry | N/A | Pre-v1. |
| 5.4 | Breaking change tem RFC | N/A | A-CRIT-1 é fix de bug, não breaking. |
| 5.5 | Migration guide | N/A | |

---

## 6. Resumo executivo

**Score por eixo:** Visual `2/8` · Comportamental `4/8` · Funcional `4/8` · Código `4/9` · Governança `5/5`

**Top 3 achados (por impacto):**

1. **A-CRIT-1 — `status.info` não existe nos tokens.** Default `tone='info'` renderiza border/icon undefined. Bug funcional silencioso (não dispara warning, só falha visualmente). Bloqueia também a slot recipe (4.4). Resolução depende de adicionar `feedback.info.{base,subtle,strong}` em `themeLight/DarkColors` (issue B-4/B-5 do R7) — **promovida a fix-imediato** porque Alert depende disso para funcionar.
2. **A-5 — Touch target do Close abaixo de 44×44.** TD-016 (pattern `minHeight + ::before`) precisa ser aplicado.
3. **A-1 — `as never` 4× + style inline 7× + extends HTMLAttributes 5×.** Sintomas convergentes de surface inflada. Sweep idêntico ao R7 (Spinner/Skeleton/Badge/ProgressBar) resolve em bloco.

**Classificação geral:**
- [ ] ✅ Aprovado sem mudanças
- [ ] ⚠️ Aprovado com fixes menores
- [x] ❌ Requer mudanças antes da próxima release  *(default tone funcionalmente quebrado)*

---

## 7. Follow-ups

### Fix imediato (sweep coletivo R8)

- [ ] **A-CRIT-1** — Adicionar `feedback.info.{base, subtle, strong}` em `themeLightColors`/`themeDarkColors` (escala blue/aqua) e remover toda referência a `status.info` do Alert. (Resolve também B-4/B-5 do R7.)
- [ ] **A-3** — Substituir `status.info` por `feedback.info.X` no `TONE_COLORS` do Alert. Padronizar `info` com bg `feedback.info.subtle` (não mais `transparent`).
- [ ] **A-1** — Tipar `TONE_COLORS` como `Record<Tone, { bg: ColorToken; border: ColorToken; text: ColorToken; icon: ColorToken }>` e remover os 4 `as never`.
- [ ] **A-4** — `borderLeftWidth={4}` → `borderLeftWidth='thick'` (consumir `borderWidths.thick`).
- [ ] **A-5** — `Alert.Close` ganha `minWidth={44}`, `minHeight={44}` + overlay `::before` (pattern TD-016 já consagrado).
- [ ] **A-6** — `marginLeft: 'auto'` (style) → `marginInlineStart='auto'` (prop). Border esquerda: `borderInlineStartWidth/Style/Color`.
- [ ] **A-7** — Remover `style={{ margin: 0, lineHeight: '20px' }}` de Title/Description; usar prop `margin={0}` e remover lineHeight literal (Text já resolve via tipografia tokens — investigar se precisa override).
- [ ] **A-CSS** — `Alert.Close` deve usar props declarativas: `padding={0}`, `border='none'`, `backgroundColor='transparent'`. Sobra zero `style={{}}`.
- [ ] **A-8** — Stories trocam emojis (`ℹ️`/`✅`/`⚠️`/`🚨`) por `<Alert.Icon />` (deixa default tone-driven). Stories explícitas só com `<Alert.Icon><Icon name='Sparkles' /></Alert.Icon>` no exemplo de override.
- [ ] **A-9** — `AllTones` substitui `<div style={{}}>` por `<Flex direction='column' gap='small' width={400}>`.
- [ ] **A-11** — Remover `extends HTMLAttributes<...>` das 5 interfaces; adicionar `style?: CSSProperties` + `className?: string` explícitos. Pattern R7.
- [ ] **A-12** — `displayName` em `Alert.Root`, `Alert.Icon`, `Alert.Title`, `Alert.Description`, `Alert.Close`. Pattern R7.
- [ ] **A-SP1** — Uniformizar `fontSize='small'` em Title e Description (corrigir o `'sm'` do Description). Evidência interna para RFC SP-1.
- [ ] **A-Native-Parity** — Replicar 6 cases mínimos no `alert.native.test.tsx`: role critical, label custom, Icon default por tone, onClick do Close, render de cada tone.
- [ ] **A-Story-Playground** — Adicionar story `Playground` com `argTypes.tone` controlável e story `Dismissable` interactive (state local + onClick removendo).
- [ ] Adicionar `_focusVisible: focusRing` (via prop ou recipe local) ao `Alert.Close`. Pattern TD-014.
- [ ] Adicionar `transition()` no Close para hover/focus.

### Issue (mudança localizada, sem breaking change)

- [ ] **A-Recipe** — Migrar `TONE_COLORS`/`TONE_ICON` para `defineSlotRecipe('alert', { slots: ['frame','icon','title','description','close'], variants: { tone } })`. Bloqueado por A-CRIT-1 (precisa de tokens completos antes). Issue separada pós-sweep.
- [ ] **A-Label-i18n** — `label='Fechar'` PT-BR hardcoded. Carry-over R7. Decisão de produto: `texts: { close: string }` ou prop `closeLabel` ou função global de i18n.

### RFC (sistêmico ou breaking change)

- [ ] **RFC SP-1** — Padronizar `sm/md/lg` × `small/medium/large` em props de `size`. Alert dá 5ª evidência (Spinner/Button/Badge/ProgressBar/**Alert** — interna ainda, mistura `small`/`sm` no mesmo arquivo). Codemod cirúrgico para `Icon size`, `Text fontSize`. Decisão depois de Toast/Tag/Chip.
- [ ] **RFC feedback-tones** — Catálogo cross-componente (`feedback.{info, success, warning, critical}` × `{base, subtle, strong}` + naming `tone` consistente em Alert/Toast/Badge/ProgressBar/ProgressCircle/Tag/Chip). Pré-condição: A-CRIT-1 ter sido fixado (estende a solução).

---

## 8. Notas de arquiteto

- **Alert é o primeiro componente onde `feedback.info.*` ausente vira bug funcional**, não só inconsistência. O ponto cego do R7 (B-4/B-5 como issues) virou bloqueador real em R8 — promovendo para fix-imediato no sweep coletivo.
- **Ground truth de `@platform shared`:** Alert é genuinamente shared (compõe Flex/Text/Clickable/Icon, todos com `.native`). Mas `alert.native.test.tsx` com 2 cases é insuficiente — paridade de testes deve replicar pelo menos role/Icon/onClick. Pattern recorrente para outros "shared verdadeiros" — vale critério em CONTRIBUTING ("paridade de testes ≥ 80% mínimo").
- **`status.info` órfão** sugere refactor histórico abandonado. Vale grep no resto do codebase pós-sweep para garantir que nenhum outro consumidor referencia o token morto.
- **Slot recipe `alert` adiada** porque modelar variantes sobre tokens quebrados produziria recipe igualmente quebrada. Fixar tokens primeiro, recipe depois (issue, não fix-imediato).
