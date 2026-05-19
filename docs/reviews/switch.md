# Review — `Switch`

**Fase:** R6 · **Camada:** `form` · **Status:** `concluído`
**Revisor:** arbor-ds-arch · **Data:** 2026-04-24 · **Versão atual:** `1.0.0`

---

## 0. Escopo

- **Arquivos fonte:** `src/components/switch/core/switch.tsx` (139 LOC) · `src/components/switch/core/switch.native.tsx` (54 LOC) · `src/components/switch/interfaces/SwitchProps.ts`.
- **Story:** `src/components/switch/core/switch.stories.tsx` (5 stories: Default, WithLabel, Checked, Disabled, Sizes).
- **Testes:** `src/components/switch/core/switch.test.tsx` (22 cases — anatomy + FieldContext + sizes).
- **Implementação nativa:** `sim` — `.native.tsx` usa `RNSwitch` da própria React Native.
- **Classificação cross-platform:** `platform-split` (web desenha track/thumb custom; native delega ao SO).
- **Dependências internas:** `Box`, `Flex`, `useTheme`, `useControllableState`, `useFieldContext`, `markFieldAware`, `transition`.
- **Consumidores conhecidos:** consumidores externos. Nenhum componente do DS depende dele.

---

## 1. Visual

| # | Item | Status | Nota |
|---|---|---|---|
| 1.1 | Variantes declaradas × renderizadas no Storybook batem | ❌ | Recipe `switch` em `base-theme.ts:263` declara slots `root/track/thumb` + variant `size`. **Componente não consome a recipe** — `trackSize`/`thumbSize` são objetos internos em pixels. |
| 1.2 | Tokens semânticos | ⚠️ | Cores via `theme.colors.interactive.default`/`border.strong`/`surface.default` ✅. Mas `width/height/padding` em `${px}px` literais; `gap="tiny"` ✅, `borderRadius="full"` ✅. Mistura. |
| 1.3 | Estados visuais: default/hover/focus/active/focus-visible/disabled/error | ❌ | Sem hover, sem focus, sem error. `disabled` → `opacity: 0.6` + `cursor: not-allowed`. `<input>` real é invisível (`opacity: 0; pointerEvents: none`). **Foco do teclado invisível.** |
| 1.4 | Escala de tamanhos coerente com DS | ✅ | Track e thumb escalam juntos (sm: 36×20+16, md: 44×24+20, lg: 52×28+24). Proporção mantida. |
| 1.5 | Contraste ≥ WCAG AA em light/dark | ✅ | Tokens semânticos. |
| 1.6 | Microinterações usam `transition()` | ✅ | `transition(['background-color'], 'fast')` no track e `transition(['transform'], 'fast')` no thumb. |
| 1.7 | Animações respeitam `usePrefersReducedMotion` | ❌ | `transition()` sempre aplicado. |
| 1.8 | Ícones usam `<Icon>` | ✅ N/A | Switch puro sem ícones. |

**Observações livres:**
- **Web desenha visual custom; native usa `RNSwitch` do SO.** Resultado: visual cross-platform diverge totalmente. iOS Switch é nativo (verde 32×52); Android é nativo (Material); Web é custom design tokens. Decisão pragmática mas o branding do "switch ligado" será diferente em cada plataforma.
- **`Switch.Track` e `Switch.Thumb` são slots fantasma** (ver §3.7) — não desenham nada relevante; o visual real está dentro de `SwitchRoot`.

---

## 2. Comportamental

