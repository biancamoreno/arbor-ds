# RFC-0028 — Catálogo curado de ícones (`<Icon name="..." />` tree-shake-friendly)

**Status**: Draft
**Autores**: @bia
**Data**: 2026-05-02 (revisada)
**PR**: —
**Fecha**: TD-027

**Origem**: hotfix de `size-limit` (2026-05-01, `project_size_limit_fix.md`). Externalizar `lucide-react`/`lucide-react-native` baixou os bundles da lib para 27/23 kB, mas a economia **não chega ao app consumidor**: `<Icon name="X" />` faz lookup runtime em `lucide.icons[name]`, e o bundler do app não consegue tree-shake — arrasta o catálogo lucide inteiro (~1500 ícones, ~600 kB).

**Revisão (2026-05-02):** uma primeira proposta sugeria trocar `name` (string) por `icon` (componente) para forçar import estático no consumidor. **Rejeitada** pela arquiteta: API pública precisa permanecer com `name` (DX simples, autocomplete, governança do catálogo do DS). Esta RFC adota outro caminho: **catálogo curado embutido**.

---

## Motivação

API por `name` é a forma certa do DS:
- DX simples (`<Icon name="Check" />`).
- Autocomplete trivial.
- Governança do catálogo concentrada no DS — produto não decide ícones isoladamente.

O problema **não é a string**; é o **lookup contra `lucide.icons`** (objeto que agrega 1500 ícones). Se o lookup acontecer contra um **objeto curado embutido na lib** com ~150 ícones essenciais, o bundle do consumidor inclui só esses ~150 (≈150 kB) em vez dos 1500 (≈600 kB). Ganho de **~75%**, sem mudar API e sem dependência de plugin externo.

Adicionalmente:
- `IconName` deixa de ser union de ~1500 strings (custo alto em hover/typecheck) e passa a ser union de ~150.
- Ícones disponíveis viram **decisão de design system**, não "qualquer ícone do lucide".

---

## Estado atual

```ts
// src/components/core/icon/interfaces/IconName.ts
import type * as Lucide from 'lucide-react';
export type IconName = keyof typeof Lucide.icons;       // ~1500 strings

// src/components/core/icon/core/icon.tsx
import { icons } from 'lucide-react';
const LucideIconComponent = icons[name];                 // lookup contra catálogo todo

// src/components/core/icon/core/icon.native.tsx
import * as lucideNative from 'lucide-react-native';
const LucideIconComponent = (lucideNative as Record<string, unknown>)[name];
```

26 arquivos consomem `<Icon name="..." />` internamente. Duas APIs públicas propagam `IconName`: `FloatingActionButtonProps.icon` e `TabBarItemProps.icon`. Tudo continua funcionando após esta RFC; o que muda é **de onde** o componente lucide é resolvido.

---

## Direção recomendada

### Catálogo curado embutido

A lib mantém um mapa estático de ícones essenciais com **import nomeado** (não namespace), em arquivos separados por plataforma:

```ts
// src/components/core/icon/internal/icon-map.ts (web)
import {
  Check, X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  ArrowLeft, ArrowRight, ArrowUp, ArrowDown,
  Search, Plus, Minus, Pencil, Trash2, Save, Copy, Download, Upload,
  Info, CircleCheck, TriangleAlert, CircleAlert, CircleHelp,
  House, User, Users, Bell, Mail, Phone, MessageCircle, MessageSquare, Send,
  ShoppingCart, ShoppingBag, CreditCard, Tag, Heart, Bookmark,
  Calendar, Clock,
  Settings, Sun, Moon, Eye, EyeOff, Filter, RefreshCw,
  Star, Compass, EllipsisVertical, CheckCheck,
  LoaderCircle, ImageOff, FileImage, File, Folder,
  LogIn, LogOut, Lock, Unlock,
  // ... lista completa em ~150 essenciais
} from 'lucide-react';

export const iconMap = {
  Check, X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  ArrowLeft, ArrowRight, ArrowUp, ArrowDown,
  // ... mesmas chaves
} as const;

export type IconName = keyof typeof iconMap;
```

```ts
// src/components/core/icon/internal/icon-map.native.ts
import { Check, X, /* ... */ } from 'lucide-react-native';
export const iconMap = { Check, X, /* ... */ } as const;
export type IconName = keyof typeof iconMap;
```

Engine do `Icon` consulta o mapa curado:

```tsx
// src/components/core/icon/core/icon.tsx
import { iconMap } from '../internal/icon-map';

export function Icon(props: IconProps) {
  const { name, size = 'medium', /* ... */ } = props;
  const IconComponent = iconMap[name];
  if (!IconComponent) return null;
  // ...
}
```

### Por que essa forma

