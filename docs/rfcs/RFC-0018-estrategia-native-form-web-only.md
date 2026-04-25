# RFC-0018 — Estratégia native para componentes form web-only

**Status**: Draft
**Autores**: @bia
**Data**: 2026-04-25
**PR**: (a abrir)

**Origem**: R6 review · destravado por TD-013 (resolvido em RFC-0016)

---

## Motivação

Três componentes de R6 — `Radio`, `RadioCard`, `Select` — não têm `.native.tsx` e estão marcados como `@platform web-only` em comentários JSDoc:

```ts
src/components/radio/interfaces/RadioProps.ts:6:        @platform web-only
src/components/radio-card/interfaces/RadioCardProps.ts:4: @platform web-only
src/components/select/core/select.tsx:2:                  @platform web-only
```

A tag funciona como **documentação**, mas:

1. **Não bloqueia importação em código RN.** Um app que faz `import { Radio } from 'arbor-ds'` em um screen RN vai resolver o `.tsx` web e crashar em runtime quando o styled-system tentar renderizar `<input type="radio">` no RN.
2. **`scripts/check-platform-contract.js` valida que `src/native.ts` não importa web-only** (regra 2). Bom — mas o entrypoint `arbor-ds` ainda exporta tudo. Quem importar do entrypoint principal em RN não tem proteção.
3. **Sem guard de runtime.** Não há `console.error` quando o componente roda fora do web.
4. **Critério de promoção informal.** Quando alguém quiser implementar `radio.native.tsx`, não há checklist do que precisa estar pronto antes (a11y, keyboard nav RN, RadioGroup context, etc.).

### Por que importa agora

- TD-013 fechou (RFC-0016). Existe rede de testes para qualquer `.native.tsx` novo.
- RFC-0019 (RadioCard) precisa decidir se vai herdar a estratégia de Radio ou trilhar caminho próprio.
- RFC-0020 (Select combobox) vai refatorar amplamente — momento certo de decidir se entra `select.native.tsx` no escopo.

Sem decisão explícita, a tendência é cada componente decidir local (R5 e R6 já divergem: Field tem `.native`, Radio não tem; Switch tem, Select não tem). Drift cumulativo.

---

## Proposta

Formalizar três níveis de suporte cross-platform como contrato do DS, com critérios objetivos de classificação e regras de enforcement diferentes para cada um.

### Os três níveis

| Tag | Significado | Onde aparece |
|---|---|---|
| `@platform shared` | Funciona em web e native via mesma implementação (delega ao styled-system / primitives cross-platform). | Box, Flex, Grid, Center, Square, Circle, Spacer, Container |
| `@platform native-ready` | Tem implementação dedicada em `.native.tsx` (divergência arquitetural ou uso de APIs RN-only). | Text, Image, Icon, Field, Checkbox, Switch, FAB, NavBar, TabBar |
| `@platform web-only` | Funciona apenas em web. Importação em RN deve ser **bloqueada por entrypoint** + **avisada em runtime**. | Radio, RadioCard, Select (escopo desta RFC) |

### Decisão por componente afetado

| Componente | Decisão | Justificativa |
|---|---|---|
| `Radio` | **Mantém web-only** | RN não tem primitivo Radio. Re-implementar é projeto dedicado (Pressable + accessibilityRole + RadioGroup context + keyboard nav). Não cabe no escopo do RDS hoje. |
| `RadioCard` | **Mantém web-only** | Depende de Radio. Mesma decisão. |
| `Select` | **Mantém web-only** (esta RFC). RFC-0020 refatora apenas web. | Combobox WAI-ARIA em RN exige Portal + DismissableLayer + FocusScope + custom keyboard, **e ainda assim** UX nativa esperada (ActionSheet iOS / Spinner Android) é diferente. |

A decisão de **promover algum desses para `native-ready`** exige RFC dedicada listando: caso de uso real, plano de a11y RN, keyboard mapping, paridade visual, e adoção pelo playground mobile.

### Regras de enforcement

#### 1. `check-platform-contract.js` (já existe — endurecer)

Mantém regra atual (web-only não pode aparecer em `src/native.ts`). **Adicionar:**

- Componente marcado `@platform web-only` em algum arquivo do `src/components/<nome>/` **deve** ter o tag em **pelo menos um arquivo de cada tipo**: `interfaces/*Props.ts` E `core/*.tsx`. Falha CI se só um lado declarar.
- Lista canônica de web-only é gerada do scan; reportada ao final do output do script.

#### 2. Guard de runtime em web-only

Cada Root de componente web-only ganha:

```tsx
import { Platform } from 'react-native';

if (process.env.NODE_ENV !== 'production' && Platform.OS !== 'web') {
  console.error(
    '[Radio] is web-only and not supported in React Native. ' +
    'Use a custom RN component or open an RFC to add native support.',
  );
}
```

- Apenas dev — zero overhead em produção (tree-shaken).
- Mensagem aponta para a RFC dedicada (path estável: `docs/rfcs/RFC-0018-estrategia-native-form-web-only.md`).

#### 3. Lint rule (futuro — fora desta RFC)

Adicionar regra ESLint custom: arquivo com sufixo `.native.tsx` **não pode** importar de componente marcado `web-only`. Se alguém criar `my-form.native.tsx` que importe Radio, lint quebra.

