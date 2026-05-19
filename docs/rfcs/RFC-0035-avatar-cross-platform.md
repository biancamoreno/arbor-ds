# RFC-0035 — Avatar cross-platform e themable

**Status**: **Draft (2026-05-03)**
**Autores**: arbor-ds-arch
**Data**: 2026-05-03
**Origem**: review R9 (achados AV-Bug-1, AV-Hard-1/2/3, AV-Plat-1, AV-Style-1/2/3). Avatar é tagueado `@platform shared` mas sem `.native.tsx`, e `AvatarImage` é DOM-only.

---

## Motivação

Hoje (`avatar.tsx`):

```tsx
function AvatarImage({ src, alt, ...props }: AvatarImageProps) {
  return (
    <Box
      as="img"               // ← bloqueio absoluto de native
      src={src} alt={alt}
      onLoad={…} onError={…}
      style={{ objectFit: 'cover', ...style }}
    />
  );
}

interface AvatarImageProps extends ImgHTMLAttributes<HTMLImageElement> { … }
```

E:

```tsx
const SIZE_PX: Record<…, number> = {
  xsmall: 24, small: 32, medium: 40, large: 48, xlarge: 64,
};
```

Pixels hardcoded por tamanho — densidade de avatar é decisão de identidade típica entre produtos (B prefere avatares densos, F prefere espaçosos). Hoje não-themable.

`AvatarGroup` aplica `boxShadow: '0 0 0 2px ${ringColor}'` lendo `theme.colors.surface.default` cru — não é `boxShadow` token, é string concatenada. RFC-0027/TD-022 já estabeleceram que sombras vivem em `shadows.{token}`.

### Por que importa

- **Paridade native** — Avatar aparece em quase toda lista mobile (chat, feed, comentários). Web-only é incompatível com a missão do DS.
- **Identidade themable** — densidade de avatar e cor do anel de empilhamento são decisões de produto.
- **Alinhamento com Image (RFC-0011/0012)** — o DS já tem componente `<Image>` cross-platform. Avatar deve compor com ele, não duplicar.

---

## Proposta

### 1. `AvatarImage` consome `<Image>` do DS

```tsx
import { Image } from '../../core'; // já cross-platform via RFC-0011/0012

function AvatarImage({ src, alt, onLoad, onError, ...rest }: AvatarImageProps) {
  const { setImageStatus } = useAvatarContext();
  return (
    <Image
      mode="img"
      src={src}
      alt={alt}
      onLoad={(e) => { setImageStatus('loaded'); onLoad?.(e); }}
      onError={(e) => { setImageStatus('error'); onError?.(e); }}
      {...rest}
      width="100%"
      height="100%"
      objectFit="cover"           // Image suporta nativo + web
    />
  );
}
```

### 2. Interfaces sem `HTMLAttributes`/`ImgHTMLAttributes`

```ts
// AvatarProps.ts
import type { ReactNode, CSSProperties } from 'react';

interface AvatarRootProps {
  children: ReactNode;
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  shape?: 'circle' | 'square';
  className?: string;
  style?: CSSProperties;
}

interface AvatarImageProps {
  src: string;
  alt: string;
  onLoad?: (e: ImageLoadEvent) => void;     // tipo cross-platform já em Image
  onError?: (e: ImageErrorEvent) => void;
  className?: string;
  style?: CSSProperties;
}

interface AvatarFallbackProps {
  children: ReactNode;
  delayMs?: number;
  className?: string;
  style?: CSSProperties;
}

interface AvatarGroupProps {
  children: ReactNode;
  max?: number;
  size?: AvatarRootProps['size'];
  className?: string;
  style?: CSSProperties;
}
```

### 3. Tamanhos themable: `sizes.avatar.*`

```ts
// foundations/theme/base-theme.ts (extensão)
sizes: {
  …,
  avatar: {
    xsmall: 24,
    small: 32,
    medium: 40,
    large: 48,
    xlarge: 64,
  },
  // overlap usado por AvatarGroup
  avatarOverlap: {
    xsmall: 7, small: 10, medium: 12, large: 14, xlarge: 19, // px ≈ 30% da altura
  },
}
```

E no componente:

```tsx
const theme = useTheme();
const px = theme.sizes.avatar[size];
const overlap = theme.sizes.avatarOverlap[size];

<Flex width={px} height={px} … />
```

### 4. Anel de empilhamento via token

```ts
// foundations/theme/base-theme.ts
shadows: {
  …,
  avatarRing: '0 0 0 2px {colors.surface.default}', // resolvido pelo handler de shadows (TD-022 pattern)
}
```

E:

```tsx
<Box boxShadow="avatarRing" … />
```

Produto consumidor pode redefinir `shadows.avatarRing` (cor ou espessura) sem editar o componente.

### 5. `.native.tsx`

Implementação espelha web; `AvatarImage` já cross-platform graças ao `<Image>` do DS. Único lugar com bifurcação real é o `AvatarGroup` ring/overlap (web pode usar `boxShadow`; native usa `Border` + `marginLeft`).

### 6. Limpeza colateral

- `style={{ width, height }}` → props `width`/`height`.
- `style={{ objectFit: 'cover' }}` → prop `objectFit` (já existe em `layout.ts`).
- `fontSize="sm"` → `fontSize="small"` (alinhamento SP-1).
- Slot recipe `avatar` opcional (sizes via tokens já dá completude; recipe vira útil quando produto quiser variar shape ou border por tamanho).

---

## Plano de execução

PR único:
1. Adicionar `sizes.avatar.*` + `sizes.avatarOverlap.*` + `shadows.avatarRing` ao `base-theme`.
2. Reescrever `avatar.tsx` consumindo Image + tokens.
3. Criar `avatar.native.tsx` (espelho).
4. Atualizar interfaces (sem `HTMLAttributes`/`ImgHTMLAttributes`).
5. Stories + testes paritários.
6. CONTRIBUTING §Avatar.

Risco baixo, sem consumidores externos, breaking interno.

---

## Riscos / Trade-offs

| Risco | Mitigação |
|---|---|
| Image cross-platform tem quirks (RFC-0011) | Já em produção; avatar é caso simples (sem `mode='background'`) |
| `objectFit` em RN é `resizeMode` na primitiva, mas `<Image>` do DS abstrai | Já abstraído |
| Overlap exato (30%) vira token e perde flexibilidade | Default 30% via tokens; consumidor pode override |

---

## Critérios de aceite

- [ ] `AvatarImage` consome `<Image>` do DS, não `<Box as="img">`.
- [ ] Interfaces sem extensão de `HTMLAttributes`/`ImgHTMLAttributes`.
- [ ] `avatar.native.tsx` paritário (`scripts/check-platform-contract.js --strict` verde).
- [ ] `sizes.avatar.*` e `shadows.avatarRing` no `base-theme`.
- [ ] `boxShadow` inline removido do componente.
- [ ] `style={{}}` zerado (CSS coberto pelo engine).
- [ ] Bateria verde (web + native).
- [ ] Stories cobrindo 5 sizes × 2 shapes + AvatarGroup com 1/3/5 + max=3 overflow.

---

## Dependências

- **RFC-0011/0012** (Image cross-platform) — já em produção.
- **TD-022** pattern de `shadows` themable — já estabelecido.
- Não depende de RFC-0036/0037/0038 (independente).
