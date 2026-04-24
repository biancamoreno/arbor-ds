# RFC-0003 — Consolidação de aliases de props (`flexDir`, `borderWidths`, `templateColumns`...)

**Status**: Draft
**Autores**: Arquiteto Arbor-DS
**Data**: 2026-04-24
**Origem**: R1 (H8) + R2 (H-R2-5)
**PR**: —

---

## Motivação

O sistema atual tem múltiplos pares prop / alias com semântica idêntica:

| Canônico | Alias atualmente aceito | Local |
|---|---|---|
| `flexDirection` | `flexDir` | `Flex` |
| `gridTemplateColumns` | `templateColumns` | `Grid`, `ArborTransform` |
| `gridTemplateRows` | `templateRows` | `Grid`, `ArborTransform` |
| `gridTemplateAreas` | `templateAreas` | `Grid`, `ArborTransform` |
| `gridAutoFlow` | `autoFlow` | `Grid`, `ArborTransform` |
| `gridAutoRows` | `autoRows` | `Grid` |
| `gridAutoColumns` | `autoColumns` | `Grid` |
| `borderWidth` | `borderWidths` | tema (R1 já removeu `borders`; `borderWidths` permanece) |

Custos:

- 2 nomes por conceito = autocomplete duplicado, busca sem resultado consistente, dúvida em code review ("qual é o oficial?").
- O caso `Grid` é o pior: o componente **só existe para renomear** as props (Grid faz `gridTemplateColumns={props.templateColumns}` e nada mais — se manteve canônico, Grid vira passthrough trivial).
- `flexDir` é abreviação herdada do styled-system de Chakra (legado). `flexDirection` é o nome CSS oficial.
- Inconsistência no DS: `Box` aceita `borderRadius` (não `radii`), mas tema expõe `radii`. Padrão dúbio.

## Proposta

**Eleger o nome CSS oficial como canônico.** Aliases curtos viram depreciados em wave coordenada:

| Decisão | Canônico | Depreciar |
|---|---|---|
| Flex | `flexDirection` | `flexDir` |
| Grid (todas as 6) | `gridTemplate*` / `gridAuto*` | `template*` / `auto*` |
| Tema | `borderWidth` | `borderWidths` |

**Implementação por etapas:**

1. **Etapa 1 (não-breaking):** Engine continua aceitando ambos. Adicionar `console.warn` em modo dev quando alias depreciado for usado. Remover alias da tipagem pública (continua funcionando em runtime, some do autocomplete).
2. **Etapa 2 (release seguinte, breaking):** Engine rejeita alias depreciado. Codemod converte automaticamente.

**Exceções intencionais — mantidos por razão load-bearing:**

- `space` e `sizes` apontam ambos para `spacing` no tema, mas o engine usa `theme.space` (padding/margin/gap) e `theme.sizes` (width/height) em rotas distintas (`getSpace`, `getSize`, `getWidth`). Não são aliases, são contratos diferentes resolvidos pela mesma fonte. **Manter.**

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| Manter ambos para sempre | Multiplica autocomplete, dificulta onboarding, perpetua inconsistência. |
| Eleger nome curto como canônico (`flexDir`) | Diverge do CSS — pior para quem vem do mundo web. |
| Migrar tudo de uma vez sem warn | Quebra consumidores sem aviso prévio. |

## Impactos e trade-offs

- **Breaking change?** Sim, na etapa 2. Coexistência na etapa 1.
- **Impacto em bundle size**: leve redução (engine remove rota de alias).
- **Impacto em performance**: desprezível.
- **Impacto em DX**: melhora — um nome por conceito, alinhado ao CSS.
- **Impacto em acessibilidade**: nenhum.
- **Codemod necessário?** Sim — substitui alias depreciado por canônico em arquivos `*.tsx`.

## Critérios de aceite

- [ ] Aliases removidos da tipagem pública (etapa 1)
- [ ] Warn dev emitido ao detectar uso de alias depreciado
- [ ] Codemod publicado em `tools/codemods/`
- [ ] Migration guide em `docs/migration/`
- [ ] Stories e playground migrados para nomes canônicos
- [ ] Após uma major, alias removido do runtime (etapa 2)

## Notas de implementação

- Conjuntamente com **RFC-0004** (Grid cross-platform): se Grid for restringido, parte das props deste RFC desaparece junto.
- O fix deve passar pela **engine de props** (`src/ecosystem/styled-system/system/props/`), não só pelos componentes — garante que `ArborTransform` direto também sofra a depreciação.
- Avaliar extração para `tools/lint/` de uma rule ESLint custom que sinaliza uso de alias depreciado em PR. Reduz dependência do warn de runtime.