- **Bundle do consumidor**: bundlers (Vite/Rollup/esbuild/swc) fazem **constant folding** em objetos literais com keys/values estáticos. Tree-shake elimina ícones do `iconMap` que **nenhum** consumidor referencia via string literal. Em apps reais com `<Icon name="..." />` predominantemente literal, o bundle inclui só o que é usado. No pior caso (todos os 150 referenciados ou string dinâmica), inclui os 150 (~150 kB) — **muito** melhor que 1500 (~600 kB).
- **Sem mudança de API**: `<Icon name="Check" />` continua igual.
- **Sem plugin externo**: nenhum requisito de toolchain do consumidor.
- **`IconName` enxuto**: 150 strings em vez de 1500. Hover/typecheck/autocomplete melhoram.
- **Cross-platform homogêneo**: mesmas chaves em web e native.
- **Governança clara**: novos ícones entram via PR no DS; produto não escolhe arbitrariamente.

### Alternativas piores

- **Plugin oficial Vite/Babel/Metro** (rejeitada): tree-shake máximo, mas custo alto de manutenção (3 plugins) + adoção ativa pelo consumidor.
- **API por componente (`icon={Check}`)** (rejeitada pela arquiteta): muda a API pública, perde governança e DX.
- **Lazy `import()`** (rejeitada): runtime async, flash de Suspense em ícones de botão.

### Trade-offs aceitos

- **Catálogo limitado** ao que o DS curates. Produto que precisa de ícone fora do catálogo: abre PR para adicionar (caminho preferido — concentra decisão de design no DS) **ou** RFC futura define escape hatch via `customIcon` (slot opcional). Não entra nesta RFC.
- **Tree-shake parcial**: 150 kB no pior caso, não 5–20 kB. Caminho para tree-shake máximo (plugin) fica registrado como possível evolução futura, sem urgência.
- **Curadoria manual**: ~150 ícones precisam ser escolhidos com cuidado. Cobertura inicial: superset dos usos internos do DS + categorias essenciais (navegação, comunicação, comércio, status, mídia, files, auth, tempo, UI).

---

## Estrutura proposta

```
src/components/core/icon/
  core/
    icon.tsx                # consome iconMap (web)
    icon.native.tsx         # consome iconMap (native)
    icon-showcase.tsx       # itera Object.keys(iconMap) — 150 ícones, não 1500
    icon.test.tsx
    icon.native.test.tsx
    icon.stories.tsx
  internal/
    icon-map.ts             # web — imports nomeados de lucide-react
    icon-map.native.ts      # native — imports nomeados de lucide-react-native
    index.ts                # re-export type IconName
  interfaces/
    IconProps.ts            # type IconName vem de internal
    IconName.ts             # ❌ DELETADO
    index.ts
  index.ts
```

A lista de ícones é **idêntica entre web e native** (mesmas chaves), divergindo apenas na fonte (`lucide-react` vs `lucide-react-native`). Um teste de paridade garante que ambos os arquivos exportam o mesmo conjunto de chaves.

---

## API / tipagem proposta

API pública preservada:

```tsx
import { Icon } from 'arbor-ds';

<Icon name="Check" />                                        // ✅ decorativo
<Icon name="Check" decorative={false} aria-label="OK" />     // ✅ semântico
<Icon name="ImaginárioIcon" />                               // ❌ erro de tipo (não está no catálogo)
```

`IconName` continua sendo o tipo público; mudança é apenas no que ele resolve para — `keyof typeof iconMap` em vez de `keyof typeof Lucide.icons`.

`FloatingActionButtonProps.icon: IconName` e `TabBarItemProps.icon: IconName` não precisam mudar.

---

## Estratégia cross-platform

| Aspecto | Web | Native |
|---|---|---|
| Fonte | `lucide-react` | `lucide-react-native` |
| Arquivo | `internal/icon-map.ts` | `internal/icon-map.native.ts` |
| Resolução | `iconMap[name]` (mesmo objeto literal) | idem |
| `currentColor` | herda CSS | resolvido para `theme.colors.text.primary` |

Teste de paridade (`icon-map.parity.test.ts`):

```ts
import { iconMap as web } from './internal/icon-map';
import { iconMap as native } from './internal/icon-map.native';

it('web e native expõem o mesmo conjunto de ícones', () => {
  expect(Object.keys(web).sort()).toEqual(Object.keys(native).sort());
});
```

---

## Impacto em DX

**Ganhos:**
- `IconName` (1500 → 150 strings): autocomplete e typecheck mais rápidos; hover types legíveis.
- Catálogo curado funciona como inventário visível: `Object.keys(iconMap)` lista exatamente o que o DS endossa.
- Showcase passa a mostrar o catálogo do DS, não o lucide inteiro.

**Custos:**
- Produto que precisa de ícone fora do catálogo: PR no DS. Custo: tempo de coordenação. Mitigação: catálogo inicial generoso (~150) cobre 95%+ dos casos reais; PR é a forma certa de adicionar.

---

## Impacto em acessibilidade e performance

**A11y**: zero. Discriminated union de `decorative` (RFC-0010) e tokens semânticos de tamanho (RFC-0009 + normalização 2026-05-02) preservados.

