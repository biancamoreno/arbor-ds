# RFC-0002 — Genéricos `<T extends object>` em primitives de layout

**Status**: Accepted
**Autores**: Arquiteto Arbor-DS
**Data**: 2026-04-24
**Aceita em**: 2026-04-24
**Implementada em**: 2026-04-24 (junto com RFC-0001)
**Origem**: R2 · achado H-R2-4
**PR**: —

---

## Motivação

`Box`, `Center`, `Square`, `Circle` declaram-se como `Component<T extends object>(props: Props<T>)`. **Nenhum consumidor interno passa o type-argument**, e a justificativa do parâmetro genérico não está documentada em lugar nenhum.

Custos observados:

- Forçam o cast `memo(BoxComponent) as typeof BoxComponent` para preservar o genérico após `memo` (`box.tsx`, `flex.tsx`).
- Autocomplete pede um clique extra para revelar props (`Box<>` vs. `Box`).
- Tornam a assinatura de `forwardRef` mais verbosa (ver RFC-0001).
- O genérico não restringe combinações de props nem permite nada que `ArborTransformProps` simples já não permita.

Suspeita razoável: foi adicionado em momento de iteração e nunca foi exercitado por um caso real.

## Proposta

Remover o parâmetro genérico `<T extends object>` dos 4 primitives (`Box`, `Center`, `Square`, `Circle`). Tipar como:

```tsx
// Antes
function BoxComponent<T extends object>(props: BoxProps<T>) { ... }
export const Box = memo(BoxComponent) as typeof BoxComponent;

// Depois
const Box = forwardRef<HTMLElement, BoxProps>((props, ref) => { ... });
Box.displayName = 'Box';
export default memo(Box);
```

`BoxProps` deixa de ser `BoxProps<T>` — vira tipo concreto baseado em `ArborTransformProps`.

**Critério de exceção:** se aparecer um caso real em que o consumidor precise restringir/estender props via type-arg, formalizamos com `polymorphic-component` pattern (`as` + tipo derivado), que é mais expressivo e mais conhecido na comunidade.

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| Manter genéricos como estão | Custo de DX confirmado, ganho não demonstrado em 1+ ano de uso. |
| Substituir por `as` polimórfico tipado (Radix-style) | Bom caminho futuro, mas mudança maior — RFC separada se demanda surgir. |
| Documentar e manter | Não resolve o cast em `memo` nem o ruído em autocomplete. |

## Impactos e trade-offs

- **Breaking change?** Tecnicamente sim — quem escreveu `Box<MeuTipo>` quebra. Improvável em produção (sem consumidor interno usa).
- **Impacto em bundle size**: zero.
- **Impacto em performance**: leve melhora (sem cast em `memo`, possível memoização mais limpa).
- **Impacto em DX**: melhora — autocomplete direto, assinatura limpa.
- **Impacto em acessibilidade**: nenhum.
- **Codemod necessário?** Não (basta remover `<T>` se aparecer).

## Critérios de aceite

- [ ] Genérico removido de `Box`, `Center`, `Square`, `Circle`
- [ ] Casts `as typeof Component` removidos
- [ ] `BoxProps`, `CenterProps`, `SquareProps`, `CircleProps` viram tipos concretos
- [ ] Nenhuma regressão em testes existentes
- [ ] Decisão registrada em CONTRIBUTING: "primitives não recebem type-arg salvo justificativa explícita"

## Notas de implementação

- Implementar **junto com RFC-0001** — as duas mudam a assinatura dos primitives ao mesmo tempo, evita duas waves de breaking.
- Verificar se `Flex` e `Grid` também usam genérico — se sim, incluir.
- Caso surja resistência, alternativa intermediária: manter `<T extends ElementType = 'div'>` no estilo polymorphic (apenas para tipar `as`), mas é escopo maior.