| # | Item | Status | Nota |
|---|---|---|---|
| 2.1 | Teclado: Tab, Space | ⚠️ | `<input role="switch">` é focável. Mas como o input está `opacity: 0; pointerEvents: none`, **não há reflexo visual de foco no track**. Space toggle ✅. Native: `RNSwitch` lida com keyboard nativamente onde aplicável. |
| 2.2 | Focus management | ❌ | Mesmo problema de Radio: foco invisível. |
| 2.3 | `role` correto + `aria-*` | ✅ | `role="switch"` + `aria-checked`/`aria-label`/`aria-labelledby`/`aria-describedby`/`aria-required`/`aria-invalid`/`aria-errormessage` (RFC-0014). Native: `accessibilityRole="switch"` + `accessibilityState`. |
| 2.4 | Anúncios a leitor de tela | ✅ | `role="switch"` + `aria-checked` ✅. |
| 2.5 | Touch target ≥ 44×44 | ❌ | Track é 44×24 em `md` — 24 de altura **abaixo** de 44 mínimo. Em `sm` (36×20) é pior. Mitigação: `<Flex>` wrapper tem padding/gap, mas alvo de toque visual = track. |
| 2.6 | Comportamento controlado × não-controlado | ✅ | `useControllableState`. Testes ✅. |
| 2.7 | Evento cancelável | ✅ N/A | — |
| 2.8 | Comportamento em RTL | ⚠️ | `translateX(${translateX}px)` é absoluto — em RTL, `transform: translateX(20px)` ainda translada para a direita (lógica de `left/right`). **Bug em RTL** (thumb não inverte). |

**Observações livres:**
- **`onClick` está no inner `<Box as="span">` (track visual), não no `<Flex>` outer.** Click no `<Flex>` (gap, padding fora do track) **não toggle**. Diferente de Checkbox/Radio onde o `<label>` outer captura. Switch web não usa `<label>` — apenas `<span>`.
- **`Switch.Track` recebido como children é renderizado como filho do `<Flex>` outer**, mas o **track real já está renderizado dentro de SwitchRoot**. Resultado: usuário que faz `<Switch.Track><Switch.Thumb /></Switch.Track>` cria um `<Flex>` empty extra após o track real. Inofensivo visualmente, mas API mentirosa.
- **Native ignora `aria-labelledby`** — só mapeia `aria-label` para `accessibilityLabel`. Drift de a11y.
- **Native não diferencia `size`** — `RNSwitch` não aceita size. **`size: 'sm' | 'lg'` em RN é silenciosamente ignorado.**

---

## 3. Funcional (API)

| # | Item | Status | Nota |
|---|---|---|---|
| 3.1 | API pública mínima | ✅ | `SwitchRootProps`: 11 props enxutos. |
| 3.2 | Naming segue convenção | ✅ | `disabled`, `checked`, `defaultChecked`, `onCheckedChange`, `size` — RFC-0013/0015. |
| 3.3 | Defaults "least surprise" | ✅ | `defaultChecked = false`, `size = 'md'`. |
| 3.4 | Combinações inválidas via tipo | ⚠️ | `aria-label` xor `aria-labelledby` recomendado (sem ambos, foco anuncia "switch" sem rótulo). Não bloqueado por tipo. |
| 3.5 | Polimorfismo via `as` | ❌ | Sem `as`. |
| 3.6 | `forwardRef` + `displayName` | ⚠️ | `SwitchRoot.displayName = 'Switch.Root'` ✅. **Sem `forwardRef`.** `SwitchTrack` e `SwitchThumb` sem displayName. |
| 3.7 | Compound: contratos de slot explícitos | ❌ | **`Switch.Track` e `Switch.Thumb` não são slots reais.** O visual track + thumb é renderizado **sempre** dentro de `SwitchRoot`, independentemente de children. Os "slots" são wrappers vazios:<br>```tsx<br>function SwitchTrack({ children }) { return <Flex as="span">…{children}</Flex>; }<br>function SwitchThumb({ style }) { return <Box as="span" style={style} />; }<br>```<br>Caller que passa `<Switch.Track><Switch.Thumb /></Switch.Track>` cria DOM extra ineficaz. **Bug arquitetural.** |
| 3.8 | Tipos públicos exportados | ✅ | `SwitchRootProps`, `SwitchTrackProps`, `SwitchThumbProps`, `SwitchSize`. |

**Surface area atual:**

```ts
// SwitchRootProps
{
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  name?: string;
  value?: string;
  size?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

// SwitchTrackProps { children?: ReactNode } — slot fantasma
// SwitchThumbProps { style?: CSSProperties } — slot fantasma
```

**Observações livres:**
- **`name`/`value` são repassados corretamente ao `<input>`** (diferente do bug CB-1 do Checkbox).
- **`children` é renderizado fora do track** (depois). Funciona como slot para texto adjacente. Convenção implícita.

---

## 4. Código

