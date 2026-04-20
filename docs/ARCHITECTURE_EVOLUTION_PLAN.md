# Plano de Evolução Arquitetural — Arbor DS

**Versão:** 1.0  
**Data:** Abril 2026  
**Escopo:** 13 fases (0–12), 3 blocos sequenciais, cada fase mergeable isoladamente

---

## 1. Diagnóstico

A base do Arbor-DS tem intenção arquitetural correta (foundations → ecosystem → components) mas a implementação ainda está em estado **pré-produto**. Os achados reais:

### Fronteiras & Distribuição

- `package.json` é `"private": true`, `"version": "0.0.0"`, sem `main`/`module`/`exports`/`types` — não é um pacote publicável.
- `App.tsx` e `src/main.tsx` são simultaneamente demo, entry do Expo e consumidor da lib.
- `base-theme.ts` **não** importa de `ecosystem` (achado corrige a alegação do brief anterior).
- `foundations/tokens/components/text` consome `../semantics` diretamente, misturando níveis.

### Foundations / Tokens

- Primitivas de `fontSize` têm só `10|16|20|28|32`, mas `text.ts` usa literais `14|18|24` ausentes — **theme drift**.
- `fontFamily.outfit` declarado e nunca consumido.
- `opacity` é híbrido confuso: `layer` (fração) + `color.black/white` (hex com alpha).
- `letterSpacing` naming inconsistente: `negative0.45` vs `nSmall`.
- Apenas `components.text` existe em theme — não há recipes para button, field, overlay.
- `theme/index.ts` não exporta `baseTheme` (bloqueia extensões avançadas).

### Styled-System Engine

- Dois caminhos de estilização concorrentes: `createStyle()` pelo transform + `style` inline mesclado sem resolução de tokens.
- `tokenCache` é um `Map` global sem invalidação — **memory leak silencioso** ao trocar tema em runtime.
- `use-breakpoint.ts` web retorna `'base'` hardcoded; `.native` faz resize-driven — divergência de contrato.
- `useToken` não cacheia (full-traversal por call).
- Responsive por array posicional é frágil — perde semântica.
- Pseudo-props definem 24+ seletores, mas `.native` trata apenas 4.
- `createCustomProps` não pluga no pipeline nem lê tema do contexto — utilitário órfão.
- `createVariant` faz merge de props mas **não tem noção de slot nem de recipe**.

### Components

- Apenas 3 de 11 primitives core têm `.native.tsx` (Grid, Text, Image) — promessa cross-platform é **parcialmente falsa**.
- 6 componentes são placeholders vazios: `avatar/`, `card/`, `carousel/`, `chip/`, `progress-bar/`, `switch/`.
- Modal, Drawer, Tooltip reimplementam dismiss/escape/z-index localmente — não há `Portal`, `FocusScope`, `DismissableLayer`, `Presence`.
- `FieldShell` existe mas Checkbox/RadioCard **não** usam — anatomia divergente na família Field.
- Apenas 1 teste (`box.test.tsx`). Sem cobertura comportamental, sem regressão visual, sem testes cross-platform.

### Governança

- Sem CI, sem pipeline de release, sem changelog, sem RFCs, sem definition-of-done.

---

## 2. Direção Recomendada

Dividir a evolução em **três blocos sequenciais** com 13 fases discretas. Cada fase é **mergeable isoladamente**.

**Princípios norteiros:**
1. **Engine única de estilo** — nenhuma superfície pública bypassa o transform.
2. **Anatomia por slots e recipes** — nenhum componente de média complexidade é monolítico.
3. **Comportamento compartilhado** — overlays, campos e seleção usam primitives internas comuns.
4. **Contrato cross-platform explícito** — cada componente declara `shared` / `web-only` / `native-ready`.
5. **Quality gates antes de features** — typecheck + testes + lint + build lib em CI antes de componente novo.
6. **Tema governa tudo** — recipes por componente, tokens semânticos cobrem todos os domínios.

