# Review — `Icon`

> Use `✅ OK` / `⚠️ Melhoria` / `❌ Quebra` por item. Toda `⚠️` ou `❌` vira issue, PR ou RFC (ver seção 7).

**Fase:** R3 · **Camada:** `core` · **Status:** `concluído`
**Revisor:** Arquiteto Arbor-DS · **Data:** 2026-04-23 · **Versão atual:** `1.0.0`

---

## 0. Escopo

- **Arquivos fonte:** `src/components/core/icon/core/icon.tsx`, `icon.native.tsx`
- **Story:** `src/components/core/icon/core/icon.stories.tsx` (+ `icon-showcase.tsx`)
- **Testes:** `src/components/core/icon/core/icon.test.tsx` — 10 testes
- **Implementação nativa:** `icon.native.tsx` — sim
- **Classificação cross-platform:** `platform-split` (`lucide-react` em web; `lucide-react-native` em RN; mesma interface pública)
- **Dependências internas:** nenhuma (primitivo folha)
- **Consumidores conhecidos:** `Alert`, `Accordion`, `Button`, `Chip`, `Dialog`, `NavBar`, `Spinner`, `TabBar`, `Tooltip`, `Toast` — componentes que exibem ícones semanticamente.

---

## 1. Visual

| # | Item | Status | Nota |
|---|---|---|---|
| 1.1 | Variantes declaradas × renderizadas no Storybook batem | ✅ | `Single`, `Decorative`, `Semantic`, `SizeVariants`, `StrokeVariants`, `Library` — cobertura excelente. |
| 1.2 | Tokens usados | ⚠️ | `size` e `color` são passados como valores brutos (`number`, `string`). Não há mapeamento para tokens de tamanho ou cor semântica. `strokeWidth` também é valor bruto. |
| 1.3 | Estados visuais | ✅ | Ícone é elemento estático; estados não se aplicam. |
| 1.4 | Escala de tamanhos coerente | ⚠️ | `size` aceita qualquer `number | string`. Sem enum de tamanhos DS (ex: `'sm' | 'md' | 'lg'`); consumidor deve saber que 20px = tamanho padrão. |
| 1.5 | Contraste ≥ WCAG AA | ✅ | `color="currentColor"` herda do contexto; responsabilidade do consumidor garantir contraste. |
| 1.6 | Microinterações | ✅ | Não aplicável para ícone estático. |
| 1.7 | Animações respeitam reduced motion | ✅ | Não aplicável. |
| 1.8 | Ícones usam `<Icon>` do DS | ✅ | Componente é o `<Icon>` do DS. |

**Observações livres:**

A ausência de tamanhos semânticos (tokens) é a lacuna visual mais relevante. Componentes downstream como `Button` passam `size={16}` diretamente — se o DS mudar a escala de ícones, todos os consumidores precisam ser atualizados manualmente. Um enum `IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'` mapeado para valores numéricos seria mais robusto.

---

## 2. Comportamental

| # | Item | Status | Nota |
|---|---|---|---|
| 2.1 | Teclado | ✅ | Ícone não é interativo por si só. |
| 2.2 | Focus management | ✅ | Não aplicável; `forwardRef` seria desnecessário para SVG puro. |
| 2.3 | `role` e `aria-*` | ✅ | `aria-hidden={decorative}` quando decorativo; `aria-label` quando semântico. Implementação correta. |
| 2.4 | Anúncios a leitor de tela | ✅ | `aria-label` com `decorative=false` anuncia corretamente. |
| 2.5 | Touch target | ✅ | Não aplicável; ícone compõe dentro de elemento interativo. |
| 2.6 | Controlado × não-controlado | ✅ | Não aplicável. |
| 2.7 | Evento cancelável | ✅ | Não aplicável. |
| 2.8 | RTL | ✅ | Lucide não usa direção; não aplicável. |

**Observações livres:**

O padrão `decorative={true}` como default é uma decisão razoável (a maioria dos ícones em DS é decorativa, com label no botão/contexto). O warning de dev para `decorative=false` sem `aria-label` é boa prática. A única melhoria seria elevar esse warning para erro de TypeScript em tempo de compilação (ver seção 3).

---

## 3. Funcional (API)

