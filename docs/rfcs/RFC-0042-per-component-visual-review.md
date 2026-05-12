# RFC-0042 — Per-component visual review (PCV)

**Status:** Draft
**Autora:** Bia (com co-autoria de design system architect)
**Data:** 2026-05-09
**Bloqueia:** RFC-0041 PR3 (demos vitrine), RFC-0041 PR4 (página identidade), corte de tag `v1.0.0`
**Depende de:** RFC-0039 (paleta 12 papéis), RFC-0040 (component tokens estruturados + emissão CSS vars), RFC-0041 PR1+PR2 (polish coletivo)
**Insere em sequência:** após RFC-0041 PR2; antes de RFC-0041 PR3/PR4

---

## 1. Diagnóstico

### 1.1. Sintoma

Após a entrega de RFC-0041 PR1 (`7517762`) e PR2 (`2ba1c7e`), o motor + o atlas de tokens estão calibrados (brand ultraviolet, font-weight 600, shadows multi-layer, motion snap, density 36/44/52, focus glow). A revisão de Storybook em 2026-05-09 mostra que o **default visual ainda fica aquém** do critério "pronto para vitrine/painel/app/landing sem customização". Diagnóstico da usuária: "num geral está ruim, mas o código parece funcional e bem estruturado".

### 1.2. Por que o sweep coletivo não fechou

A RFC-0041 ajustou eixos que afetam *todo* componente igualmente. Isso não captura quatro classes de problema visual que **só aparecem em revisão isolada**:

| Classe | O que é | Exemplo |
|---|---|---|
| **A. Composição interna** | spacing entre slots, alinhamento de baseline, gap Icon↔Text | Padding interno de Tag/Chip não derivado do mesmo eixo; gap Icon↔Label do Button |
| **B. Hierarquia tipográfica** | qual textStyle cada slot usa por default; pesos relativos | Card.Title em `body`; Alert.Title sem peso distinto |
| **C. Calibração de defaults** | recipe e token corretos, mas o **valor escolhido como default** descalibrado | Tone default do Tag = neutral cinza-puro sem matiz; Avatar fallback contraste fraco |
| **D. Microfeedback semântico** | hover/press/focus contam histórias diferentes em cada família | Tag não deveria ter hover; Card.interactive precisa de translate; Switch precisa de snap no thumb |

A RFC-0041 não erra — é necessária. Mas o teto dela é coletivo. O destravamento final só vem revisando cada componente nas suas próprias quirks.

### 1.3. Por que importa agora

- v1 está bloqueada por polish (memory `project_release_v1_preflight.md`).
- Pré-v1 sem consumidores externos = janela única de breaking visual sem ônus.
- O motor (cascade de 5 níveis, recipes 100% por `$alias`, CSS vars web, tema JS native) **acabou de ser entregue** e nunca terá outra janela tão longa de mudança coordenada antes da v1. PCV é o **shakedown cruise** que prova no campo que a estrutura aguenta.
- Demos vitrine (RFC-0041 PR3) e página de identidade (PR4) só fazem sentido com átomos individualmente afiados — caso contrário viram dívida visual congelada nas stories.

### 1.4. Risco se não fizer

- v1 lança com componentes individualmente desafinados → consumidores customizam pontualmente cada um → identidade do default desaparece de fato.
- Achados de calibração só aparecem em produção → custo de breaking pós-v1 é alto.
- O motor recém-construído nunca recebe teste de integração realista no nível-componente.

---

## 2. Direção recomendada

**Revisão atomicamente ordenada componente-a-componente em baby steps**, com template uniforme de PR e regra de stop para gaps de motor. Cada PR é pequeno, focado e independente; cada camada serve de fundação visual para a próxima.

### 2.1. Princípios