---

## 3. Estrutura Alvo

```text
arbor-ds/
  packages/                              # monorepo futuro; single-package até lá
    core/                                # a lib distribuível
      src/
        foundations/
          tokens/ {primitives, semantics}
          theme/ {base-theme, theme-light, theme-dark, create-theme, types}
          breakpoints/
        engine/                          # ex-"styled-system"
          transform/                     # pipeline props→styles
          runtime/                       # platform adapters (.web / .native)
          recipes/                       # recipe & slot engine (novo)
          hooks/                         # use-theme, use-token, use-breakpoint, use-media
          provider/
          types/                         # tipagens públicas
        primitives/                      # layout + comportamento internos
          layout/ {box, flex, grid, container, center, square, circle, spacer, stack}
          typography/ {text, heading}
          interaction/ {clickable, press, focus-scope, dismissable-layer}
          overlay/ {portal, presence, overlay-stack}
          a11y/ {visually-hidden, id, announce}
        components/                      # UI pública
          {button, tag, badge, chip, avatar, card, ...}
          field/ {root, label, control, helper, error}
          input, textarea, select, checkbox, radio, switch
          dialog, drawer, tooltip, popover, menu
          tabs, accordion, breadcrumb
        patterns/                        # composições opcionais
        testing/                         # utilities de teste
      package.json                       # com exports por entrypoint
    docs/                                # Storybook + MDX
    playground/                          # app demo (não é lib)
  apps/                                  # examples (web, native)
  .changeset/                            # release automation
```

**Entrypoints públicos:**
```
arbor-ds                      → bundle principal (primitives + components web)
arbor-ds/native               → bundle nativo
arbor-ds/foundations          → tokens, theme, breakpoints
arbor-ds/engine               → transform, recipes, hooks (avançado)
arbor-ds/testing              → utilities para consumidores
```

---

## 4. Fases da Evolução

### **BLOCO I — Guardrails & Fundação (Fases 0–3)**

#### **Fase 0 — Baseline executável & CI mínima**

**Objetivo:** Tornar `typecheck`, `test`, `lint`, `build:lib` confiáveis e plugados em CI.

**Entregáveis:**
- `tsc --noEmit` verde (ou lista auditada de erros congelada).
- `jest` rodando web + native em suites separadas.
- ESLint + `@typescript-eslint` com regras de boundaries (alertando).
- `pnpm build:lib` (novo) separado do build do app demo.
- GitHub Actions: `lint`, `typecheck`, `test`, `build:lib` como required checks.
- `knip` ou `ts-prune` para inventário de dead code — output anexado à PR.

**Critérios de aceite:** PR em branch `chore/fase-0-guardrails` com pipeline verde, zero mudança em runtime.

**Risco:** Baixo.

---

#### **Fase 1 — Separação lib / demo / app Expo**

**Objetivo:** Fechar o escopo da biblioteca e extrair tudo que é aplicação.

**Entregáveis:**
- Mover `src/ecosystem/playground/*` para `playground/` na raiz.
- `App.tsx`, `index.js`, `app.json`, `metro.config.cjs` viram parte do `playground/` ou `apps/example-native/`.
- `src/main.tsx` vira `playground/main.tsx`.
- `package.json` da lib:
  - `"version": "0.1.0"` (experimental).
  - `"main"`, `"module"`, `"types"`, `"exports"` com subpath.
  - `peerDependencies`: `react`, `react-dom`, `react-native`, `react-native-web`.
  - Remover `expo`, `jest` etc. — mover para demo.
- `README.md` reescrito para refletir separação.

**Critérios de aceite:** `pnpm --filter core build` produz `dist/` publicável; `pnpm --filter playground dev` roda demo sem importar privado da lib.

**Risco:** Médio — mexe em entry points.

---

#### **Fase 2 — Fundação de tokens consolidada**

**Objetivo:** Eliminar drift de primitives/semantics/components.

