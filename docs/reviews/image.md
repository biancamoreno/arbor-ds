# Review — `Image`

> Use `✅ OK` / `⚠️ Melhoria` / `❌ Quebra` por item. Toda `⚠️` ou `❌` vira issue, PR ou RFC (ver seção 7).

**Fase:** R3 · **Camada:** `core` · **Status:** `concluído`
**Revisor:** Arquiteto Arbor-DS · **Data:** 2026-04-23 · **Versão atual:** `1.0.0`

---

## 0. Escopo

- **Arquivos fonte:** `src/components/core/image/core/image.tsx`, `image.native.tsx`
- **Story:** `src/components/core/image/core/image.stories.tsx`
- **Testes:** ausentes
- **Implementação nativa:** `image.native.tsx` — sim
- **Classificação cross-platform:** `platform-split` (web tem dois caminhos de renderização — `<img>` ou `background-image`; RN usa `Image` nativo)
- **Dependências internas:** `Box` (web)
- **Consumidores conhecidos:** `Avatar` (internamente), `Card` (imagem de capa), componentes de produto com banners ou thumbnails.

---

## 1. Visual

| # | Item | Status | Nota |
|---|---|---|---|
| 1.1 | Variantes declaradas × renderizadas no Storybook batem | ⚠️ | Stories: `Default`, `Contain`, `WithOverlay`. Faltam `center` e `stretch` de `resizeMode`. |
| 1.2 | Tokens usados | ❌ | Sem tokens. `width`, `height` passados como valores brutos. Sem tokens de radius (para imagem arredondada), border, ou aspectRatio. |
| 1.3 | Estados visuais: loading, error | ❌ | Sem estado de loading nem de erro. `onError`, `onLoad` são callbacks mas não há UI de feedback padrão. |
| 1.4 | Escala coerente | ⚠️ | `resizeMode` tem 4 opções (`cover`, `contain`, `stretch`, `center`) — coerente com CSS/RN, mas sem documentação de quando usar cada um. |
| 1.5 | Contraste ≥ WCAG AA | ✅ | Não aplicável para elemento de imagem em si. |
| 1.6 | Microinterações | ✅ | Não aplicável. |
| 1.7 | Animações respeitam reduced motion | ✅ | Não aplicável. |
| 1.8 | Ícones usam `<Icon>` do DS | ✅ | Não aplicável. |

**Observações livres:**

A ausência de estados de `loading` e `error` com UI padrão é uma lacuna para uso em produção. Imagens que falham em carregar ficam completamente invisíveis — sem ícone placeholder, sem skeleton, sem fallback. Para um DS cross-platform, isso é uma responsabilidade do primitivo.

---

## 2. Comportamental

| # | Item | Status | Nota |
|---|---|---|---|
| 2.1 | Teclado | ✅ | Imagem não é interativa por padrão. |
| 2.2 | Focus management | ✅ | Não aplicável; `forwardRef` ausente mas aceitável para imagem estática. |
| 2.3 | `role` e `aria-*` | ⚠️ | `alt` presente mas sem `role`. Imagem decorativa deveria suportar `alt=""` explícito (já possível, mas não documentado). Modo background-image (`children` path) não renderiza `<img>` — sem `alt` possível. |
| 2.4 | Anúncios a leitor de tela | ⚠️ | No path com `children`, o background-image não é anunciado por leitores de tela (é presentacional). No path `<img>`, `alt` funciona normalmente. |
| 2.5 | Touch target | ✅ | Não aplicável. |
| 2.6 | Controlado × não-controlado | ✅ | Não aplicável. |
| 2.7 | Evento cancelável | ✅ | `onError`, `onLoad` disponíveis. |
| 2.8 | RTL | ✅ | Não aplicável. |

**Observações livres:**

O dual render (com `children` → `background-image` vs. sem `children` → `<img>`) cria comportamento de acessibilidade assimétrico. Na versão background, não há maneira de anunciar a imagem a leitores de tela — nem `aria-label` nem `aria-describedby` são passados para o `Box` container por padrão. Consumidores precisam conhecer essa diferença, o que aumenta a carga cognitiva.

---

## 3. Funcional (API)

