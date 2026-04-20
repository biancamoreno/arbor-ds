# Reestruturacao Arquitetural da Arbor DS

## Objetivo e necessidade

Este documento consolida, em formato reutilizavel, o racional da reestruturacao arquitetural da `arbor-ds`, os outputs produzidos nesta janela e as fases necessarias para executar a mudanca com criterio tecnico.

O objetivo principal da reestruturacao e transformar a biblioteca em um design system com arquitetura realmente sustentavel para `React` e `React Native`, com contratos claros entre camadas, API publica estavel, comportamento acessivel e tipagem coerente com o runtime.

Hoje a base possui uma direcao arquitetural correta no nivel conceitual, mas ainda nao esta protegida na implementacao. Os principais sintomas sao:

- As camadas `foundations`, `ecosystem` e `components` existem, mas suas fronteiras ainda estao vazando.
- A promessa cross-platform nao corresponde ao que a superficie publica entrega hoje.
- Os componentes nao seguem uma anatomia uniforme baseada em slots, recipes e behavior primitives.
- O styled system e os componentes finais nao compartilham um contrato forte o suficiente.
- Existem inconsistencias entre runtime, tipagem, exports e testes.

Em termos praticos, a reestruturacao e necessaria para:

- reduzir retrabalho em refactors futuros;
- evitar proliferacao de componentes com implementacoes isoladas;
- estabilizar theming, acessibilidade e composicao;
- permitir evolucao segura da biblioteca como produto;
- tornar a lib consumivel por outros produtos sem dependencias implicitas do playground ou do ambiente web.

## Outputs desta janela

### Output 1: Diagnostico arquitetural consolidado

A analise da lib como um todo, com foco em `src/components`, levou aos pontos abaixo:

#### 1. Fronteiras entre camadas estao quebradas

- `foundations` depende de `ecosystem` para breakpoints em `src/foundations/theme/base-theme.ts`.
- `ecosystem` exporta `playground` publicamente em `src/ecosystem/index.ts`.
- Isso inverte a direcao natural da arquitetura e mistura runtime da lib com aplicacao de demonstracao.

#### 2. A superficie publica nao e verdadeiramente cross-platform

- Apenas alguns componentes possuem implementacao `.native.tsx`.
- A maior parte dos componentes usa DOM puro, eventos web e tipos HTML.
- Exemplos concretos aparecem em `Button`, `Select`, `Modal`, `Drawer`, `Tooltip`, `Checkbox`, `RadioCard` e varios inputs.
- Na pratica, hoje a base compartilha primitives, mas a maioria dos componentes prontos ainda e web-first.

#### 3. Existem duas arquiteturas de styling concorrentes

- As primitives usam `ArborTransform`.
- A maior parte dos componentes finais usa `inline style` e logica local.
- O `theme.components` praticamente so cobre `text`.
- Isso impede override consistente, recipes reaproveitaveis e personalizacao escalavel por tema.

#### 4. O contrato publico diverge do runtime

- `testID` existe na tipagem de `ArborTransformProps`, mas e bloqueado pela regra de forward de props.
- Isso quebra inclusive os testes das primitives base.
- O type system atual tambem nao modela bem `style`, `ref`, polimorfismo e diferencas entre web e native.

#### 5. Componentes interativos ainda estao centrados em renderizacao, nao em comportamento

- `Modal`, `Drawer`, `Tooltip`, `Tabs` e `Select` renderizam interface, mas ainda nao implementam uma infraestrutura compartilhada de comportamento.
- Faltam primitives como `Portal`, `DismissableLayer`, `FocusScope`, `Presence`, `useControllableState` e contratos acessiveis mais robustos.
- `Select` e o caso mais evidente de acoplamento entre UI, estado e DOM.

#### 6. Ha sinais claros de drift estrutural

- Existem imports quebrados ou dependentes de barrels incompletos.
- Existem referencias a tokens que nao existem mais no tema atual.
- Existem erros de typecheck espalhados por contracts, testes e implementacoes native/web.

#### 7. A arquitetura ainda nao esta protegida por quality gates suficientes

- Os testes expuseram quebra no contrato de `testID`.
- O `typecheck` revelou desalinhamento entre theme schema, components, exports e runtime.
- Para uma lib, isso significa que a arquitetura ainda nao esta garantida pelo tooling.

### Output 2: Proximo passo recomendado

O proximo passo recomendado nao e refatorar um componente isolado. O passo correto e estabilizar a base arquitetural da lib antes de refatorar `Modal`, `Select` ou qualquer familia de componentes mais complexa.