| # | Item | Status | Nota |
|---|---|---|---|
| 4.1 | Sem tags HTML puras | ✅ | `Box`, `Flex`. Native: `View` direto + `RNSwitch` — **`View` viola CLAUDE.md** (deveria ser `Box`). |
| 4.2 | Sem `style={{...}}` onde há prop equivalente | ⚠️ | `style={{ width: '44px', height: '24px', padding: '2px', backgroundColor: ..., transition: ..., boxSizing }}` — `width/height/padding/backgroundColor` têm prop. **Migrar.** |
| 4.3 | Estrutura de pasta aplicada | ✅ | `core/`, `interfaces/`. **Sem `context/`** — Switch não tem context (não compound real). |
| 4.4 | Estilo via `defineRecipe`/`defineSlotRecipe` | ❌ | Recipe `switch` declarada mas dead. |
| 4.5 | Sem `any`, `console.*` | ✅ | Limpo. |
| 4.6 | Testes cobrem estados, variantes, a11y, interações | ⚠️ | 22 cases: render, controlled/uncontrolled, disabled, FieldContext (6), sizes (3 só renderizam). **Faltam:** keyboard real (Space toggle), focus visible, RTL, `aria-labelledby`, native renderer, Switch.Track/Thumb fantasmas (validar que não quebram nada). |
| 4.7 | Story cobre default + variantes + composição | ⚠️ | 5 stories. **Stories usam `<div style>` em vez de `<Flex>`** (anti-pattern). **Faltam:** integração `<Field>`, dark theme. |
| 4.8 | `.native.tsx` presente ou platform-split documentado | ⚠️ | Presente. **Sem JSDoc explicando o split** (web custom, native delega). Sem testes nativos. |
| 4.9 | Imports respeitam camadas | ✅ | foundations → ecosystem → components. |

**Métricas rápidas:**

- LOC: `switch.tsx` 139 · `switch.native.tsx` 54 · `SwitchProps.ts` 26 → **219 LOC.**
- Nº de testes: 22 (web only)
- Nº de stories: 5
- Dependências externas: 0 (web) · `react-native` (native — RNSwitch, View)

**Observações livres:**
- **Slots fantasma em Switch.Track/Thumb** = pior tipo de API: parece compound mas não é. Quem inspeciona o código de SwitchRoot vê o visual já renderizado lá. Quem lê a story acredita que `<Switch.Track><Switch.Thumb /></Switch.Track>` é necessário. **Decisão:** ou (a) remover Track/Thumb da API pública (Switch é elementar) ou (b) refatorar pra slot real (visual sai de SwitchRoot, vai pros slots).
- **Native sem teste** — silencioso.
- **`View` direto em native** = anti-pattern CLAUDE.md.

---

## 5. Governança

| # | Item | Status | Nota |
|---|---|---|---|
| 5.1 | Export público em `src/components/index.ts` | ✅ | `export * from './switch'`. |
| 5.2 | Tipos públicos exportados | ✅ | 4 tipos. |
| 5.3 | Mudança proposta tem changeset | N/A | — |
| 5.4 | Breaking change tem RFC | N/A | — |
| 5.5 | Guia de migração | N/A | — |

**Observações livres:**
- Re-export `Switch` (alias) + `Switch.Root`/`.Track`/`.Thumb` — caller usa qualquer um. Sem doc explicando.

---

## 6. Resumo executivo

**Score por eixo:** Visual `2/8` ❌ · Comportamental `4/8` ⚠️ · Funcional `5/8` ⚠️ · Código `5/9` ⚠️ · Governança `5/5` ✅

**Top 3 achados (por impacto):**