| # | Item | Status | Nota |
|---|---|---|---|
| 3.1 | API mínima, sem props redundantes | ⚠️ | `children` em `Image` cria comportamento duplo implícito (overlay vs. img). Contratos distintos demais para uma única prop booleana implícita. |
| 3.2 | Naming segue convenção | ✅ | `source`, `resizeMode`, `alt`, `onError`, `onLoad` — alinhados com padrões RN/web. |
| 3.3 | Defaults são "least surprise" | ✅ | `resizeMode="cover"` é o default mais comum em cards/thumbnails. |
| 3.4 | Combinações inválidas bloqueadas | ❌ | `source: string | { uri: string } | number` — sem discriminated union. `children` com `as="img"` seria inválido mas não bloqueado. |
| 3.5 | Polimorfismo via `as` | ⚠️ | `Box as="img"` internamente, mas não via prop pública. Correto para Image, mas limita composição. |
| 3.6 | `forwardRef` presente; `displayName` definido | ❌ | Ambos ausentes em `image.tsx` e `image.native.tsx`. |
| 3.7 | Compound components / slots | ✅ | Não aplicável. |
| 3.8 | Tipos públicos exportados | ✅ | `ImageProps` exportado via `index.ts`. |

**Surface area atual:**

```ts
type ImageProps = {
  source: string | { uri: string } | number; // ⚠️ sem discriminated union
  width?: number | string;         // ⚠️ sem mapeamento para tokens
  height?: number | string;        // ⚠️ sem mapeamento para tokens
  resizeMode?: ResizeMode;         // 'cover' | 'contain' | 'stretch' | 'center'
  style?: object;                  // ❌ deveria ser CSSProperties
  children?: React.ReactNode;      // ⚠️ muda modo de renderização implicitamente
  testID?: string;
  alt?: string;                    // ⚠️ deveria ser obrigatório ou ter default vazio para decorativas
  onError?: () => void;
  onLoad?: () => void;
}
```

**Observações livres:**

`style?: object` é tipagem fraca — perde autocompletar de propriedades CSS e não avisa sobre props inválidas. Deveria ser `CSSProperties` no web e `ImageStyle` no native (que já está correto em `image.native.tsx`).

O comportamento dual via `children` é o achado arquitetural mais importante: **a presença ou ausência de `children` muda silenciosamente o mecanismo de renderização** (de `<img>` para `Box` com `background-image`). Isso viola o princípio de menor surpresa. Uma API explícita seria mais honesta:

```ts
// Alternativa: prop explícita para modo overlay
type ImageProps =
  | { mode?: 'img'; source: ...; alt: string; children?: never; ... }
  | { mode: 'background'; source: ...; children: ReactNode; alt?: never; ... }
```

---

## 4. Código

| # | Item | Status | Nota |
|---|---|---|---|
| 4.1 | Sem tags HTML puras | ✅ | Usa `Box` com `as="img"` — correto. |
| 4.2 | Sem `style={{...}}` onde há prop declarativa | ❌ | `style={{ objectFit, width, height, ...style }}` no path `<img>` — `objectFit` não tem prop declarativa equivalente no styled-system; escape hatch justificável. Mas `width` e `height` **têm** props declarativas. |
| 4.3 | Estrutura de pasta | ✅ | `core/`, `interfaces/` presentes. |
| 4.4 | Estilo via recipe | ✅ | Sem recipe — correto para primitivo de imagem. |
| 4.5 | Sem `any`, sem cast não justificado | ⚠️ | `style as StyleProp<ImageStyle>` em `image.native.tsx` — cast necessário pela natureza do RN; aceitável. |
| 4.6 | Testes cobrem estados, variantes, a11y | ❌ | Nenhum teste. |
| 4.7 | Story cobre default, variantes, estados, playground | ⚠️ | 3 stories; faltam `center`, `stretch`, `onError`, `onLoad`. `WithOverlay` usa `<div style={{...}}>` cru. |
| 4.8 | `.native.tsx` presente | ✅ | `image.native.tsx` com lógica correta de normalização. |
| 4.9 | Imports respeitam camadas | ✅ | Importa apenas `Box` de `../../box`. |

**Bug detectado — `width`/`height` duplicados em `image.tsx`:**

```tsx
// Na implementação atual:
<Box
  as={'img'}
  src={source}
  style={{
    objectFit: resizeMode === 'stretch' ? undefined : resizeMode,
    width: props.width,    // ← width no style={{...}}
    height: props.height,  // ← height no style={{...}}
    ...style,
  }}
  {...props}               // ← props inclui width e height TAMBÉM
/>
```

`width` e `height` são passados duas vezes: uma via `style={{ width, height }}` e outra via `{...props}` (que inclui `width` e `height` de `ImageProps`). O spread `{...props}` ganha — tornando o `style` ineficaz para dimensionamento. O correto seria usar apenas props declarativas:

```tsx
<Box
  as={'img'}
  src={source}
  width={props.width}
  height={props.height}
  style={{ objectFit: resizeMode !== 'stretch' ? resizeMode : undefined, ...style }}
  data-testid={testID}
  alt={alt}
  {...omit(props, ['width', 'height'])}
/>
```

**Métricas rápidas:**