#### PR 1 recomendado

O primeiro PR deve focar em:

- separar runtime da lib do demo/playground;
- corrigir boundaries entre `foundations`, `ecosystem` e `components`;
- definir oficialmente o que e `cross-platform` e o que ainda e `web-only`;
- fechar os contratos minimos de `theme`, `ArborTransform` e `testID`.

#### Escopo sugerido para o PR 1

- Remover `playground` da API publica.
- Eliminar a dependencia de `foundations -> ecosystem`.
- Definir entrypoints explicitos e semanticamente corretos.
- Corrigir o contrato de `testID`.
- Corrigir exports quebrados e drift de tipagem.

#### Estrutura alvo sugerida

```text
src/
  foundations/
    tokens/
    theme/
    breakpoints/
  primitives/
    provider/
    styled-system/
    layout/
    typography/
    interaction/
    overlay/
  components/
    web/
      button/
      field/
      select/
      tabs/
      dialog/
      drawer/
      tooltip/
    shared/
      recipes/
      hooks/
      utils/
  apps/
    playground/
```

#### Ordem recomendada apos o PR 1

1. estabilizar `ArborTransform` e a tipagem polimorfica;
2. criar infraestrutura shared de comportamento;
3. refatorar a familia `Field/Input`;
4. refatorar overlays;
5. refatorar navegacao e selecao.

#### Decisao importante

A primeira familia de componentes a ser refatorada depois da base nao deve ser `Button`. Deve ser `Field/Input`, porque e onde hoje se concentram mais duplicacao, inconsistencias de contrato e necessidade de anatomia por slots.

## Fases necessarias da reestruturacao

## Fase 0: Baseline e guardrails

### Objetivo

Estabelecer o estado atual da base e impedir que a reestruturacao aconteca sem indicadores de regressao.

### Entregaveis

- comando de `typecheck` funcional e incorporado ao fluxo local;
- comando de `test` executavel de forma confiavel;
- checklist do estado atual com erros conhecidos;
- inventario da API publica atual;
- mapa de componentes `shared`, `web-only` e `native-ready`.

### Criterios de aceite

- o time consegue executar `test`, `typecheck` e `lint`;
- existe uma lista objetiva dos problemas atuais que a reestruturacao precisa eliminar;
- a superficie publica da lib esta documentada antes da mudanca.

## Fase 1: Correção das fronteiras arquiteturais

### Objetivo

Restaurar a direcao correta entre camadas e separar biblioteca de aplicacao de demonstracao.

### Entregaveis

- `foundations` sem depender de `ecosystem`;
- `playground` removido da API publica da lib;
- reorganizacao inicial dos entrypoints;
- revisao dos barrels para exportar somente o que pertence a cada camada.

### Criterios de aceite

- `foundations` pode ser consumido sem importar nada de `ecosystem`;
- `ecosystem` nao expoe `playground` como parte do contrato da lib;
- a arvore de dependencias segue `foundations -> primitives/ecosystem -> components`.

## Fase 2: Estabilização do contrato base da engine

### Objetivo

Definir e corrigir o contrato minimo da engine de renderizacao e estilo.

### Entregaveis

- revisao de `ArborTransformProps`;
- tratamento consistente para `testID`, `style`, `ref`, `as` e props de sistema;
- alinhamento entre runtime web e native;
- correcoes de type drift em `Clickable`, `Box`, `Flex`, `Container`, `Image` e styled engine.

### Criterios de aceite

- `testID` funciona de forma consistente nos componentes base;
- `typecheck` deixa de falhar por contratos estruturais da engine;
- o modelo polimorfico da lib fica claro e documentado.

## Fase 3: Definição oficial da superficie cross-platform

### Objetivo

Parar de comunicar como universal aquilo que ainda e especifico de web.

### Entregaveis

- classificacao formal de cada componente como `shared`, `web-only` ou `native-ready`;
- entrypoints distintos quando necessario;
- documentacao de consumo para cada superficie.

### Criterios de aceite

- nenhum consumidor precisa adivinhar o suporte por plataforma;
- componentes web-only nao ficam misturados com primitives compartilhadas;
- a documentacao da lib reflete o suporte real por ambiente.

## Fase 4: Infraestrutura shared de comportamento

### Objetivo

Criar primitives internas de comportamento para evitar que cada componente resolva overlay, foco, dismiss e controle de estado de forma isolada.

### Entregaveis

- `useControllableState`;
- `Portal`;
- `Presence`;
- `DismissableLayer`;
- `FocusScope`;
- primitives de ids e a11y para labels, descriptions e triggers.

