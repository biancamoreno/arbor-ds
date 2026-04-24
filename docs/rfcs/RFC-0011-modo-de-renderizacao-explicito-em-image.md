# RFC-0011 — Modo de renderização explícito em `Image` (`mode: 'img' | 'background'`)

**Status**: Draft
**Autores**: Arquiteto Arbor-DS
**Data**: 2026-04-24
**Origem**: R3 · achado em `image.md`
**PR**: —

---

## Motivação

O `Image` web hoje tem **dois caminhos de renderização** que dependem da **presença de `children`**:

```tsx
// Caminho A: renderiza <img>
<Image source="..." alt="..." />

// Caminho B: renderiza <Box> com background-image
<Image source="...">
  <Text>Sobreposto na imagem</Text>
</Image>
```

Problemas:

- **Não-óbvio.** A presença ou ausência de `children` muda silenciosamente o **mecanismo de renderização**. Consumidor que não leu a implementação não sabe disso.
- **Assimetria de a11y.** No caminho B (`background-image`), `alt` não é renderizado — leitor de tela não anuncia. No caminho A, sim. Mesma prop, comportamento diferente.
- **Tipo permissivo.** TypeScript não impede combinações inválidas (`alt` no modo background, `children` no modo `<img>`).
- **Padrão React Native usa dois componentes** (`<Image>` e `<ImageBackground>`) exatamente para evitar essa ambiguidade.

## Proposta

**Tornar o modo de renderização explícito via discriminated union.**

```ts
type ImageBaseProps = {
  source: string | { uri: string };
  width?: number | string;
  height?: number | string;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  testID?: string;
  onError?: (event: ImageErrorEvent) => void;
  onLoad?: (event: ImageLoadEvent) => void;
};

type ImageImgProps = ImageBaseProps & {
  mode?: 'img';                    // default
  alt: string;                      // obrigatório
  children?: never;
};

type ImageBackgroundProps = ImageBaseProps & {
  mode: 'background';
  children: ReactNode;              // obrigatório
  alt?: string;                     // opcional — vira aria-label do container
};

export type ImageProps = ImageImgProps | ImageBackgroundProps;
```

Comportamento:

```tsx
<Image source="..." alt="Foto de perfil" />                       // ✅ <img>
<Image mode="img" source="..." alt="..." />                       // ✅ <img> explícito
<Image mode="background" source="..."><Text>...</Text></Image>    // ✅ background
<Image source="..."><Text>...</Text></Image>                      // ❌ erro: children sem mode="background"
<Image source="..." />                                            // ❌ erro: alt obrigatório
```

No modo `background`, se `alt` for passado, ele vira `aria-label` no container — mantém anúncio para leitores de tela.

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| Manter dual implícito + documentar | Documentação não conserta a assimetria de a11y. |
| Separar em dois componentes (`<Image>`, `<ImageBackground>`) | Estilo React Native; mais limpo, mas duplica surface area e quebra mais consumidores existentes. |
| Adicionar `<Image.Background>` como compound | Hierarquia confusa — não há razão para `Background` ser filho de `Image`. |
| Manter como está | Bug de a11y persiste; modelo mental continua opaco. |

**Avaliar:** se a equipe preferir a separação em dois componentes (mais explícito e alinhado a RN), reabrir RFC. A proposta de `mode` é o caminho menos invasivo.

## Impactos e trade-offs

- **Breaking change?** Sim — `<Image src="..."><Children /></Image>` passa a exigir `mode="background"`.
- **Impacto em bundle size**: zero (mesma lógica, organização de tipo diferente).
- **Impacto em performance**: zero.
- **Impacto em DX**: melhora — TypeScript guia o consumidor; ambiguidade desaparece.
- **Impacto em acessibilidade**: melhora — `alt` no modo background tem efeito visível (vira aria-label).
- **Codemod necessário?** Sim — adiciona `mode="background"` onde detecta `children` em `Image`.

## Critérios de aceite

- [ ] `ImageProps` modelado como discriminated union
- [ ] `Image` web resolve render baseado em `mode` (default `'img'`)
- [ ] No modo `background`, `alt` é aplicado como `aria-label` no container
- [ ] `Image` native respeita o mesmo `mode` (em RN, `'background'` mapeia para `<ImageBackground>` nativo)
- [ ] Stories cobrem ambos os modos
- [ ] Testes cobrem: render correto por modo, a11y de ambos, propagação de `alt`
- [ ] Codemod publicado
- [ ] Migration guide com exemplos

## Notas de implementação

- **Conjuntamente com RFC-0012** (loading/error states): ambas mexem em `Image`, considerar PR único.
- O bug de `width`/`height` duplicados (`image.tsx:38-43`) deve ser corrigido como **fix imediato**, antes da implementação desta RFC — independente.
- `style?: object` deve virar `style?: CSSProperties` (web) e `style?: StyleProp<ImageStyle>` (RN) — fix imediato também.
- Avaliar se `source: number` (require de asset) deve continuar aceito em web. Hoje cai como `url(1)` no CSS. Sugestão: rejeitar via tipo no web, manter no RN.
- Em RN, `onError` e `onLoad` recebem evento nativo (`NativeSyntheticEvent`). Web recebe `SyntheticEvent`. Tipar separadamente por plataforma — `image.tsx` exporta tipos web; `image.native.tsx` sobrepõe.
