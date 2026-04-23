# Review — `Container`

**Fase:** R2 · **Camada:** `core` · **Status:** `concluído`
**Revisor:** arquiteto · **Data:** 2026-04-22 · **Versão atual:** `1.0.0`

---

## 0. Escopo

- **Arquivos fonte:** `src/components/core/container/core/container.tsx`, `src/components/core/container/interfaces/ContainerProps.ts`
- **Story:** **ausente**.
- **Testes:** **ausentes**.
- **Implementação nativa:** não há `.native.tsx`. Delegado ao `ArborTransform`, mas Container usa `useTheme()` — funciona nos dois lados.
- **Classificação cross-platform:** `universal`.
- **Dependências internas:** `ArborTransform`, `useTheme`.
- **Consumidores conhecidos:** nenhum componente interno do DS; playground usa.

---

## 1. Visual

| # | Item | Status | Nota |
|---|---|---|---|
| 1.1 | Variantes declaradas × renderizadas no Storybook batem | ❌ | **Sem story.** |
| 1.2 | Tokens usados são semânticos | ⚠️ | `paddingInline="md"` usa alias semântico — ok. Mas `"md"` não é um alias válido de spacing (o semantic layer usa `none/nano/micro/tiny/small/medium/...`, confirmado no R1-foundations.md §1.2). **Token inválido passado silenciosamente** — depende de como a engine resolve token ausente (fallback no valor cru? undefined?). |
| 1.3–1.8 | — | N/A | — |

**Observações livres:** Este é um **bug em produção**. `"md"` não existe no semantic spacing. O componente ou está sem padding, ou está caindo num fallback indefinido.

---

## 2. Comportamental

| # | Item | Status | Nota |
|---|---|---|---|
| 2.1–2.8 | — | N/A | Estrutural. |

**Observações livres:** `paddingInline` é adequado para RTL, correto conceitualmente. Ponto positivo.

---

## 3. Funcional (API)

| # | Item | Status | Nota |
|---|---|---|---|
| 3.1 | API pública mínima; sem props redundantes | ⚠️ | Tem `fluid`, `centerContent`, `maxWidth`. `fluid` e `maxWidth` são **mutuamente exclusivos de forma implícita** (se `fluid=true`, `maxWidth` é ignorado) — não capturado pelo tipo. |
| 3.2 | Nomes seguem convenção | ✅ | |
| 3.3 | Defaults "least surprise" | ⚠️ | `maxWidth = { ...breakpoints }` quando nem `fluid` nem `maxWidth` é passado — ideia de "responsivo por padrão", mas o comportamento é opaco. `paddingInline="md"` sempre aplicado (não customizável). |
| 3.4 | Combinações inválidas bloqueadas | ❌ | `fluid && maxWidth` aceita ambos (a lógica prioriza `fluid` silenciosamente). Deveria ser **discriminated union**. |
| 3.5 | Polimorfismo via `as` | ⚠️ | Aceita `as`, mas apenas via Pick restrito. |
| 3.6 | `forwardRef` + `displayName` | ❌ | Ausentes. |
| 3.7 | Compound | N/A | — |
| 3.8 | Tipos exportados | ✅ | `ContainerProps`. |

**Surface area atual:**

```ts
export type ContainerProps = {
  fluid?: boolean;
  centerContent?: boolean;
  maxWidth?: BaseBreakpointConfig | keyof BaseBreakpointConfig;
} & Pick<ArborTransformProps, 'as' | 'backgroundColor' | 'background' | 'children'>;
```

**Observações livres:**

- **API super restritiva.** Container não aceita `padding` customizado, `testID`, `innerRef`, `className`, `id`, nenhuma prop de layout, cor, border, etc. Pick com 4 props em cima de um componente de layout quebra o princípio de extensibilidade. Consumidor que precise de `paddingBlock` está bloqueado.
- **Bug na resolução de `maxWidth` string:** código faz `breakpoints?.[Number(props.maxWidth)]` — `Number("md") === NaN`. Resolução por key só funcionaria se o consumidor passasse `"0"`/`"1"`/etc, mas o tipo é `keyof BaseBreakpointConfig = 'sm' | 'md' | 'lg' | 'xl' | '2xl'`. **Todo path de string está quebrado.**
- A branch `if (!props.fluid && !props.maxWidth) return { ...breakpoints }` produz um objeto com **índices numéricos e chaves nomeadas juntos** (R1-foundations §1.5, M6). Funciona acidentalmente porque a engine aceita, mas é um contrato fragilíssimo — se o ArborTransform amanhã interpretar responsive value mais estritamente, Container quebra.
- Falta `padding` configurável — produto real precisa ajustar (ex: NavBar com padding lateral menor).

