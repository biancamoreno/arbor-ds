# R4 — Button + ButtonGroup + FloatingActionButton

**Período:** 2026-04-24
**Estado da base ao iniciar:** RFC-0001/0002/0008 implementadas (forwardRef canônico em primitives, PressFeedback disponível, Clickable refatorado, dev warning a11y ativo). 541/541 testes verdes.
**Estado ao concluir:** 541/541 testes verdes, lint sem warnings, typecheck verde. 1 bug crítico corrigido, 4 fixes triviais aplicados, padrões emergentes identificados.

---

## Contexto

Após o gate de R4 ser cumprido (RFC-0001/0002/0008 implementadas), Button/ButtonGroup/FAB foram auditados contra os padrões consolidados:

- `forwardRef` canônico em primitives.
- Composição com `PressFeedback` substituindo `tapState` legado.
- Dev warning a11y para `as !== 'button'/'a'` sem `role`.
- Stories sem HTML cru e sem `style={{}}` quando há prop equivalente.
- `displayName` obrigatório.

A pergunta da auditoria: os 3 componentes seguem esses padrões? Onde divergem, qual o caminho?

---

## Achados consolidados

### Críticos / Bugs

| ID | Componente | Achado | Status |
|---|---|---|---|
| **CR4-1** | Button | `disabled` HTML attribute **não é repassado** ao elemento `<button>`. Só altera estilos (cursor, opacity, pointerEvents). Forms não respeitam, screen readers não anunciam, tab navigation não pula. Bug crítico de a11y mascarado por teste falso-positivo (`expect(... || true).toBe(true)`). | ✅ Fix aplicado em `button.tsx:113` (`disabled={isDisabled}`). Teste reescrito sem `\|\| true`. |
| **CR4-2** | Button | Teste em `button.test.tsx:69-71` tinha `\|\| true).toBe(true)` — sempre passava, escondia CR4-1. | ✅ Reescrito como teste real de `hasAttribute('disabled')`. |
| **CR4-3** | FAB | `fab.native.tsx` usa `TouchableOpacity` e `Text` do react-native diretamente — viola convenção do CLAUDE.md ("Nunca usar primitivas RN diretamente"). | Issue aberto. Resolução depende de abstração cross-platform de `Clickable.native`. |
| **CR4-4** | FAB | `fab.native.tsx` tem cores hardcoded (`#18736A`, `#E5F4F3`, `#FFFFFF`, `#1A1A1A`, `#000`). Quebra theming. | Issue aberto. Bloqueado por R1-C3 (shadows tematizadas) e tokens de cor cross-platform. |
| **CR4-5** | FAB | `boxShadow: '0 8px 32px rgba(0,0,0,0.20)'` hardcoded em fab.tsx (web). Sem token de elevation. | Issue aberto. Bloqueado por R1-C3. |

### High