1. **Atomicidade primeiro** — Text/Icon/Spinner antes de Card/Dialog/Carousel. Calibrar a base economiza retrabalho em todos que consomem.
2. **Loop fechado com motor** — se a revisão revelar gap em foundations/engine, abre-se sub-PR de motor naquele momento, fecha, volta. Sem TD novo escondido.
3. **Template uniforme** — toda revisão preenche o mesmo checklist (§3); evita drift entre os ~36 PRs.
4. **Override pelo tema continua trivial** — toda calibração vai por token/recipe themable; produto B (violet) é gate vivo de que nada vazou primitive.
5. **Cross-platform real** — paridade web↔native obrigatória onde aplicável; sem novo `web-only`.
6. **Stories são parte do PR** — cada review reescreve a story do componente revisado (mata TD-024 incrementalmente).

### 2.2. O que NÃO está no escopo

- Adicionar componentes novos (carrousel já existe, FileUpload já existe). Backlog continua válido.
- Revisar component tokens estruturalmente (RFC-0040 fechou).
- Mudar paleta (RFC-0039 fechou).
- Trocar brand novamente (RFC-0041 fechou).
- Refatorar API pública. PCV é **calibração visual**, não breaking de contrato (exceto onde a calibração revela API quebrada — aí abre RFC dedicada).

---

## 3. Template uniforme de revisão (checklist obrigatório por PR)

Cada PR de PCV deve cobrir as 8 dimensões abaixo. PR sem o checklist preenchido na descrição não merge.

### 3.1. As 8 dimensões

1. **Anatomia** — slots, hierarquia visual, ordem de leitura, density consistente (xsmall/small/medium/large/xlarge).
2. **Tipografia** — qual textStyle cada slot usa; peso relativo entre slots; line-height; truncation.
3. **Spacing interno** — paddings, gaps; tudo via token themable; nada inline; nada literal.
4. **Cor + contraste** — tone default; AA mínimo light + dark; hover/press/focus distintos.
5. **Microinterações** — hover/press/focus/disabled coerentes com a *natureza* do componente (decorativo ≠ interativo); transition vinda de motion preset.
6. **Estados extremos** — empty / loading / error / long-content / zero-content; native paritário.
7. **Tema-extension** — produto B (violet) ainda fica bom? `createTheme()` muda a personalidade sem tocar recipe?
8. **API plana avaliada** (RFC-0043) — se anatomia padrão é fixa (nenhum dos 4 gatilhos de compound legítimo se aplica), top-level entrega props planas; compound `.Root` permanece exportado mas reservado a layouts não-triviais; story default em modo plano, `AdvancedCompound` separada quando aplicável.

### 3.2. Checklist textual (copiar para descrição do PR)

```markdown
## PCV checklist — <Componente>

### Anatomia
- [ ] Slots documentados na story (texto curto + screenshot)
- [ ] Density consistente (xsmall/small/medium/large/xlarge)
- [ ] Ordem de leitura coerente (a11y semantic order)

### Tipografia
- [ ] Cada slot consome textStyle nomeado (sem fontSize/fontWeight literal)
- [ ] Peso relativo entre slots faz sentido (Title > Subtitle > Body > Caption)
- [ ] Truncation testada com texto longo

### Spacing interno
- [ ] Padding/gap via token (sem px solto)
- [ ] Sem `style={{}}` novo
- [ ] Sem tag HTML / RN primitive nova

### Cor + contraste
- [ ] Tone default justificado
- [ ] `pnpm test:contrast` verde
- [ ] Light + dark conferidos
- [ ] Hover / press / focus / disabled visualmente distintos

### Microinterações
- [ ] Hover/press/focus/disabled coerentes com natureza do componente
- [ ] Transition via `transition()` ou token motion (sem string crua)
- [ ] reduced-motion respeitado (web + native quando aplicável)

### Estados extremos
- [ ] Empty / loading / error testados na story
- [ ] Long-content / zero-content testados
- [ ] Native paritário (se aplicável); sem novo `web-only`

### Tema-extension
- [ ] `pnpm test` (matriz produto B violet) verde
- [ ] `pnpm test:feedback-tones` verde
- [ ] Sem cor literal / boxShadow inline / pixel solto novo

### API plana avaliada (RFC-0043)
- [ ] Aplicou-se a régua dos 4 gatilhos de compound legítimo (ordem do consumidor, slots repetidos, conteúdo árvore, slots opcionais não-discriminantes)
- [ ] Se nenhum gatilho se aplica → top-level expõe props planas (`label`/`title`/`description`/`footer`/`action`/`trigger`/`options`/...)
- [ ] Compound `.Root`/`.Trigger`/etc. permanece exportado (sem breaking)
- [ ] Roteamento por prop (`usesFlatApi`), sem introspecção de `React.Children`
- [ ] Story default migrada para modo plano; `AdvancedCompound` separada quando justificável

### Entrega
- [ ] Story atualizada (mata fração de TD-024)
- [ ] CHANGELOG Unreleased — uma linha
- [ ] Screenshot antes/depois no commit message ou PR body
- [ ] `pnpm lint` + `pnpm test` verdes
```