- LOC do componente (web): ~35
- Nº de testes: **0**
- Nº de stories: **3** (cobertura parcial)
- Dependências externas: `react-native` (native only)

---

## 5. Governança

| # | Item | Status | Nota |
|---|---|---|---|
| 5.1 | Export público correto | ✅ | Exportado de `src/components/core/index.ts`. |
| 5.2 | Tipos públicos exportados | ✅ | `ImageProps`. |
| 5.3 | Changeset entry | ⚠️ | Fixes com potencial impacto precisarão de changeset. |
| 5.4 | Breaking change tem RFC | ⚠️ | Mudança do dual render implícito para API explícita seria breaking — requer RFC. |
| 5.5 | Guia de migração | ✅ | Não necessário para fixes imediatos. |

---

## 6. Resumo executivo

**Score por eixo:** Visual `3/8` · Comportamental `4/8` · Funcional `3/8` · Código `4/9` · Governança `4/5`

**Top 3 achados (por impacto):**

1. **❌ Dual render implícito via `children`** — presença de `children` muda silenciosamente o mecanismo de renderização de `<img>` para `background-image`. Comportamento não-óbvio, assimétrico em a11y e não documentado.
2. **❌ Bug: `width`/`height` passados via `style={{...}}` e depois sobrescritos via `{...props}`** — dimensionamento via `style` é silenciosamente ignorado.
3. **❌ Ausência total de testes** — primitivo cross-platform com dois caminhos de renderização sem cobertura alguma.

**Classificação geral:**
- [ ] ✅ Aprovado sem mudanças
- [ ] ⚠️ Aprovado com fixes menores (listados abaixo)
- [x] ❌ Requer mudanças antes da próxima release

---

## 7. Follow-ups

### Fix imediato (mesmo PR da review)

- [ ] Corrigir bug de `width`/`height` duplicados em `image.tsx`: remover do `style={{...}}` e passar como props declarativas `width={props.width}` `height={props.height}` diretamente no `Box`
- [ ] Corrigir `style?: object` → `style?: CSSProperties` em `ImageProps.ts`
- [ ] Adicionar `Image.displayName = 'Image'` em `image.tsx` e `image.native.tsx`
- [ ] Story `WithOverlay`: substituir `<div style={{...}}>` por `<Box position="absolute" bottom={0} left={0} right={0} ...>`

### Issue (mudança localizada, sem breaking change)

- [ ] **[issue]** Criar suite de testes: web — renderização como `<img>`, como background (com `children`), `resizeMode`, `alt`, `onError`, `onLoad`; native — normalização de source, dimensões percentuais
- [ ] **[issue]** Criar stories: `center` resizeMode, `stretch` resizeMode, `onError` com estado de fallback, `onLoad` com loading indicator
- [ ] **[issue]** Adicionar `forwardRef` em `image.tsx`
- [ ] **[issue]** Documentar comportamento dual (`children` vs. sem `children`) no JSDoc de `ImageProps`

### RFC (sistêmico ou breaking change)

- [ ] **RFC-R3-F:** Tornar o modo de renderização explícito via prop `mode: 'img' | 'background'` ou via discriminated union em `ImageProps` — elimina o comportamento duplo implícito e resolve a assimetria de a11y entre os dois caminhos.
- [ ] **RFC-R3-G:** Estados de loading e error com UI padrão — `skeleton` ou `placeholder` para loading; `fallback` prop (ReactNode) para erro.

---

## 8. Notas de arquiteto

**Dual render é uma decisão de conveniência que cobra custo em clareza:** O `Image` web tem dois caminhos de render porque `background-image` permite overlay de children, algo que `<img>` não suporta no CSS padrão. Isso é pragmático mas confunde o modelo mental: `Image` não é um componente de imagem puro, é um container com comportamento condicional. Nomear ou documentar explicitamente os dois modos seria o mínimo; separar em dois componentes (`<Image>` e `<ImageBackground>`) seria o mais limpo — como o próprio React Native faz.

**Normalização de source em RN está correta e deveria ser espelhada no web:** `image.native.tsx` tem `normalizeSource()` que lida com `string | { uri } | number`. Em web, `source` pode ser `number` (require de asset) sem tratamento adequado — isso vai falhar silenciosamente com `url(1)` no CSS. O path de imagem no web deveria rejeitar `source: number` explicitamente via tipo ou converter.

**`onError` e `onLoad` têm assinaturas diferentes em web e RN:** Em web são callbacks `() => void`; em RN seriam `(event: NativeSyntheticEvent) => void`. A interface atual usa `() => void` nos dois, o que perde o evento nativo no RN. Para uso avançado (ex: medir dimensões reais após load), isso é uma limitação real.