| # | Item | Status | Nota |
|---|---|---|---|
| 3.1 | API mínima, sem props redundantes | ✅ | `name`, `size`, `color`, `strokeWidth`, `decorative`, `aria-label`, `style`. Enxuta. |
| 3.2 | Naming segue convenção | ✅ | Props alinhadas com Lucide API; `decorative` é padrão de a11y reconhecido. |
| 3.3 | Defaults são "least surprise" | ✅ | `size=20`, `color="currentColor"`, `strokeWidth=1.75`, `decorative=true`. |
| 3.4 | Combinações inválidas bloqueadas | ⚠️ | `decorative=false` sem `aria-label` é válido em TypeScript; apenas warning de runtime. Ideal: discriminated union. |
| 3.5 | Polimorfismo via `as` | ✅ | Não aplicável; ícone é sempre SVG. |
| 3.6 | `forwardRef` presente; `displayName` definido | ⚠️ | `forwardRef` ausente (aceitável para SVG puro). `displayName` ausente. |
| 3.7 | Compound components / slots | ✅ | Não aplicável. |
| 3.8 | Tipos públicos exportados | ✅ | `IconProps`, `IconName` exportados via `index.ts`. |

**Surface area atual:**

```ts
interface IconProps {
  name: IconName;                // keyof typeof lucide-react icons — type-safe
  size?: number | string;        // ⚠️ deveria mapear para tokens de tamanho
  color?: string;                // ⚠️ deveria mapear para tokens de cor
  strokeWidth?: number;          // 1 | 1.5 | 1.75 | 2 (valores conhecidos)
  style?: CSSProperties;         // escape hatch CSS
  'aria-label'?: string;         // obrigatório quando decorative=false
  decorative?: boolean;          // true = aria-hidden; false = visível a leitores
}
```

**Observações livres:**

`IconName` como `keyof typeof icons` é excelente — elimina strings inválidas em compilação. O único risco é que adicionar/remover ícones da lib Lucide gera breaking change implícita em tipos. Monitorar upgrades de `lucide-react`.

A combinação `decorative=false` sem `aria-label` poderia ser forçada via discriminated union:

```ts
type IconProps =
  | { decorative: true; 'aria-label'?: never; ... }
  | { decorative: false; 'aria-label': string; ... }
  | { decorative?: undefined; 'aria-label'?: string; ... }
```

---

## 4. Código

| # | Item | Status | Nota |
|---|---|---|---|
| 4.1 | Sem tags HTML puras | ✅ | Usa componente Lucide que internamente renderiza SVG — exceção legítima (SVG é primitiva vetorial). |
| 4.2 | Sem `style={{...}}` | ✅ | `style` é prop explícita e documentada como escape hatch. |
| 4.3 | Estrutura de pasta | ✅ | `core/`, `interfaces/` presentes. |
| 4.4 | Estilo via recipe | ✅ | Sem recipe — primitivo folha sem variantes de layout/cor. |
| 4.5 | Sem `any`, sem cast não justificado | ⚠️ | `...(rest as object)` em `icon.tsx` — cast necessário para compatibilidade com tipo de Lucide (`LucideProps`). Aceitável com comentário. |
| 4.6 | Testes cobrem estados, a11y, interações | ✅ | 10 testes: render válido, null para nome inválido, aria-hidden, aria-label, warning de dev, size, color, strokeWidth, ícones distintos. |
| 4.7 | Story cobre default, variantes, estados, playground | ✅ | 5 stories + Library showcase. Melhor cobertura de stories entre os 4 componentes R3. |
| 4.8 | `.native.tsx` presente | ✅ | `icon.native.tsx` com adaptações corretas para RN. |
| 4.9 | Imports respeitam camadas | ✅ | Sem imports internos além das interfaces; correto para componente folha. |

**Métricas rápidas:**

- LOC do componente (web): ~30
- Nº de testes: **10**
- Nº de stories: **5** (+ Library)
- Dependências externas: `lucide-react` (web), `lucide-react-native` (RN) — peer deps

**Observações livres:**

O `icon-showcase.tsx` usa `style={{...}}` inline e `<button>` HTML cru — isso viola as regras CLAUDE.md mas é um componente auxiliar de demo (não de produção). Ainda assim, o padrão dado ao leitor das stories é ruim: quem abrir o código fonte do showcase aprenderá a usar `<button style={{...}}>` em vez de `<Clickable>`.