### 3.3. Regra de stop

Se durante uma revisão surgir gap estrutural (ex.: Text não tem `display.medium`, engine não suporta `letterSpacing` em recipe, motion não tem easing `snap`), **o PR pausa**. Abre-se sub-PR de motor/foundations, fecha, volta para o componente. Sem TD novo escondido. Tudo que vira sub-PR deve ser referenciado no PR principal de PCV.

---

## 4. Ordem por atomicidade (10 camadas, ~36 PRs)

A ordem segue a regra "se A é consumido por B, A vai antes". Cada camada serve de fundação visual para a próxima.

### Camada 1 — Átomos visuais (5 PRs)

Pivô absoluto. Calibrar aqui economiza ajuste em todos os outros.

1. **Text** — `display.{small,medium,large}`, `headline.*`, `body.*`, `caption.*`, `mono.*`; defaults de cada `as`.
2. **Icon** — alinhamento com baseline de Text; `iconSize` consistente; `decorative` vs `accessible`.
3. **Image** — fit/cover/contain; placeholder; ratio defaults.
4. **Spinner** — sizes; tone default; reduced-motion native (fecha parte de TD-041).
5. **Skeleton** — formas (rect/circle/text); pulse vs wave; reduced-motion native (fecha parte de TD-041).

### Camada 2 — Layout primitives (1 PR coletivo curto)

6. **Container/Box/Flex/Grid/Stack/Spacer/Center/Square/Circle** — sem visual próprio; conferir bug R2 review (`paddingInline="md" + maxWidth:string`).

### Camada 3 — Clicáveis atômicos (4 PRs)

7. **Clickable** — base de hover/press universal; states uniformes.
8. **Button + IconButton + ButtonGroup** — Button já é piloto da RFC-0041; PCV revisita densidade vs hierarquia (primary/secondary/ghost/danger × xs/sm/md/lg).
9. **FAB** — escala, sombra brand, posicionamento, sizes.
10. **Tag** — calibração de tones; remover hover quando não-interativo; padding interno.

### Camada 4 — Indicadores (5 PRs)

11. **Badge** — count/dot/icon variants; posicionamento absoluto sobre Avatar/Icon/Button.
12. **Chip** — discriminated union já resolvida (RFC-0033); PCV foca em microfeedback select/remove + hierarquia interna.
13. **Avatar + AvatarGroup** — tamanhos canônicos; fallback (initials vs icon); ring (RFC-0035 entregou cross-platform; PCV calibra).
14. **ProgressBar** — sizes, tones, label inline, indeterminate.
15. **ProgressCircle** — sizes, ring thickness, label central.

### Camada 5 — Form atoms (4 PRs)

16. **Switch** — thumb snap; track tones; `_focusVisibleWithin` calibrado.
17. **Checkbox** — indicador (TD-016), tri-state visual.
18. **Radio + RadioGroup** — alinhamento entre Indicator+Label; espaçamento entre opções.
19. **Counter** — touch target, alinhamento dos +/− com value.

### Camada 6 — Form composto (4 PRs)

20. **Field** — Label/Description/Error hierarquia tipográfica; spacing label↔control; required marker.
21. **TextInput/TextArea** — placeholder contrast; focus ring; prefix/suffix; estados.
22. **Select** — RFC-0020 entregou WAI-ARIA combobox; PCV calibra item hover/selected, scroll, max-height.
23. **FileUpload** — drop zone visual; progresso; estado de erro.

### Camada 7 — Feedback (2 PRs)

