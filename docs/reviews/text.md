# Review — `Text`

> Use `✅ OK` / `⚠️ Melhoria` / `❌ Quebra` por item. Toda `⚠️` ou `❌` vira issue, PR ou RFC (ver seção 7).

**Fase:** R3 · **Camada:** `core` · **Status:** `concluído`
**Revisor:** Arquiteto Arbor-DS · **Data:** 2026-04-23 · **Versão atual:** `1.0.0`

---

## 0. Escopo

- **Arquivos fonte:** `src/components/core/text/core/text.tsx`, `text.native.tsx`
- **Story:** `src/components/core/text/core/text.stories.tsx`
- **Testes:** ausentes
- **Implementação nativa:** `text.native.tsx` — sim
- **Classificação cross-platform:** `platform-split` (lógica de HTML parsing apenas em web; RN usa versão simplificada)
- **Dependências internas:** `ArborTransform`, `useRecipe`, `htmlConverter`, `TextIterator`
- **Consumidores conhecidos:** `Accordion`, `Alert`, `Breadcrumb`, `Button`, `Checkbox`, `Chip`, `Dialog`, `Field`, `NavBar`, `Tag`, `Toast`, `Tooltip` — praticamente todo componente com texto usa `Text`.

---

## 1. Visual

| # | Item | Status | Nota |
|---|---|---|---|
| 1.1 | Variantes declaradas × renderizadas no Storybook batem | ❌ | 20+ variantes em `TextVariant.ts`; Storybook tem 3 stories genéricas sem cobrir nenhuma variante nomeada. |
| 1.2 | Tokens usados são semânticos | ⚠️ | Recipe usa `fontSize.small` etc. (OK), mas `lineHeight` está hardcoded como `'20px'` na variante `body` e em outras — não é token. |
| 1.3 | Estados visuais: default, hover, disabled... | ✅ | `Text` é primitivo de conteúdo; estados interativos não se aplicam. |
| 1.4 | Escala de tamanhos coerente | ⚠️ | 20+ variantes existem mas não há visibilidade no Storybook para validar coerência. |
| 1.5 | Contraste ≥ WCAG AA | ⚠️ | Não verificável sem story de variantes com cores reais do tema. |
| 1.6 | Microinterações usam `transition()` | ✅ | Não aplicável para primitivo de texto estático. |
| 1.7 | Animações respeitam `usePrefersReducedMotion` | ✅ | Não aplicável. |
| 1.8 | Ícones usam `<Icon>` do DS | ✅ | Não aplicável. |

**Observações livres:**

A ausência de stories por variante torna impossível validar visualmente a consistência tipográfica do sistema. Com 20+ variantes (`bigNumber`, `display1`–`display4`, `title1`–`title2`, `body`, `caption`, etc.), a falta de documentação visual é uma dívida funcional que bloqueia adoção e onboarding.

---

## 2. Comportamental

| # | Item | Status | Nota |
|---|---|---|---|
| 2.1 | Navegação por teclado | ✅ | Não interativo por padrão; `as="a"` ou `as="button"` delegam ao elemento semântico. |
| 2.2 | Focus management | ⚠️ | `forwardRef` ausente — impossível gerenciar foco externamente (ex: `label.htmlFor` + scroll para erro). |
| 2.3 | `role` e `aria-*` | ⚠️ | `role` é aceito como `string` (muito permissivo); não há validação de combinações semânticas (`as="h1"` + `role="paragraph"` passa sem aviso). |
| 2.4 | Anúncios a leitor de tela | ✅ | Depende do elemento renderizado via `as`; correto. |
| 2.5 | Touch target ≥ 44×44 | ✅ | Não aplicável para elemento de texto não interativo. |
| 2.6 | Controlado × não-controlado | ✅ | Não aplicável. |
| 2.7 | Evento cancelável | ✅ | `onPress` e `onLinkPress` callbacks disponíveis. |
| 2.8 | Comportamento RTL | ⚠️ | Não documentado; `text-align` não é automaticamente invertido em RTL. |

**Observações livres:**

A prop `role?: string` deveria usar o tipo `React.AriaRole` (union de roles válidas) para bloquear strings inválidas em tempo de compilação. Isso é baixo custo e alta segurança para um primitivo usado em todo o DS.

---

## 3. Funcional (API)

