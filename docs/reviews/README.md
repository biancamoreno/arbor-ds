# Arbor-DS — Revisão Componente a Componente

Este diretório hospeda a revisão sistemática do Design System, um componente por vez, usando a rubrica fixa de 5 eixos (visual, comportamental, funcional, código, governança).

- **Template:** [`_template.md`](./_template.md) — duplique e preencha para cada componente.
- **Plano mestre:** este arquivo (fases, ordem, status).
- **Follow-ups:** cada achado vira fix, issue ou RFC — nunca os três no mesmo PR.

---

## Princípio de ordenação

Componentes são revisados por **dependência arquitetural** (montante → jusante). Consertar `Box` e `Text` antes de `Card` evita descobrir o mesmo achado N vezes.

---

## Fases

| Fase | Escopo | Componentes | Status |
|---|---|---|---|
| **R0** | Setup da rubrica e índice | — | ✅ concluído |
| **R1** | Auditoria de foundations | [R1-foundations](./R1-foundations.md) | ✅ concluído |
| **R2** | Core — layout primitives | [R2 consolidação](./R2-core-layout.md) · [Box](./box.md) · [Flex](./flex.md) · [Grid](./grid.md) · [Container](./container.md) · [Center](./center.md) · [Square](./square.md) · [Circle](./circle.md) · [Spacer](./spacer.md) · [Empty](./empty.md) | ✅ concluído |
| **R3** | Core — cross-platform primitives | [R3 consolidação](./R3-core-cross-platform.md) · [Text](./text.md) · [Clickable](./clickable.md) · [Icon](./icon.md) · [Image](./image.md) | ✅ concluído |
| **R4** | Botões e triggers | [Button](./button.md) · [ButtonGroup](./button-group.md) · [FloatingActionButton](./fab.md) | ⏳ pendente |
| **R5** | Formulário — base | [Field](./field.md) · [Input](./input.md) | ⏳ pendente |
| **R6** | Formulário — seleção | [Checkbox](./checkbox.md) · [Radio](./radio.md) · [RadioCard](./radio-card.md) · [Switch](./switch.md) · [Select](./select.md) | ⏳ pendente |
| **R7** | Feedback — indicadores | [Badge](./badge.md) · [Spinner](./spinner.md) · [Skeleton](./skeleton.md) · [ProgressBar](./progress-bar.md) · [ProgressCircle](./progress-circle.md) | ⏳ pendente |
| **R8** | Feedback — mensagens | [Alert](./alert.md) · [Toast](./toast.md) · [Tag](./tag.md) · [Chip](./chip.md) | ⏳ pendente |
| **R9** | Conteúdo | [Avatar](./avatar.md) · [Card](./card.md) · [Accordion](./accordion.md) · [Tabs](./tabs.md) · [Carousel](./carousel.md) | ⏳ pendente |
| **R10** | Dados | [Table](./table.md) · [Breadcrumb](./breadcrumb.md) · [Pagination](./pagination.md) | ⏳ pendente |
| **R11** | Overlays | [Dialog](./dialog.md) · [Drawer](./drawer.md) · [Tooltip](./tooltip.md) · [Popover](./popover.md) · [Menu](./menu.md) · ~~Modal~~ *(deprecation)* | ⏳ pendente |
| **R12** | Navegação | [NavBar](./nav-bar.md) · [TabBar](./tab-bar.md) | ⏳ pendente |
| **R13** | Consolidação sistêmica | RFCs de padrões emergentes · fixes cross-cutting · update de CONTRIBUTING | ⏳ pendente |

Legenda de status: ✅ concluído · 🟡 em revisão · ⏳ pendente · ⚠️ bloqueado.

---

## Definition of Done por fase

Uma fase só encerra quando:

- [ ] Todos os componentes da fase têm seu `docs/reviews/<nome>.md` preenchido (5 eixos).
- [ ] Todos os achados `❌` viraram PR merged ou RFC aberto.
- [ ] Todos os achados `⚠️` têm issue aberta e rotulada.
- [ ] `pnpm test` e Storybook build verdes ao final da fase.
- [ ] Entrada na `MEMORY.md` só se houver achado arquitetural não-óbvio (padrão escondido, convenção implícita).

---

## Trilhas de follow-up

| Trilha | Quando usar | Onde mora |
|---|---|---|
| **Fix imediato** | Typo, console.log, token cru, import errado, correção local | Mesmo PR da review |
| **Issue** | Ajuste localizado sem breaking change (variante faltando, focus-visible, story incompleta) | GitHub Issue com label da fase (`review:R4`) |
| **RFC** | Mudança sistêmica ou breaking (rename de prop, mudança de contrato de slot, refactor de recipe compartilhado) | `docs/rfcs/RFC-####-<slug>.md` seguindo [template](../rfcs/RFC-0000-template.md) |

---

## Rubrica em uma página

Cada componente é avaliado em 5 eixos:

1. **Visual** — tokens, variantes, estados, contraste, motion.
2. **Comportamental** — teclado, foco, ARIA, touch target, controlado/não-controlado.
3. **Funcional** — API, naming, defaults, polimorfismo, tipos.
4. **Código** — estrutura de pasta, proibição de tags HTML, recipes, testes, stories, `.native.tsx`.
5. **Governança** — exports, changeset, RFC, migration guide.

Detalhes no [`_template.md`](./_template.md).

---

## Convenções

- **Nome do arquivo:** `<nome-kebab>.md` (igual ao nome da pasta em `src/components/`).
- **Linkagem:** todo componente revisado é linkado nesta tabela.
- **Retrabalho:** quando uma fase posterior revisita um componente de fase anterior, **não duplicar** o arquivo; adicionar uma seção `## Revisão — YYYY-MM-DD` ao final.
- **Deprecação:** componentes em depreciação (ex: `Modal`) recebem review final com plano de remoção, e o arquivo recebe prefixo `~~strikethrough~~` nesta tabela.