**Performance**:
- **Bundle do consumidor**: estimativa **600 kB → 150 kB** (≈75%). No caso ideal (Vite + tree-shake agressivo + strings literais), bundlers podem reduzir ainda mais via constant folding do `iconMap`.
- **Bundle da lib**: marginalmente maior (lista de ~150 imports em vez de 1 namespace). `lucide-react` continua externo; só a lista de imports muda — não há código embutido.
- **Runtime**: idêntico (lookup em objeto).
- **Build (typecheck)**: mais rápido (`IconName` 10× menor).

---

## Plano de execução

### PR 1 — Catálogo curado + engine

1. Criar `src/components/core/icon/internal/icon-map.ts` com ~150 imports nomeados de `lucide-react`.
2. Criar `src/components/core/icon/internal/icon-map.native.ts` com os mesmos nomes vindos de `lucide-react-native`.
3. Criar `src/components/core/icon/internal/index.ts` re-exportando `iconMap` e `type IconName`.
4. Atualizar `IconProps.ts`: `import type { IconName } from '../internal'`.
5. Deletar `src/components/core/icon/interfaces/IconName.ts`.
6. Atualizar `interfaces/index.ts`: remover `export * from './IconName'`.
7. Reescrever `icon.tsx`: remover `import { icons } from 'lucide-react'`, consumir `iconMap`.
8. Reescrever `icon.native.tsx`: remover `import * as lucideNative`, consumir `iconMap` da `.native`.
9. Atualizar `icon-showcase.tsx`: iterar `Object.keys(iconMap)` em vez de `Object.keys(icons)`.
10. Adicionar `icon-map.parity.test.ts`.
11. Verificar que cada `name` usado internamente (`Check`, `X`, `ChevronDown`, etc.) está no catálogo. Se algum faltar, adicionar à curadoria.

**Critério de saída do PR 1**: `pnpm test`, `pnpm tsc -b`, `pnpm lint`, `pnpm build:lib`, `pnpm test:platform-contract --strict`, `pnpm test:no-color-literal` — todos verdes. Suíte 910/910 (ou ajuste pontual pela paridade nova).

### PR 2 — Documentação + size-limit assertion

1. `CONTRIBUTING.md` §Icon: explicar catálogo curado, como adicionar ícone novo (PR no DS), API preservada.
2. `README.md`: ajuste em "primeiros passos" se necessário.
3. `docs/TECH_DEBT.md`: TD-027 → `Resolved (data, commit)`.
4. `size-limit`: confirmar que limites atuais (50/40 kB) seguem verdes; opcional: adicionar `examples/consumer-bundle-size` com app sintético para regressão automática.
5. Storybook: showcase mostra catálogo curado; opcional: barra de busca limitada às ~150 entradas.

---

## Critérios de qualidade

- [ ] `IconName` deriva de `keyof typeof iconMap` (não de `keyof typeof Lucide.icons`).
- [ ] `import { icons } from 'lucide-react'` removido de `icon.tsx`.
- [ ] `import * as lucideNative from 'lucide-react-native'` removido de `icon.native.tsx`.
- [ ] `iconMap` web e native têm o mesmo conjunto de keys (teste de paridade verde).
- [ ] Todos os 26 consumidores internos resolvem para um `name` que está no catálogo.
- [ ] `pnpm test` verde (910/910 ± ajustes pontuais).
- [ ] `pnpm tsc -b` verde.
- [ ] `pnpm lint` verde.
- [ ] `pnpm build:lib` verde; bundles `dist/components.js` ≤ 50 kB e `dist/native.js` ≤ 40 kB.
- [ ] `pnpm test:platform-contract --strict` verde.
- [ ] `pnpm test:no-color-literal` verde.
- [ ] `CONTRIBUTING.md` §Icon atualizado.
- [ ] `docs/TECH_DEBT.md` — TD-027 marcada `Resolved (YYYY-MM-DD, commit-hash)`.

---

## Riscos e mitigação

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Produto consumidor depende de ícone fora do catálogo | Média | Catálogo inicial generoso (~150) cobre casos comuns; PR no DS é caminho oficial; RFC futura para `customIcon` se gatilho aparecer |
| Bundler do consumidor não faz constant folding adequado | Baixa | Vite/Rollup/esbuild/swc fazem por padrão. Webpack 5 também. Documentar requisito mínimo `sideEffects: false` (já é o caso de lucide-react@1.x). |
| Drift entre `iconMap` web e native | Média | Teste de paridade `icon-map.parity.test.ts` é gate obrigatório. |
| Showcase fica longo (150 ícones) | Baixa | UX de busca já existe; 150 é gerenciável (catálogos de DSes maduros: ~50–200). |

---

## Decisão

**Recomendada:** aprovar e executar em 2 PRs conforme plano. API pública preservada (`name`). Sem alias legacy (não há mudança de API). TD-027 fecha ao final do PR 2.