| # | Item | Status | Nota |
|---|---|---|---|
| 3.1 | API mínima, sem props redundantes | ⚠️ | `isTruncated` está na interface e na assinatura (`_isTruncated`) mas não tem implementação — dívida ativa. |
| 3.2 | Naming de props segue convenção | ✅ | `variant`, `as`, `numberOfLines`, `isTruncated` — coerentes. |
| 3.3 | Defaults são "least surprise" | ⚠️ | `variant="caption"` como default pode surpreender — `caption` é geralmente o estilo menor/auxiliar. Seria mais seguro `variant="body"`. |
| 3.4 | Combinações inválidas bloqueadas via tipo | ⚠️ | `role?: string` aceita qualquer string. `as` está bem tipado com union literal, mas `variant` aceita `string` além do union (útil para extensão, mas perde autocomplete). |
| 3.5 | Polimorfismo via `as` | ✅ | Suportado com union restrita de tags semânticas de texto. |
| 3.6 | `forwardRef` presente; `displayName` definido | ❌ | Ausentes em ambas as plataformas. |
| 3.7 | Compound components com slots | ✅ | Não aplicável. |
| 3.8 | Tipos públicos exportados | ✅ | `TextProps`, `TextVariant`, `TextStyle` exportados via `index.ts`. |

**Surface area atual:**

```ts
interface TextProps<T> extends ArborTransformProps {
  variant?: T | ({} & string);        // union tipada + string aberta para extensão
  isTruncated?: boolean;              // ⚠️ prop declarada mas não implementada
  numberOfLines?: number;             // trunca por nº de linhas (web: WebKit; RN: nativo)
  onLinkPress?: (link: string) => void; // callback para links parseados do HTML
  as?: Extract<Tags, 'abbr' | 'b' | 'del' | 'em' | 'h1' ... 'a'>; // subset de tags
  role?: string;                      // ⚠️ deveria ser React.AriaRole
  onPress?: () => void | Promise<void>; // ⚠️ pouco usado; não documentado
}
```

**Observações livres:**

`onPress` está na interface mas não aparece usado na implementação web — parece dívida vinda de versão anterior ou intenção incompleta para interações de texto. Deve ser removido ou implementado.

A prop genérica `Text<T>` (onde `T` é o tipo de variante) é um padrão inteligente para extensão de produto, mas pode confundir. Documentar explicitamente no JSDoc seria suficiente.

---

## 4. Código

| # | Item | Status | Nota |
|---|---|---|---|
| 4.1 | Sem tags HTML puras | ✅ | Usa `ArborTransform` com `as`. |
| 4.2 | Sem `style={{...}}` onde há prop declarativa | ❌ | `truncatedProps` usa `style={{ boxOrient, WebkitLineClamp, WebkitBoxOrient, textOverflow }}` — essas são props vendor-prefix sem equivalente declarativo; escape hatch aceitável, mas deveria ser documentado como tal. |
| 4.3 | Estrutura de pasta aplicada | ✅ | `core/`, `interfaces/` presentes. |
| 4.4 | Estilo via `defineRecipe`/`defineSlotRecipe` | ✅ | `useRecipe('text', { variant })` — correto. |
| 4.5 | Sem `any`, sem cast não justificado | ⚠️ | `(styles as Record<string, unknown>).lineHeight` — cast para extrair `lineHeight` da recipe; indício de que a tipagem da recipe não expõe `lineHeight` diretamente. |
| 4.6 | Testes cobrem estados, variantes, a11y | ❌ | Nenhum teste existe. |
| 4.7 | Story cobre default, variantes, estados, playground | ❌ | 3 stories existem (Default, AsHeading, AsLabel, Scale) mas sem variantes tipográficas, sem story de truncamento, sem story de HTML parsing. Stories usam `style={{...}}` e `<div>` cru. |
| 4.8 | `.native.tsx` presente | ✅ | `text.native.tsx` existe com implementação correta para RN. |
| 4.9 | Imports respeitam camadas | ✅ | `../../../../ecosystem` — correto. |

**Métricas rápidas:**

- LOC do componente (web): ~45
- Nº de testes: **0**
- Nº de stories: 4 (nenhuma cobre variantes tipográficas)
- Dependências externas: 0 em runtime

**Observações livres:**

O cast `(styles as Record<string, unknown>).lineHeight` em `text.tsx:12` revela que `useRecipe` retorna tipo opaco. Isso força o desenvolvedor a fazer downcasting perigoso toda vez que precisar ler um valor específico da recipe. Vale avaliar se `useRecipe` pode retornar tipo genérico parametrizado (RFC separado).

---

## 5. Governança

