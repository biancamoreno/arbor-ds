# Prompts de Fase — Arbor DS Rearquitetura

Cada arquivo nesta pasta é um **prompt autossuficiente** para implementar uma fase do plano de rearquitetura definido em `docs/ARCHITECTURE_EVOLUTION_PLAN.md`.

## Como usar

Cole o conteúdo do arquivo de fase desejado diretamente como prompt para o Claude Code, ou rode:

```
@docs/tasks/fase-NN-<nome>.md implemente esta fase
```

Cada prompt contém:
- Contexto do estado atual do codebase (paths reais)
- Objetivo claro e escopo fechado
- Entregáveis com código de referência
- O que **não** fazer nesta fase
- Critérios de aceite verificáveis

## Sequência e dependências

```
Fase 0 (bloqueante para tudo)
  └─> Fase 1 (separação lib/demo)
  └─> Fase 2 (tokens) — paralelo com Fase 1
       └─> Fase 3 (fronteiras) — requer Fases 0-2
            └─> Fase 4 (engine) — requer Fases 0-3  ← ALTO RISCO
                 ├─> Fase 5 (recipes) — paralelo com Fase 6
                 ├─> Fase 6 (behavior primitives) — paralelo com Fase 5
                 ├─> Fase 7 (cross-platform) — paralelo com Fase 8
                 └─> Fases 5+6 habilitam:
                      ├─> Fase 8 (Field/Input)
                      └─> Fase 8+6 habilitam:
                           └─> Fase 9 (Overlays)
                                └─> Fase 10 (componentes pendentes)
                                     └─> Fase 12 (release 1.0.0)
Fase 11 (Storybook) — começa na Fase 4, cresce com cada fase
Fase 12 (governança) — changesets/commitlint desde Fase 1; release só após Fase 10
```

## Índice de fases

| Arquivo | Fase | Bloco | Risco | Dias-pessoa |
|---|---|---|---|---|
| [fase-00-baseline-ci.md](fase-00-baseline-ci.md) | 0 — Baseline executável & CI | I | Baixo | 3–5 |
| [fase-01-separacao-lib-demo.md](fase-01-separacao-lib-demo.md) | 1 — Separação lib/demo/Expo | I | Médio | 2–3 |
| [fase-02-fundacao-tokens.md](fase-02-fundacao-tokens.md) | 2 — Fundação de tokens consolidada | I | Baixo | 2–3 |
| [fase-03-fronteiras-arquiteturais.md](fase-03-fronteiras-arquiteturais.md) | 3 — Fronteiras arquiteturais protegidas | I | Baixo | 1–2 |
| [fase-04-engine-contrato-unico.md](fase-04-engine-contrato-unico.md) | 4 — Engine de estilo: contrato único | II | **Alto** | 5–8 |
| [fase-05-recipes-slots.md](fase-05-recipes-slots.md) | 5 — Recipes, slots e variants | II | Médio | 3–5 |
| [fase-06-behavior-primitives.md](fase-06-behavior-primitives.md) | 6 — Primitives de comportamento | II | Médio | 4–6 |
| [fase-07-cross-platform-formal.md](fase-07-cross-platform-formal.md) | 7 — Cross-platform formalizado | II | Baixo | 2–3 |
| [fase-08-field-input.md](fase-08-field-input.md) | 8 — Família Field/Input reconstruída | III | **Alto** | 5–8 |
| [fase-09-overlays.md](fase-09-overlays.md) | 9 — Overlays reconstruídos | III | Médio | 4–6 |
| [fase-10-componentes-pendentes.md](fase-10-componentes-pendentes.md) | 10 — Componentes pendentes MVP | III | Baixo | 6–10 |
| [fase-11-documentacao-playground.md](fase-11-documentacao-playground.md) | 11 — Documentação viva & Storybook | III | Baixo | 3–5 |
| [fase-12-governanca-release.md](fase-12-governanca-release.md) | 12 — Governança, release & distribuição | III | Baixo | 2–4 |

**Total estimado: 42–68 dias-pessoa**

## Regras globais de merge (todas as fases)

Nenhuma fase mergeia sem:
- [ ] `pnpm typecheck` (ou baseline congelado documentado).
- [ ] `pnpm lint` e `pnpm depcheck` verdes.
- [ ] `pnpm test -- --ci` passando.
- [ ] `pnpm build:lib` sem erro.
- [ ] Guia de migração se há breaking change de API pública.