Defer porque exige `@typescript-eslint/parser` + AST traversal. Vale RFC tooling separada (ou TD).

#### 4. Critério de promoção web-only → native-ready

Para sair de `web-only`, abrir RFC dedicada cobrindo:

- [ ] Caso de uso real em produto.
- [ ] Implementação `.native.tsx` paritária (props + comportamento + a11y).
- [ ] `accessibilityRole`/`State` corretos para o equivalente RN.
- [ ] Keyboard navigation completa (setas/Home/End/space/enter onde aplicável).
- [ ] `.native.test.tsx` com cobertura mínima ≥ 5 cases comportamentais (regra de RFC-0016).
- [ ] Story em playground mobile (Expo) provando funciona em iOS + Android reais.
- [ ] Theming via `useSlotRecipe` consumindo a mesma recipe que web (RFC-0017).
- [ ] Atualização do `src/native.ts` para exportar.

---

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| **Implementar `.native.tsx` para os 3 agora** | Escopo ≥ 3 sprints. RadioGroup keyboard nav + Select WAI-ARIA combobox em RN não são triviais. Não há demanda de produto que justifique a barreira. |
| **Manter só JSDoc, sem guard** | Status quo. Frustração silenciosa quando consumidor RN bate. |
| **Fail hard em runtime (throw)** | Quebra apps cuja IDE confunde import path em monorepo. Warn é suficiente em dev. |
| **Reescrever em primitives `Pressable`+`accessibilityRole` que aceitem branch web/native** | Recria o problema de TD-009 (Field.native divergente). Sem rede de paridade, vira mais débito. |
| **Promover Radio para native-ready agora (sem Select)** | Inconsistência: RadioGroup native existe sozinho mas Select não? Decisão sai do gate R7 — abrir RFC dedicada quando demanda surgir. |

---

## Impactos e trade-offs

- **Breaking change?** **Não** — apenas formaliza estado já existente.
- **Impacto em bundle size**: zero em produção (guard tree-shaken). Dev: ≤ 50 bytes por componente.
- **Impacto em performance**: zero.
- **Impacto em DX**:
  - **Ganho:** mensagens claras quando alguém tenta usar em RN. Critério explícito para evolução.
  - **Custo:** consumidor que precisava de Radio/Select em RN tem que pedir RFC ou implementar a parte específica do produto.
- **Impacto em acessibilidade**: zero direto. Indireto positivo: previne entrega de a11y degradada via `<input>` tentando rodar em RN.
- **Codemod necessário?** Não.

### Riscos

| Risco | Mitigação |
|---|---|
| Consumidor RN bate em runtime warning sem ler doc | Mensagem inclui path para esta RFC + sugestão de alternativa nativa. |
| Tag JSDoc fica desatualizada se componente migrar de web-only para native-ready | `check-platform-contract.js` enforce que tag está em ambos `interfaces/` e `core/`. Sweep manual ao migrar. |
| Lista web-only crescer muito sem revisão | Auditoria semestral (sweep): "todo componente em web-only ainda merece estar lá?". Registrar em `_followups.md` (R6 review já cita 3 candidatos: Radio, RadioCard, Select). |

---

## Critérios de aceite

- [ ] `Radio`, `RadioCard`, `Select` têm tag `@platform web-only` em **ambos** `interfaces/<X>Props.ts` e `core/<x>.tsx`.
- [ ] Cada Root tem guard de runtime em dev (`Platform.OS !== 'web'` → `console.error`).
- [ ] `scripts/check-platform-contract.js` falha CI se um web-only:
  - [ ] for importado por `src/native.ts` (regra 2 — já existe);
  - [ ] tiver tag só em `interfaces/` ou só em `core/` (nova regra).
- [ ] `CONTRIBUTING.md` documenta os 3 níveis de tag e o critério de promoção web-only → native-ready.
- [ ] Lista canônica de web-only impressa no fim de `pnpm test:platform-contract`.
- [ ] Storybook (web) tem badge "Web-only" visível em Radio, RadioCard, Select.

---

## Notas de implementação

### Dependência com outras RFCs

- **RFC-0019 (RadioCard)** assume Radio como web-only. Se RadioCard for unificado como `Radio variant="card"`, herda automaticamente.
- **RFC-0020 (Select combobox)** assume Select como web-only. Refator não inclui `.native.tsx`.
- **RFC-0017 (recipes mortas)** consome esta decisão: web-only ainda consome recipe, mas a recipe não precisa cobrir variantes native-only.

### Não-objetivo

Esta RFC **não decide** quando ou como promover algum desses três para native-ready. A decisão fica para RFC dedicada quando:

- Produto declarar dependência (ex.: e-commerce com checkout em app RN exigindo Radio para forma de pagamento).
- Ou quando padrão de re-uso entre componentes RN do DS atingir massa crítica que justifique a implementação compartilhada.

Até lá, consumidor RN deve montar Radio/Select com primitives RN (`Pressable`, `accessibilityRole`).

### Referência cruzada

- [RFC-0016](RFC-0016-ambiente-de-testes-cross-platform.md) — destravou esta decisão (TD-013 resolvido).
- [`scripts/check-platform-contract.js`](../../scripts/check-platform-contract.js) — onde as novas regras aterrissam.