**Entregáveis:**
- Acrescentar à escala `fontSize` primitiva: 12/14/18/24.
- Unificar `letterSpacing`: `tightest|tight|normal|wide|widest`.
- Separar `opacity` em: `opacity` (layer, fração) e `alphaColor` (branca/preta).
- Deletar `fontFamily.outfit` ou consumí-lo.
- Adicionar escalas: `motion` (durations + easings), `shadows`, `sizes` (32/40/48).
- Expor `baseTheme` em `foundations/theme/index.ts`.
- Script `pnpm tokens:validate` que carrega theme e valida zero órfãos.

**Critérios de aceite:** `pnpm tokens:validate` verde; nenhum literal solto fora das primitives.

**Risco:** Baixo — aditivo com codemods.

---

#### **Fase 3 — Fronteiras arquiteturais protegidas**

**Objetivo:** Impedir que `foundations` dependa de `ecosystem` e que `components` contorne o engine.

**Entregáveis:**
- Regra ESLint (`eslint-plugin-boundaries` ou `dependency-cruiser`) ativa e bloqueante.
- `depcruise` no CI.
- Corrigir import cross-layer de `tokens/components/text`.

**Critérios de aceite:** `pnpm depcheck` e `pnpm boundaries` verdes; violação trava PR.

**Risco:** Baixo — cirúrgico.

---

### **BLOCO II — Engine & Infraestrutura (Fases 4–7)**

#### **Fase 4 — Engine de estilo: contrato único**

**Objetivo:** Eliminar dois caminhos concorrentes de estilização.

**Entregáveis:**
- Unificar path de `style` inline com transform.
- `tokenCache` passa a ser **por-tema**, invalidável (`WeakMap<Theme, Map>`).
- `useToken` consome o mesmo cache.
- Responsive: array → objeto nomeado `{ base: 'small', md: 'large' }`.
- `use-breakpoint.ts` web: implementação real com `matchMedia`.
- `testID`: contrato formal — tipo público, forwarding garantido.
- Tipagem polimórfica com `as`: padrão `ComponentPropsWithRef<As> & StyleProps`.

**Critérios de aceite:** Suite >40 testes do engine (resolução, responsive, pseudos, polimorfismo, testID, style, ref).

**Risco:** Alto — é o coração. Merece feature flag interna.

---

#### **Fase 5 — Recipes, slots e variants de verdade**

**Objetivo:** Trazer o tema para governar a UI inteira.

**Entregáveis:**
- API `defineRecipe({ base, variants, compoundVariants, defaultVariants, slots })`.
- API `defineSlotRecipe({ slots, base, variants })`.
- Integração com `createTheme`: `theme.components.{component}` aceita recipe tipado.
- Migrar `tokens/components/text` para `theme.components.text` com recipe propriamente dito.
- Criar recipes para: `button`, `field`, `input`, `tag`, `dialog`, `drawer`, `tooltip`, `tabs`.
- Hook `useRecipe(recipeName, props)`.

**Critérios de aceite:** `Text` reescrito consumindo `theme.components.text` via `useRecipe`.

**Risco:** Médio-alto — redesenho de API interna.

---

#### **Fase 6 — Primitives de comportamento compartilhadas**

**Objetivo:** Parar de reimplementar overlay/focus/dismiss em cada componente.

**Entregáveis:**
- `Portal` (web: ReactDOM; native: overlay-host).
- `Presence` — mount/unmount com animação.
- `FocusScope` — trap, auto-focus, restore.
- `DismissableLayer` — escape, outside-click.
- `OverlayStack` — z-index por ordem.
- `useControllableState`, `useId`, `useDisclosure`, `useLayoutId`.
- `useComposedRefs`.
- Variantes web e native quando divergem.

**Critérios de aceite:** Cada primitive com testes comportamentais (RTL + RN testing-library).

**Risco:** Médio — é aditivo.

---

#### **Fase 7 — Cross-platform formalizado**