1. **`Switch.Track` e `Switch.Thumb` são slots fantasma** (#3.7). API mentirosa: caller acredita que está compondo o visual, mas o SwitchRoot já renderiza o real. **Prioridade alta** — ou remover da API pública ou refatorar para slot real.
2. **Touch target 24px (md) abaixo de 44px WCAG** (#2.5). Especialmente crítico em mobile-web. **Prioridade alta** — aumentar área touch via padding na `<Flex>` wrapper ou ampliar default `md`.
3. **Foco do teclado invisível + thumb não inverte em RTL** (#2.2/#2.8). Mesmas falhas de Radio — input oculto, transform fixo. **Prioridade alta** para a11y.

**Classificação geral:**
- [ ] ✅ Aprovado sem mudanças
- [x] ⚠️ Aprovado com fixes menores
- [ ] ❌ Requer mudanças antes da próxima release

---

## 7. Follow-ups

### Fix imediato (mesmo PR da review)

- [ ] **SW-1** Adicionar `displayName` em `SwitchTrack` (`'Switch.Track'`) e `SwitchThumb` (`'Switch.Thumb'`).
- [ ] **SW-2** Refatorar stories para usar `<Flex>` em vez de `<div style={...}>`.

### Issue (mudança localizada, sem breaking change)

- [ ] **SW-3** `forwardRef` em `SwitchRoot`.
- [ ] **SW-4** Foco visível no track quando o `<input>` recebe `:focus-visible` (boxShadow, outline, ou cor de borda).
- [ ] **SW-5** Touch target ≥ 44×44 — adicionar padding na `<Flex>` wrapper, manter visual track no tamanho atual mas ampliar área clicável.
- [ ] **SW-6** Respeitar `usePrefersReducedMotion` na `transition()`.
- [ ] **SW-7** RTL: usar `direction`-aware ou `inset-inline-start` em vez de `transform: translateX`.
- [ ] **SW-8** Native: trocar `View` por `Box`/`Flex`; mapear `aria-labelledby` para `accessibilityLabelledBy`.
- [ ] **SW-9** Native: criar testes (cobertura zero).
- [ ] **SW-10** Native: documentar diferença visual cross-platform (web custom vs SO native) em JSDoc + Storybook docs.
- [ ] **SW-11** Promover `width/height/padding/backgroundColor/transition` de `style={...}` para props declarativas.
- [ ] **SW-12** Story: integração `<Field>` completa, dark theme.

### RFC (sistêmico ou breaking change)

- [ ] **RFC candidata: Slots reais ou remoção em `Switch.Track`/`Switch.Thumb`** — decidir entre:
  - (a) Refatorar para slot real (visual sai de SwitchRoot, vai pros slots; caller obrigatório a passar `<Switch.Track><Switch.Thumb /></Switch.Track>`).
  - (b) Remover Track/Thumb da API pública; Switch é elementar (`<Switch />` apenas).
- [ ] **RFC candidata: Recipe `switch` consumida** (compartilhada com R6).
- [ ] **RFC candidata: Estratégia visual cross-platform para componentes interativos** — Switch é exemplo: web custom + native SO. Decidir se outros (Checkbox, Radio) devem seguir mesma direção (delegar ao SO em RN) ou ter visual unificado.
- [ ] **RFC candidata: Touch target padrão do DS** — quando native input + visual mínimo é menor que 44px, ampliar área touch via padding wrapper. Vale documentar como invariante.

---

## 8. Notas de arquiteto

- **Slots fantasma é um padrão preocupante de "compound theater"** — API parece compound mas não é. Vale auditar outros compounds em fases anteriores procurando o mesmo: slot exposto que não recebe estilo do recipe, não tem variant, e cujo conteúdo é puro children pass-through.
- **Web custom + native delegando ao SO** = trade-off legítimo (Switch native do iOS/Android é o padrão do produto na plataforma). Mas a divergência precisa ser **documentada**: caller no RN não pode esperar mesmo visual web. Hoje silencioso.
- **`<input>` invisível com track separado**: padrão recorrente em R6 (Radio, Switch, RadioCard). Nenhum reflete `:focus-visible` no visual. **Sweep de a11y** vale.
- **Touch target em formulários** é constante: Counter (R5) já tinha 24×24 em sm, Switch tem 24 em md, Radio Indicator é 20×20. WCAG 2.5.5 (Target Size) é AAA mas alvos < 24×24 são amplamente considerados ruins. Definir invariante do DS.
- **`aria-labelledby` ignorado em native** indica que mapeamento web ↔ native foi parcial. Doc + teste.
- **`size` ignorado em native** = silêncio confuso. Caller seta `size="lg"` esperando switch maior; em RN não há diferença. Documentar ou aceitar `size` como `web-only` prop.