24. **Alert** — tones (info/success/warning/critical) com matiz de superfície + ícone leading + ação opcional.
25. **Toast/Toaster** — entrada/saída animada; stack visual; close button discreto (fecha parte de TD-041 native).

### Camada 8 — Composições simples (5 PRs)

26. **Card** — RFC-0036 fechada; PCV calibra densidade interna e hover translate.
27. **Accordion** — RFC-0037 fechada; PCV calibra chevron, peso do trigger, divider.
28. **Tabs** — RFC-0038 fechada; PCV calibra underline thickness, pill density, gap.
29. **Tooltip** — fontSize, padding, arrow size, contrast.
30. **Popover** — shadow, radius, max-width.

### Camada 9 — Overlays grandes (3 PRs)

31. **Menu** — itens, separadores, ícones leading, shortcuts.
32. **Dialog** — header/body/footer hierarquia; backdrop; max-width responsivo.
33. **Drawer** — direção (left/right/bottom/top); width/height; close affordance.

### Camada 10 — Agregadores (6 PRs)

34. **Carousel** — RFC-0034 v1 fechada; PCV calibra indicators, controls, autoplay button.
35. **Table** — header peso, row hover, density.
36. **Pagination** — sizes, current state, ellipsis.
37. **Breadcrumb** — separator, truncation.
38. **NavBar** — densidade, slots start/center/end.
39. **TabBar (mobile)** — touch target, active state, ícones.

**Total: ~36 PRs**, agrupáveis em 6–8 sessões longas ou 15–20 sessões curtas.

---

## 5. Integração com TDs existentes

| TD | Como PCV interage | Camada esperada |
|---|---|---|
| **TD-024** (sweep stories antigas) | Morta incrementalmente — cada PCV reescreve a story do componente | Todas |
| **TD-041** (reduced-motion native em Spinner/Skeleton/Toast/ProgressCircle) | Fecha de quebra | Camadas 1, 4, 7 |
| **TD-031** (engine longhand RTL + whiteSpace) | Provável surgir; vira sub-PR de motor (regra de stop) | Camada 6 |
| **TD-026** (focus ring largura/offset themable) | Provável surgir; vira sub-PR de motor se gatilho concreto aparecer | Camada 3 ou 5 |
| **TD-001/002/007** (innerRef + forwardRef sweep) | Aproveitar para fazer junto se PR já tocar o arquivo | Oportunista |

PCV **não substitui** essas TDs — destrava algumas e dá oportunidade de fechar outras de carona.

---

## 6. Plano de execução

### Ordem de PRs

1. **PR-Setup (este RFC)** — RFC merged + fila atualizada + template de PR no `.github/PULL_REQUEST_TEMPLATE/pcv.md` (opcional).
2. **PCV-1 a PCV-5** — Camada 1 (Átomos visuais).
3. **PCV-6** — Camada 2 (Layout coletivo).
4. **PCV-7 a PCV-10** — Camada 3 (Clicáveis).
5. **PCV-11 a PCV-15** — Camada 4 (Indicadores).
6. **PCV-16 a PCV-19** — Camada 5 (Form atoms).
7. **PCV-20 a PCV-23** — Camada 6 (Form composto).
8. **PCV-24 a PCV-25** — Camada 7 (Feedback).
9. **PCV-26 a PCV-30** — Camada 8 (Composições simples).
10. **PCV-31 a PCV-33** — Camada 9 (Overlays grandes).
11. **PCV-34 a PCV-39** — Camada 10 (Agregadores).
12. **RFC-0041 PR3** — 4 demos vitrine (agora alimentadas por componentes afiados).
13. **RFC-0041 PR4** — Página "Identidade Visual" no Storybook (absorve screenshots antes/depois das camadas).
14. **Cortar v1.0.0**.

### Cadência sugerida

- **Camada-a-camada**, não componente-pulado entre camadas. Fechar Camada 1 inteira antes de começar Camada 2.
- **Um PR por componente** (exceção: Camada 2 coletiva).
- **Sub-PR de motor entre componentes** quando a regra de stop dispara — não acumular.
- **Review da usuária após cada camada** (não a cada PR) — reduz fricção sem perder controle.

