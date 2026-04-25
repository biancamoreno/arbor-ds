# RFC-0012 — Estados de `loading` e `error` com UI padrão em `Image`

**Status**: Implemented (2026-04-24)
**Autores**: Arquiteto Arbor-DS
**Data**: 2026-04-24
**Origem**: R3 · achado em `image.md`
**PR**: implementado em conjunto com RFC-0011

---

## Motivação

`Image` expõe `onError` e `onLoad` como callbacks, mas **não tem UI padrão para estados de loading e erro**. Consequências:

- **Imagem que falha em carregar fica invisível** — sem placeholder, sem fallback, sem indicação de erro. Em listas de produto/avatar isso é lacuna funcional grave (cards quebrados sem feedback).
- **Imagem em loading não tem skeleton** — UI "salta" quando carrega. Em conexões lentas, layout shift visível.
- **Cada consumidor recria a lógica.** Card, Avatar, Carousel — todos teriam que envolver `<Image>` em wrapper para tratar estados. Em vez disso, geralmente não tratam — consumidor herda o problema.

Para um primitivo cross-platform usado em produto real (e-commerce, listings), essa é responsabilidade que pertence ao próprio componente.

## Proposta

Adicionar suporte declarativo a estados via props opcionais:

```ts
type ImageProps = ImageBaseProps & {
  /** Conteúdo exibido enquanto a imagem carrega. Default: <Skeleton /> */
  fallback?: ReactNode | 'skeleton' | 'none';

  /** Conteúdo exibido se a imagem falhar em carregar. Default: ícone de erro genérico */
  errorFallback?: ReactNode | 'icon' | 'none';

  // ... resto
};
```

Comportamento:

```tsx
// Default — skeleton enquanto carrega; ícone de erro se falhar
<Image source="..." alt="..." />

// Custom loading
<Image source="..." alt="..." fallback={<Spinner size="md" />} />

// Sem fallback (comportamento legado)
<Image source="..." alt="..." fallback="none" errorFallback="none" />

// Custom error fallback
<Image source="..." alt="..."
  errorFallback={<EmptyState>Imagem indisponível</EmptyState>}
/>
```

Implementação:

- Estado interno `'loading' | 'loaded' | 'error'` controlado por `onLoad`/`onError` da `<img>` ou `<Image>` nativa.
- Render condicional: durante `loading`, exibe `fallback`; em `error`, exibe `errorFallback`; em `loaded`, exibe a imagem.
- Defaults usam componentes do DS (`<Skeleton>`, `<Icon name="image-off">`).
- `onLoad` e `onError` continuam disparando para consumidor — apenas adicionamos UI padrão.

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| Deixar consumidor implementar | Reincidente — todo consumidor reescreve; muitos esquecem. |
| Componente separado (`<ImageWithStates>`) | Duplica surface area; quem quer estados precisa lembrar de outro componente. |
| Render prop (`<Image>{(state) => ...}</Image>`) | Verboso; conflita com modo `background` (RFC-0011). |
| Compound (`<Image><Image.Loading>...</Image.Error>...`) | Caro para o caso comum; útil só em customização avançada. |

## Impactos e trade-offs

- **Breaking change?** Não — props novas opcionais; comportamento default melhora silenciosamente. Quem quiser comportamento legado passa `fallback="none"` `errorFallback="none"`.
- **Impacto em bundle size**: leve aumento (estado interno + render condicional + defaults usando Skeleton/Icon). ~1-2 kB.
- **Impacto em performance**: marginal (mais um state hook + 1-2 re-renders durante load).
- **Impacto em DX**: melhora — comportamento "que faz sentido" por default; customização opcional.
- **Impacto em acessibilidade**: melhora — `errorFallback` pode ter `role="img"` + `aria-label` legível; loading pode ter `aria-busy="true"`.
- **Codemod necessário?** Não.

## Critérios de aceite

- [ ] `Image` mantém estado interno `'loading' | 'loaded' | 'error'`
- [ ] `fallback` e `errorFallback` aceitam `ReactNode`, `'skeleton'`/`'icon'` ou `'none'`
- [ ] Defaults usam `<Skeleton>` e `<Icon name="image-off">`
- [ ] `onLoad` e `onError` continuam disparando para consumidor
- [ ] `aria-busy="true"` aplicado durante loading
- [ ] Stories cobrem: loading state, error state, custom fallbacks, `'none'`
- [ ] Testes cobrem: transições de estado, propagação de eventos, render condicional
- [ ] Documentação no JSDoc com exemplos

## Notas de implementação

- **Conjuntamente com RFC-0011** (modo de renderização): mesmo PR consolida mudanças em `Image`.
- Em **modo `background`** (RFC-0011), o estado de loading precisa funcionar com `Image()` JS DOM (não `<img>`) para detectar carregamento — usar pré-carregamento via `new window.Image()`.
- Em React Native, `Image.prefetch` ou estado nativo de loading via `onLoadStart`/`onLoadEnd` cobrem o caso.
- `<Skeleton>` precisa ter `width`/`height` que casem com a imagem para evitar layout shift — passar dimensões da Image automaticamente.
- Avaliar se o ícone padrão de erro deve ser `image-off` (Lucide) ou se vale criar um asset SVG dedicado do DS. Recomendação: começar com `image-off` para velocidade.
- Considerar prop futura `placeholder?: string` (URL de imagem de baixíssima resolução, blur up) em RFC separada se houver demanda.