**Objetivo:** Parar de prometer universalidade onde ela não existe.

**Entregáveis:**
- Cada componente ganha tag: `shared | web-only | native-ready`.
- Entrypoints distintos: `arbor-ds` (web) e `arbor-ds/native`.
- `Platform.select({ web, native, default })` interno.
- `.web.tsx` como convenção explícita.
- Verificador em CI: interface pública bate entre `.tsx` e `.native.tsx`.

**Critérios de aceite:** `pnpm test:platform-contract` verde.

**Risco:** Baixo — formalização.

---

### **BLOCO III — Componentes & Ecossistema (Fases 8–12)**

#### **Fase 8 — Família Field/Input reconstruída**

**Objetivo:** Field como caso-pioneiro do novo contrato (anatomia, slots, recipe, behavior).

**Entregáveis:**
- `Field.Root`, `Field.Label`, `Field.Control`, `Field.Description`, `Field.Error` com contexto.
- Migração: `TextInput`, `TextArea`, `Select`, `Checkbox`, `Radio`, `Switch`, `Counter`, `FileUpload`, `SearchInput`.
- `Select` usando `Listbox` primitive novo (sobre `OverlayStack` + `DismissableLayer` + `FocusScope`).
- Recipes de campo no `theme.components.field`.
- Split nativo `.native.tsx` para todos.

**Critérios de aceite:** Cada componente >20 testes (comportamento + a11y + cross-platform); recipes permitem tema sem fork.

**Risco:** Alto — superfície pública muda. Codemod + guia de migração necessários.

---

#### **Fase 9 — Overlays reconstruídos**

**Objetivo:** Modal/Drawer/Tooltip/Popover/Menu sobre a infra da Fase 6.

**Entregáveis:**
- `Dialog` (renomear `Modal`; alias depreciado) com `Dialog.Trigger/Overlay/Content/Title/Description/Close`.
- `Drawer` reutiliza `Dialog` internamente.
- `Tooltip` com `Tooltip.Trigger/Content`.
- `Popover` novo.
- `Menu` novo (roving tabindex).
- `OverlayStack` cuidando z-index; dismiss; restore de foco.
- Variantes `.native.tsx` com back-button/gesture (Android).

**Critérios de aceite:** Lighthouse/axe sem violações; keyboard nav completa; testes comportamentais.

**Risco:** Médio-alto — breakings bem documentados.

---

#### **Fase 10 — Componentes pendentes & completude**

**Objetivo:** Preencher placeholders vazios e fechar surface MVP.

**Entregáveis:**
- `Avatar`, `AvatarGroup`.
- `Card` + slots.
- `Chip`, `Badge`, `ProgressBar`, `ProgressCircle`, `Spinner`.
- `Switch` (compatibilizado com Field).
- `Skeleton`.
- `Alert`, `Toast`, `Snackbar`.
- `Accordion`, `Breadcrumb`, `Pagination`.
- `Table` (minimal).

**Critérios de aceite:** Cada componente com recipe, `.native.tsx` quando aplicável, testes, MDX.

**Risco:** Baixo — construção aditiva.

---

#### **Fase 11 — Documentação viva & playground MDX**

**Objetivo:** Documentação deixa de ser vitrine e vira contrato.

**Entregáveis:**
- Storybook 8 (ou Ladle/Histoire).
- Stories: `Default`, `Playground`, `A11y`, `Variants`, `Cross-platform`.
- MDX com:
  - Props table (react-docgen-typescript).
  - Do/don't.
  - Guidelines de composição.
  - Diretrizes a11y.
  - Tokens showcase.
  - Theme switcher.
- Publicação estática (GitHub Pages).
- Playground React Native via Expo.

**Critérios de aceite:** Site público com build em CI, deploy em tag de release, ≥80% dos componentes com stories.

**Risco:** Baixo — aditivo.

---

#### **Fase 12 — Governança, release & distribuição**