### Criterios de aceite

- `Modal`, `Drawer`, `Tooltip`, `Tabs` e `Select` passam a depender de infraestrutura compartilhada;
- logica de comportamento deixa de ficar duplicada em cada componente;
- a acessibilidade deixa de ser tratada caso a caso.

## Fase 5: Anatomia e recipes da familia Field/Input

### Objetivo

Padronizar a familia de campos como o primeiro grande caso de componentizacao madura da lib.

### Entregaveis

- `Field.Root`;
- `Field.Label`;
- `Field.Control`;
- `Field.HelperText`;
- `Field.ErrorText`;
- recipes de tamanho, variante, estado e densidade;
- migracao de `TextInput`, `TextArea`, `SearchInput`, `Select`, `Counter` e `FileUpload` para a nova base.

### Criterios de aceite

- a familia de inputs compartilha anatomia, estados e API coerentes;
- os estilos deixam de depender de `inline style` espalhado;
- o tema passa a controlar a familia de campos por recipes/slots.

## Fase 6: Refatoração dos overlays

### Objetivo

Reestruturar componentes de overlay sobre primitives comportamentais e anatomia consistente.

### Entregaveis

- `Dialog`/`Modal` com portal, focus management e dismiss controlado;
- `Drawer` sobre a mesma infraestrutura de overlay;
- `Tooltip` com trigger e content desacoplados;
- contratos acessiveis formais para titulo, descricao e trigger.

### Criterios de aceite

- overlays compartilham base tecnica comum;
- foco, fechamento por escape, clique externo e restore de foco ficam centralizados;
- a API publica fica mais previsivel e alinhada com libs maduras.

## Fase 7: Refatoração de navegacao e selecao

### Objetivo

Padronizar componentes de estado selecionavel e navegacao sob contratos acessiveis e compostos.

### Entregaveis

- `Tabs` com anatomia por slots;
- `Select` refeito sobre field base + overlay/listbox behavior;
- melhoria de keyboard navigation e semantics.

### Criterios de aceite

- `Tabs` e `Select` deixam de ser implementacoes isoladas;
- ha consistencia entre interacao, foco, estado controlado e override visual;
- a estrutura aproxima a lib dos padroes vistos em Radix, React Aria, MUI e React Native Paper.

## Fase 8: Recipes, theming e contratos de componente

### Objetivo

Fazer o tema governar a biblioteca inteira, e nao apenas partes isoladas como `text`.

### Entregaveis

- ampliacao de `theme.components`;
- recipes por componente e por slot;
- tokens semanticos complementares onde houver gaps reais;
- remocao gradual de estilos inline hardcoded nos componentes.

### Criterios de aceite

- temas conseguem sobrescrever componentes sem forks de implementacao;
- estilos estruturais migram para recipes orientadas a slots;
- a biblioteca ganha consistencia visual e tecnica.

## Fase 9: Estabilização da API publica e documentacao final

### Objetivo

Fechar a reestruturacao com uma API publica clara, documentada e segura para consumo.

### Entregaveis

- revisao final de exports;
- documentacao de uso por entrypoint;
- guia de migracao interno;
- exemplos de consumo para web e, quando aplicavel, native;
- cobertura de testes para contracts publicos principais.

### Criterios de aceite

- a API publica fica intencional, pequena e coerente;
- consumidores sabem o que e stable, experimental ou restrito por plataforma;
- a documentacao passa a refletir a arquitetura real da lib.

## Sequencia executiva recomendada

1. Executar Fase 0 e Fase 1 antes de qualquer refactor de componente complexo.
2. Fechar Fase 2 e Fase 3 para estabilizar o contrato base da plataforma.
3. Construir Fase 4 como infraestrutura interna obrigatoria.
4. Priorizar Fase 5 antes de overlays e navegacao.
5. Executar Fase 6 e Fase 7 sobre as novas primitives comportamentais.
6. Consolidar Fase 8 e Fase 9 para transformar a reestruturacao em contrato estavel de produto.

## Resultado esperado ao final

Ao final da reestruturacao, a `arbor-ds` deve operar com:

- camadas independentes e previsiveis;
- API publica menor e mais clara;
- suporte por plataforma explicitado;
- primitives tecnicas fortes;
- componentes montados por anatomia, slots e recipes;
- acessibilidade e comportamento centralizados;
- typecheck, testes e exports protegendo a arquitetura.

Esse e o ponto em que a biblioteca deixa de ser apenas um conjunto promissor de componentes e passa a se comportar como uma base escalavel de design system.