| # | Item | Status | Nota |
|---|---|---|---|
| 5.1 | Export público correto | ✅ | Exportado de `src/components/core/index.ts` e `src/components/index.ts`. |
| 5.2 | Tipos públicos exportados | ✅ | `TextProps`, `TextVariant`, `TextStyle`. |
| 5.3 | Changeset entry | ⚠️ | Fixes recomendados aqui precisarão de changeset. |
| 5.4 | Breaking change tem RFC | ✅ | Nenhuma breaking change proposta. |
| 5.5 | Guia de migração | ✅ | Não necessário. |

---

## 6. Resumo executivo

**Score por eixo:** Visual `3/8` · Comportamental `4/8` · Funcional `5/8` · Código `4/9` · Governança `4/5`

**Top 3 achados (por impacto):**

1. **❌ Ausência total de testes** — primitivo usado por todo o DS sem nenhuma cobertura. Regressões em `numberOfLines`, HTML parsing e variantes não seriam detectadas.
2. **❌ `forwardRef` e `displayName` ausentes** — bloqueia integração com formulários acessíveis (`label + input focus`), devtools, e composição com bibliotecas externas.
3. **❌ Stories não cobrem variantes tipográficas** — 20+ variantes invisíveis no Storybook tornam o sistema tipográfico um black box para consumidores.

**Classificação geral:**
- [ ] ✅ Aprovado sem mudanças
- [ ] ⚠️ Aprovado com fixes menores (listados abaixo)
- [x] ❌ Requer mudanças antes da próxima release

---

## 7. Follow-ups

### Fix imediato (mesmo PR da review)

- [ ] `text.tsx` + `text.native.tsx`: adicionar `forwardRef` e definir `displayName = 'Text'`
- [ ] Remover prop `isTruncated` da interface (não implementada) ou implementar; se remover, é breaking — ver RFC
- [ ] Corrigir `role?: string` → `role?: React.AriaRole` em `TextProps.ts`
- [ ] Story `Scale`: substituir `<div style={{...}}>` por `<Flex flexDirection="column" gap="8px">` e remover uso de `style={{...}}`

### Issue (mudança localizada, sem breaking change)

- [ ] **[issue]** Criar suite de testes cobrindo: variantes, truncamento com `numberOfLines`, HTML parsing com `htmlConverter`, `as` polimórfico, role/aria, `onLinkPress`
- [ ] **[issue]** Criar stories para cada variante nomeada (`bigNumber`, `body`, `bodyHighlight`, `caption`, `display1`–`display4`, `title1`, `title2`, etc.)
- [ ] **[issue]** Criar story para HTML parsing com links clicáveis e `onLinkPress`
- [ ] **[issue]** Criar story para truncamento com `numberOfLines={2}` e conteúdo longo
- [ ] **[issue]** Fixar `lineHeight` hardcoded na recipe (`'20px'`) para usar token do tema
- [ ] **[issue]** Investigar e documentar `onPress` na interface — implementar ou remover

### RFC (sistêmico ou breaking change)

- [ ] **RFC-R3-A:** `isTruncated` como prop → se for implementar, define comportamento: boolean que ativa truncamento em 1 linha vs. `numberOfLines` para N linhas. Consolidar os dois em API coerente.
- [ ] **RFC-R3-B:** Tipagem de retorno de `useRecipe` — explorar tipo genérico parametrizado para evitar casts em consumidores.

---

## 8. Notas de arquiteto

**Padrão emergente — variante aberta (`T | string`):** `Text<T>` usa o padrão `variant?: T | ({} & string)` para permitir que produtos estendam as variantes sem quebrar tipos. Esse padrão pode ser formalizado como convenção DS (ver também `Button`, `Badge`). Se for adotado sistematicamente, merece documentação em CONTRIBUTING.

**Separação web vs. RN em Text:** A versão RN omite `htmlConverter` e `TextIterator` (correto — RN não parseia HTML). Essa divisão está bem executada. O risco está em consumidores que passam HTML string esperando renderização em RN — nenhum aviso é dado. Um `process.env.NODE_ENV !== 'production'` warning similar ao do `Icon` seria adequado.

**`truncatedProps` e `style` vendor-prefix:** O uso de `style={{ WebkitLineClamp, WebkitBoxOrient }}` é o único mecanismo cross-browser para truncamento multilinhas via CSS puro. É um escape hatch legítimo e difícil de eliminar. Documentar no código com comentário de uma linha explicando a necessidade ajudaria mantenedores futuros.