---

## 4. Código

| # | Item | Status | Nota |
|---|---|---|---|
| 4.1 | Sem tags HTML puras | ✅ | |
| 4.2 | Sem `style={{...}}` | ✅ | |
| 4.3 | Estrutura de pasta aplicada | ⚠️ | `core/` + `interfaces/` ok; **sem `styles/`, sem `utils/`**, e o `useMemo` que calcula `maxWidth` deveria virar `utils/resolveMaxWidth.ts` para clareza e testabilidade. |
| 4.4 | Recipes | N/A | |
| 4.5 | Sem `any`, cast injustificado | ✅ | |
| 4.6 | Testes | ❌ | Zero. |
| 4.7 | Stories | ❌ | Zero. |
| 4.8 | `.native.tsx` ou platform-split justificado | ✅ | Delegado. |
| 4.9 | Imports respeitam camadas | ✅ | |

**Métricas rápidas:**

- LOC: **33**
- Nº de testes: **0**
- Nº de stories: **0**
- Dependências externas de runtime: **0**

**Observações livres:**

- O spread `{...(props.centerContent && { display: 'flex', flexDirection: 'column', alignItems: 'center' })}` depois de `display="block"` só funciona por **ordem de atribuição** do JSX — leitor casual não percebe que quando `centerContent` é `true`, `display` muda para `flex`.

---

## 5. Governança

| # | Item | Status | Nota |
|---|---|---|---|
| 5.1 | Export público em `src/components/index.ts` | ✅ | |
| 5.2 | Tipos públicos exportados | ✅ | |
| 5.3 | Changeset entry | N/A | |
| 5.4 | RFC para breaking change | N/A | |
| 5.5 | Guia de migração | N/A | |

---

## 6. Resumo executivo

**Score por eixo:** Visual `0/8` · Comportamental `—` · Funcional `2/8` · Código `5/9` · Governança `2/5`

**Top 3 achados (por impacto):**

1. **Token `paddingInline="md"` inválido** — `"md"` não está em `spacing` semantic. Container roda com padding indefinido (ou fallback silencioso). **Bug em produção.**
2. **Path `maxWidth: string` está quebrado** — `Number("md")` é `NaN`; acesso retorna `undefined`. Consumidor que seguir o tipo cai em comportamento inesperado.
3. **API artificialmente restrita** — Pick com 4 props em um primitive de layout impede extensão mínima (custom padding, testID, ref, outros estilos).

**Classificação geral:**
- [ ] ✅ Aprovado sem mudanças
- [ ] ⚠️ Aprovado com fixes menores
- [x] ❌ Requer mudanças antes da próxima release

---

## 7. Follow-ups

### Fix imediato (mesmo PR da review)

- [ ] Trocar `paddingInline="md"` por um token válido (`paddingInline="medium"` ou `paddingInline="large"`).
- [ ] Corrigir resolução de `maxWidth: string` — usar `breakpoints?.[props.maxWidth]` (acesso por chave nomeada), remover o `Number(...)`.
- [ ] Adicionar `displayName = 'Container'`.

### Issue

- [ ] Criar `container.stories.tsx` (default, fluid, maxWidth por chave, centerContent, combinações).
- [ ] Criar `container.test.tsx` (comportamento de cada prop, fallback de breakpoints, regressão do bug de `"md"`).
- [ ] Promover discriminated union para `fluid | maxWidth` (não deixar ambos coexistirem no tipo).
- [ ] Extrair `resolveMaxWidth` para `utils/` com testes isolados.

### RFC

- [ ] **RFC — Surface area de Container.** Decidir se Container deve aceitar `...rest` de `ArborTransformProps` (com possíveis defaults substituíveis) ou manter Pick restrito. Recomendação: aceitar rest; permitir override de `paddingInline` e ainda assim garantir `width: 100%` e `marginInline: auto` via ordem de spread. Fica coerente com Box/Flex/Grid.

---

## 8. Notas de arquiteto

- Container **tem a única lógica real** entre os R2 primitives (o resto é passthrough). Ironicamente, é o que **mais bugs tem**.
- O uso de `useTheme()` dentro dele é correto, mas a integração com `createBreakpoints` (que gera objeto híbrido array+keys — R1 M6) carrega um débito cross-cutting. Container é um dos **principais clientes** desse híbrido — se algum dia isso virar um objeto simples, Container precisa ser atualizado. Marcar o acoplamento.
- Como nenhum componente interno consome Container, refatoração pode ser agressiva. Oportunidade: tornar Container um **layout de referência** em vez de caixa genérica — decidir se é "page container" (centraliza + padding lateral) ou "section container" (só maxWidth). Hoje é as duas coisas, mal resolvido.
