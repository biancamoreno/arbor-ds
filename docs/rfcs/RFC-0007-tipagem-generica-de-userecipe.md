# RFC-0007 — Tipagem genérica do retorno de `useRecipe`

**Status**: Draft
**Autores**: Arquiteto Arbor-DS
**Data**: 2026-04-24
**Origem**: R3 · achado em `text.md`
**PR**: —

---

## Motivação

`useRecipe('text', { variant })` retorna um tipo opaco. Quem precisa ler um valor específico da recipe é forçado a fazer downcast:

```tsx
// text.tsx:15 — código atual
const styles = useRecipe('text', { variant });
const lineHeight = (styles as Record<string, unknown>).lineHeight as string | undefined;
```

Esse cast `Record<string, unknown>` é:

- **Inseguro** — qualquer chave passa, qualquer tipo de retorno passa.
- **Reincidente** — todo componente com recipe que precise inspecionar valores específicos vai repetir o pattern.
- **Difícil de auditar** — refactor da recipe (rename, remoção de chave) não acusa em compile-time.

A causa raiz: `useRecipe` perde a estrutura tipada da recipe quando aplica variantes. O retorno é tipado como genérico aberto.

Em um DS com **18 recipes** já no tema (e mais a adicionar — ver R1-C6), esse pattern vai se multiplicar por todos os componentes que componham estilos derivados de recipe.

## Proposta

Tipar `useRecipe` com genérico parametrizado pelo nome da recipe e pelas variantes ativas.

```tsx
// Assinatura proposta
function useRecipe<K extends keyof ThemeComponents>(
  name: K,
  variants?: RecipeVariants<ThemeComponents[K]>
): RecipeStyles<ThemeComponents[K]>;

// Uso
const styles = useRecipe('text', { variant: 'body' });
// styles agora tem tipo:
// {
//   fontSize: string;
//   lineHeight: string;
//   fontWeight: number;
//   ...
// }

const lineHeight = styles.lineHeight; // ✅ tipado, sem cast
```

`RecipeStyles<T>` é um tipo helper que extrai a forma do output da recipe baseado na config (`base` + `variants` resolvidas).

Para slot recipes (`defineSlotRecipe`), o retorno é um objeto com chave por slot:

```tsx
const styles = useRecipe('field', { size: 'md' });
// styles: { root: {...}, label: {...}, helperText: {...}, ... }
```

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| Manter cast manual em cada consumidor | Já demonstrado inseguro e reincidente. |
| Forçar tipo concreto por componente (overload manual) | Não escala — cada nova recipe precisa overload. |
| Usar `as const` em recipes para inferência | Reduz parte do problema mas não resolve composição com variantes. |
| Extrair `getRecipeValue(name, variants, key)` tipado | Resolve para acessos pontuais; não cobre uso amplo de spread (`{...styles}`). |

## Impactos e trade-offs

- **Breaking change?** Não em runtime; potencialmente em compile-time (consumidores que dependiam de `Record<string, unknown>` veem tipos mais estritos).
- **Impacto em bundle size**: zero.
- **Impacto em performance**: zero (tipos não vão para runtime).
- **Impacto em DX**: melhora significativa — autocomplete em todos os outputs de recipe.
- **Impacto em acessibilidade**: nenhum direto.
- **Codemod necessário?** Talvez — remover casts manuais que viraram redundantes.

## Critérios de aceite

- [ ] `useRecipe` aceita genérico parametrizado pelo nome
- [ ] `RecipeStyles<T>` infere shape correto para `defineRecipe` e `defineSlotRecipe`
- [ ] `text.tsx`, `card.tsx`, `field.tsx` removem casts `as Record<...>` que viraram desnecessários
- [ ] Testes de tipo (`tsd` ou `expect-type`) cobrindo inferência correta
- [ ] Documentação de `useRecipe` com exemplo tipado

## Notas de implementação

- Esta RFC mexe na **engine** (`src/ecosystem/styled-system/recipes/`), não em componentes — mudança transversal.
- Pode haver edge cases com recipes que usam `compoundVariants` — verificar se `RecipeStyles<T>` resolve corretamente combinações compostas.
- Se a inferência ficar excessivamente complexa (perf de TypeScript), aceitar fallback para `unknown` em vez de `Record<string, unknown>` — pelo menos forçaria narrowing explícito do consumidor.
- Avaliar conjuntamente com **RFC-0003** (consolidação de aliases): se props canônicas são revistas, recipes usam tokens corretos sem ambiguidade.