| ID | Componente | Achado | Status |
|---|---|---|---|
| **HR4-1** | Todos | **Nenhum** dos 3 componentes usa `forwardRef`. Sem ref ao DOM = sem focus management programático, sem integração com Floating UI / Framer Motion. | Issue: aplicar pattern de `forwardRef` (igual ao Clickable refatorado) em Button, IconButton, ButtonGroup, FAB. |
| **HR4-2** | Button, FAB | Não usam `<PressFeedback>`. Feedback de press depende de defaults do navegador (button :active genérico). | Issue: avaliar adicionar `<PressFeedback>` como sibling em Button/FAB; respeitar `prefersReducedMotion`. |
| **HR4-3** | Todos | **`displayName` ausente** em todos os 5 componentes (Button, IconButton, ButtonGroup, FloatingActionButton web/native). | ✅ Fix aplicado nos 5. |
| **HR4-4** | Button | Hardcoded `BORDER_RADIUS_SMALL = 12` com comentário admitindo ser token. | ✅ Fix aplicado: `theme.radii.small`. |
| **HR4-5** | FAB | Hardcoded `FAB_Z_INDEX = 900`, mas existe `tokens.zIndex.fab = 900`. | ✅ Fix aplicado: `theme.zIndices.fab`. |
| **HR4-6** | Button | Story argTypes lista 3 variantes (primary/secondary/ghost), componente aceita 4 (`danger` ausente). Inconsistência. | ✅ Fix aplicado: argTypes inclui `danger` + nova story `Danger`. |
| **HR4-7** | Button | Stories `Sizes`, `AllVariants`, `IconButtonExample` usam `<div style={{ display: 'flex', gap: 12 }}>`. Viola convenção R3. | ✅ Fix aplicado: substituídos por `<Flex gap="12px">`. |
| **HR4-8** | FAB | Stories `Sizes`, `Variants`, `PageWrapper` usam `<div>`, `<p>` crus + `style={{}}`. | ✅ Fix aplicado: `<Box>`, `<Flex>`, `<Text>`. |
| **HR4-9** | FAB | `fab.native.tsx` não emite warning de a11y como `fab.tsx` faz. | ✅ Fix aplicado: warning idêntico ao web. |
| **HR4-10** | Button | Lógica de `attachedStyle` (radii colapsados em ButtonGroup attached) está em **Button**, não em ButtonGroup. Acoplamento bidirecional via `useButtonGroupItem()`. Button conhece detalhes de ButtonGroup. | RFC candidata: mover lógica para ButtonGroup ou criar variant `attached` em Button via theme recipe. |
| **HR4-11** | Button | `IconButton` é wrapper que mistura props declarativas com `style={{}}` para tamanhos. Padrão inconsistente (poderia ser variant de Button). | RFC candidata: IconButton como variant `iconOnly` de Button vs. componente separado. |
| **HR4-12** | Button | Animação `arbor-spin 0.8s linear infinite` hardcoded no style do Icon de loading. Sem token de motion. | Issue: registrar `keyframe` `arbor-spin` em tokens de motion. |
| **HR4-13** | FAB | `outline="none"` quebra a11y de focus visible. Deveria ser condicionado a `:not(:focus-visible)`. | Issue: ajustar para preservar focus ring no keyboard. |
| **HR4-14** | FAB | `position="none"` é flag awkward — fica indistinguível de "não passar position". Faria mais sentido `position?: undefined` para flow natural. | RFC candidata: redesenho da API de `position` em FAB. |
| **HR4-15** | FAB native | Usa `TouchableOpacity` (deprecado pelo time React Native em favor de `Pressable`). | Issue: migrar para `Pressable` quando o C3 (CR4-3) for resolvido. |
| **HR4-16** | FAB native | Não suporta `animateOnMount` (divergência sem doc). | Issue: paridade ou doc da divergência. |

### Medium

| ID | Componente | Achado | Status |
|---|---|---|---|
| **MR4-1** | Button | Sem versão `.native.tsx`. JSDoc diz "web-only", mas é primitive crítico que vai precisar. | Issue futura quando estratégia cross-platform de Button for definida. |
| **MR4-2** | Button | `IconButton` sem testes próprios (só aparece em story `IconButtonExample`). | Issue: criar `icon-button.test.tsx`. |
| **MR4-3** | Button | `IconButton` sem story dedicada (só dentro de Button stories). | Issue: criar `icon-button.stories.tsx`. |
| **MR4-4** | Button | Sem warning a11y para Button vazio sem `aria-label` (típico de IconButton com children="✕"). | Issue: warning em dev se `children` for string curta sem `aria-label`. |
| **MR4-5** | ButtonGroup | Sem `.native.tsx`. Embora Button seja web-only hoje, ButtonGroup é puro layout — poderia ser cross-platform. | Issue: avaliar `.native.tsx`. |
| **MR4-6** | ButtonGroup | `Children.toArray(children).filter(isValidElement)` esconde erros silenciosamente (string filhos somem). | Issue: warning em dev se filhos não-elementos forem passados. |
| **MR4-7** | ButtonGroup | Contrato `index/totalItems` via context é implícito — qualquer Button derivado precisa conhecer. | Documentar no JSDoc da Context ou expor hook tipado `useButtonGroupAttached()`. |
| **MR4-8** | FAB | `fab.test.tsx` tem 7 testes — abaixo do DoD de 15. Faltam: variantes, sizes, position, animateOnMount, isExtended, ref. | Issue: aumentar cobertura. |
| **MR4-9** | Button | `button.test.tsx` tem 14 testes — 1 abaixo do DoD de 15. | Issue: adicionar 1+ teste (ex: ref forward, focus visible). |
| **MR4-10** | ButtonGroup | `button-group.test.tsx` tem 7 testes — abaixo do DoD. Faltam spacing, attached + vertical, mix de elementos. | Issue: aumentar cobertura. |