**Objetivo:** Transformar evolução em produto versionado.

**Entregáveis:**
- Changesets (`@changesets/cli`) para versionamento semântico.
- Conventional Commits + commitlint + husky.
- Release via GitHub Actions → npm.
- `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, Definition of Done.
- RFCs em `docs/rfcs/`.
- Política de depreciação (2 minors de aviso + codemod).
- `api-extractor` para snapshot da API pública.
- Bundle size budget: `size-limit`.
- Matriz de suporte documentada: React 18+/19, RN 0.74+, RNW 0.21+.

**Critérios de aceite:** Primeiro release `1.0.0` com tudo acima; changelog público; site docs publicado.

**Risco:** Baixo.

---

## 5. Sequenciamento & Dependências

```
Fase 0 ─┬─> Fase 1 ─> Fase 2 ─┬─> Fase 3 ─> Fase 4 ─> Fase 5 ─┬─> Fase 6 ─> Fase 7 ──┬─> Fase 8 ─> Fase 9 ─> Fase 10
        │                     │                                │                     │
        └─ habilita CI ─────────────────── quality gates ──────┴── infra shared ─────┘
                                                                                      └─> Fase 11 ─> Fase 12
```

### Parallelização permitida

- **Fase 6** (behavior primitives) pode rodar em paralelo com **Fase 5** (recipes).
- **Fase 7** (cross-platform) pode rodar junto com **Fase 8** (Field).
- **Fase 11** (stories) começa em paralelo a partir da **Fase 4** — stories mínimas desde o engine.
- **Fase 12** (governance) pode começar em paralelo — changesets, commit lint — release pleno só depois de **Fase 10**.

### Sequência obrigatória

- **Fase 0** é bloqueante para todas.
- **Fases 1-3** são pré-requisito para **Fase 4**.
- **Fases 4-5** habilitam **Fases 8-10**.
- **Fase 6** habilita **Fase 9**.
- **Fase 10** habilita release em **Fase 12**.

---

## 6. Critérios de Qualidade Globais

Cada PR de fase só mergeia com:

- [ ] Typecheck verde.
- [ ] Lint + boundaries verde.
- [ ] Testes passando (unidade + comportamento).
- [ ] `pnpm build:lib` verde.
- [ ] Bundle size dentro do budget.
- [ ] Stories atualizadas (se toca componente).
- [ ] RFC mergeado (se redesenha contrato público).
- [ ] Guia de migração (se há breaking).
- [ ] A11y check (axe) sem regressões.

---

## 7. Estimativa Relativa

| Fase | Dias-pessoa (est.) | Risco | Bloqueante |
|------|--------------------|-------|-----------|
| 0    | 3–5                | Baixo | Sim       |
| 1    | 2–3                | Médio | Sim       |
| 2    | 2–3                | Baixo | Não       |
| 3    | 1–2                | Baixo | Sim       |
| 4    | 5–8                | Alto  | Sim       |
| 5    | 3–5                | Médio | Não       |
| 6    | 4–6                | Médio | Sim       |
| 7    | 2–3                | Baixo | Não       |
| 8    | 5–8                | Alto  | Não       |
| 9    | 4–6                | Médio | Não       |
| 10   | 6–10               | Baixo | Não       |
| 11   | 3–5                | Baixo | Não       |
| 12   | 2–4                | Baixo | Não       |
| **Total** | **42–68** | — | — |

---

## 8. Próximos Passos

1. **Validação**: Discutir com time, refinar prioridades.
2. **RFC Fase 0**: Documentar baseline, CI config, scripts.
3. **PR Fase 0**: Implementar CI, congelar baseline de erros.
4. **Issues de tracking**: Criar issue por fase em GitHub Projects.
5. **Documentação de cada fase**: Expandir RFC conforme cada uma é iniciada.

---

**Autor:** Claude Code (Arquiteto)  
**Status:** Aprovado para discussão  
**Última atualização:** Abril 2026