---

## 5. Governança

| # | Item | Status | Nota |
|---|---|---|---|
| 5.1 | Export público correto | ✅ | Exportado de `src/components/core/index.ts`. |
| 5.2 | Tipos públicos exportados | ✅ | `IconProps`, `IconName`. |
| 5.3 | Changeset entry | ⚠️ | Fixes recomendados precisarão de changeset. |
| 5.4 | Breaking change tem RFC | ✅ | Nenhuma breaking change proposta (tamanhos semânticos seriam breaking). |
| 5.5 | Guia de migração | ✅ | Não necessário para fixes atuais. |

---

## 6. Resumo executivo

**Score por eixo:** Visual `5/8` · Comportamental `8/8` · Funcional `6/8` · Código `7/9` · Governança `4/5`

**Top 3 achados (por impacto):**

1. **⚠️ `size` e `color` como valores brutos** — ausência de tokens semânticos cria dependência de valores hardcoded em todos os consumidores. Mudança de escala exige atualização manual em todo DS.
2. **⚠️ `displayName` ausente** — menor impacto aqui (sem forwardRef; SVG puro), mas inconsistente com padrão do DS.
3. **⚠️ `icon-showcase.tsx` viola padrão de código** — usa `<button>` e `style={{...}}` diretamente; ensina padrão errado a quem lê o código.

**Classificação geral:**
- [ ] ✅ Aprovado sem mudanças
- [x] ⚠️ Aprovado com fixes menores (listados abaixo)
- [ ] ❌ Requer mudanças antes da próxima release

**Melhor componente da fase R3 em qualidade** — testes sólidos, stories completas, a11y correta.

---

## 7. Follow-ups

### Fix imediato (mesmo PR da review)

- [ ] Adicionar `Icon.displayName = 'Icon'` em `icon.tsx` e `icon.native.tsx`
- [ ] Reescrever `icon-showcase.tsx`: substituir `<button style={{...}}>` por `<Clickable>` com props declarativas; substituir `<div style={{...}}>` por `<Box>`/`<Flex>`; substituir `<input>` por `<Box as="input">`; substituir `<span style={{...}}>` por `<Text>`

### Issue (mudança localizada, sem breaking change)

- [ ] **[issue]** Criar testes para `icon.native.tsx`: normalização de `currentColor`, normalização de size string, `accessibilityElementsHidden`, `accessibilityLabel`
- [ ] **[issue]** Story `SizeVariants` e `StrokeVariants`: substituir `<div style={{...}}>` e `<span style={{...}}>` por `<Flex>` e `<Text>`

### RFC (sistêmico ou breaking change)

- [ ] **RFC-R3-D:** Tamanhos semânticos para `Icon.size` — definir enum `IconSize = 'xs'|'sm'|'md'|'lg'|'xl'` com valores numéricos mapeados no tema (breaking change nos consumidores que passam número diretamente).
- [ ] **RFC-R3-E:** Discriminated union para `decorative` + `aria-label` — eliminar o runtime warning em favor de erro de compilação.

---

## 8. Notas de arquiteto

**`lucide-react` como peer dep:** A dependência é sólida (biblioteca madura, tree-shakeable por ícone em v1.x), mas cria um contrato implícito: `IconName` é exatamente `keyof typeof lucide-react/icons`. Upgrades da Lucide que adicionam/removem ícones alteram o tipo automaticamente. Se o DS precisar suportar ícones customizados (não-Lucide), a abordagem atual não escala — precisaria de uma camada de registro de ícones.

**Normalização `currentColor` → `#000000` no native:** Essa conversão em `icon.native.tsx` é correta (RN não suporta `currentColor`), mas perde o contexto de cor. Em temas dark, ícones sem cor explícita ficarão pretos no lugar de brancos. Consumidores em RN **devem** sempre passar `color` explicitamente. Merece warning de dev similar ao do `aria-label`.

**Padrão `decorative` vs. `role="img"`:** O DS usa `aria-hidden` para decorativo e `aria-label` para semântico. Uma alternativa igualmente válida seria `role="img"` com `aria-label` (sem `aria-hidden`). A abordagem atual está correta e alinhada com as práticas da comunidade — registrado aqui para evitar debates futuros.