### Low

| ID | Componente | Achado | Status |
|---|---|---|---|
| **LR4-1** | FAB | `fontFamily: 'inherit'` em style — defensive mas redundante. | Trivial; deixa. |
| **LR4-2** | Button | `data-arbor-focusable=""` é attribute custom opaco. | Adicionar JSDoc explicando que é seletor para focus ring global. |

---

## Padrões emergentes (cruzando R1–R4)

1. **Hardcoded values onde tokens existem.** Padrão recorrente: componentes complexos hardcoded radius/zIndex/shadow/animation enquanto tokens estão disponíveis. Ver `_followups.md` para outras ocorrências.

2. **`forwardRef` ausente em camadas pós-core.** Padrão consolidado pós-RFC-0001 nos primitives, mas Button/ButtonGroup/FAB ainda não migraram. Provável que outros componentes (Field, Input, Card, etc.) tenham o mesmo gap.

3. **Stories com HTML cru.** R3 já documentou em CONTRIBUTING.md, mas R4 mostra que stories antigas continuam violando. Vale rodar grep `<div style|<span style|<p style` em todas as stories e fechar em PR único.

4. **Native versions sem abstração.** FAB.native usa primitivos RN crus + cores hardcoded. Padrão se repetirá em outros componentes com `.native.tsx`. RFC sistêmica: definir `Clickable.native` ou similar como abstração.

5. **Testes abaixo do DoD (15).** 3 dos 3 componentes auditados estão abaixo. O número pode estar errado para componentes simples — ou os componentes precisam de mais testes.

---

## Decisões de arquitetura — 2026-04-24

**Bug `disabled` HTML em Button — CR4-1 corrigido.** O fix é trivial (1 linha) mas o impacto é alto (a11y, forms, keyboard nav). Lição: testes falso-positivos são piores que testes ausentes — escondem bugs reais. Adicionar lint rule contra `|| true` em expects vale RFC futura.

**`forwardRef` em componentes pós-core (HR4-1) — issue, não fix imediato.** Aplicar em Button/IconButton/ButtonGroup/FAB requer pattern definido (qual ref retornar para FAB que tem 2 elementos? Button vs IconButton compartilham?). Vale planejar como sweep coordenado, não fix isolado.

**`PressFeedback` em Button/FAB (HR4-2) — issue, não fix imediato.** Decisão de produto: queremos feedback visual além do default do navegador? Não há contrato visual definido para "como botão deveria reagir ao press". Vale design conversation antes do código.

**Native abstractions (CR4-3, CR4-4, HR4-15) — RFC sistêmica.** Não resolver caso-a-caso. Definir estratégia: `Clickable.native` como abstração? Adapter de TouchableOpacity/Pressable? Ou Button.native que re-implementa? Decisão arquitetural maior.

---

## Gate para R5 (Field + Input)

- [x] R4 review documentado.
- [x] Fixes triviais aplicados sem regressão (541/541 verdes).
- [x] Bug crítico CR4-1 corrigido.
- [ ] Issues abertas no GitHub com labels `review:R4` (manual; fora do escopo desta sessão).
- [ ] Decisão sobre HR4-1 (forwardRef sweep): fazer em R5 ou agrupar como sweep próprio.
- [ ] RFC para abstração Native (CR4-3) — não bloqueia R5 (Field/Input são web-first).

R5 pode iniciar em paralelo a essas pendências.