### Critério de "camada fechada"

- [ ] Todos os PRs da camada merged
- [ ] `pnpm test` + `pnpm lint` + `pnpm test:contrast` + `pnpm test:feedback-tones` verdes
- [ ] Screenshots de antes/depois consolidados (vai virar matéria-prima para RFC-0041 PR4)
- [ ] Sem novo `web-only` no `check-platform-contract --strict`
- [ ] Usuária aprovou em revisão Storybook

---

## 7. Critérios de aceite da RFC-0042 como um todo

- [ ] Todas as 10 camadas fechadas
- [ ] Suite verde (1100+ testes)
- [ ] `web-only` global em 0
- [ ] TD-024 morta integralmente
- [ ] TD-041 morta integralmente
- [ ] CHANGELOG Unreleased acumula uma linha por PR
- [ ] Storybook passa pelo critério "vitrine/painel/app/landing sem customização"
- [ ] Usuária aprova default visual

---

## 8. Riscos e mitigações

| Risco | Mitigação |
|---|---|
| **Escopo creep** — PCV vira refactor de API | Template restringe a calibração visual. API quebrada → abre RFC dedicada, não incorpora ao PCV. |
| **Fadiga de review** — 36 PRs em sequência cansa | Review por camada, não por PR. Camadas 4–10 têm screenshots consolidados. |
| **Sub-PRs de motor proliferam** | Regra de stop é explícita. Cada sub-PR é referenciado no PCV principal. Inventário ao fim de cada camada. |
| **Drift entre PRs** | Template uniforme + checklist obrigatório no PR body. |
| **Calibração de produto B regride** | Gate `pnpm test` (matriz produto B) é obrigatório por PR. |
| **PR3/PR4 da RFC-0041 atrasam ainda mais a v1** | Aceito. Bloqueio explícito: PCV é o que torna PR3/PR4 valiosos. |

---

## 9. Não-objetivos

- Não é refactor de API.
- Não é nova RFC de tema (cascade de 5 níveis está fechada).
- Não é nova paleta.
- Não é nova font.
- Não é introdução de presets de personalidade (fica para pós-v1, conforme `docs/ARCHITECTURE_DIRECTION.md`).
- Não é adição de componentes novos.

---

## 10. Decisão pendente da usuária antes do PCV-1

Nenhuma. RFC-0042 fica em Draft até a usuária aprovar para começar PCV-1 (Text). Sem decisões de identidade pendentes (brand/density/motion ficaram fechadas pela RFC-0041).

---

## Apêndice A — Por que essa ordem?

A ordem segue dependência visual real:

- **Text** é consumido por **todo** componente que tem texto (todos exceto Spacer/Square/Circle).
- **Icon** é consumido por Button, IconButton, FAB, Tag, Chip, Alert, Toast, Field, Select, Tabs, Accordion, Menu, Breadcrumb, Pagination, NavBar, TabBar.
- **Spinner** é consumido por Button (loading state), Skeleton, FileUpload, Carousel.
- **Clickable** é consumido por Button, IconButton, FAB, Card.interactive, Chip.selectable, Tabs.Trigger, Accordion.Trigger, Menu.Item, Pagination, Breadcrumb, NavBar, TabBar.
- **Field** é consumido por TextInput, TextArea, Select, FileUpload, Switch (Field-aware), Checkbox (Field-aware), Radio (Field-aware), Counter.

Calibrar Text com `headline.medium` desafinado contamina ~30 componentes. Calibrar Card antes de Text gera retrabalho.

## Apêndice B — Stub de PR Template

Sugerido em `.github/PULL_REQUEST_TEMPLATE/pcv.md` (opcional, decidir no PR-Setup):

```markdown
# PCV-NN — <Componente>

**Camada:** <N>
**RFC:** RFC-0042
**Sub-PRs de motor:** <links ou "nenhum">

## Antes / Depois
<screenshots>

## Checklist (obrigatório — ver §3.2 da RFC-0042)
<colar checklist>

## Notas
<o que mudou e por quê — 3-5 linhas>
```
