import type { CSSProperties, ReactNode, SyntheticEvent } from 'react';

/**
 * Modos de redimensionamento, alinhados a CSS `object-fit` (web) e `resizeMode` (RN).
 */
export type ImageResizeMode = 'center' | 'contain' | 'cover' | 'stretch';

/**
 * Source aceito pela `Image`.
 *
 * - `string` — URL absoluta ou relativa (web e RN).
 * - `{ uri: string }` — assinatura compatível com RN.
 * - `number` — `require(...)` de asset local em RN. Em web é convertido para string e
 *   delegado ao bundler; combinações inviáveis devem ser evitadas pelo consumidor.
 */
export type ImageSource = string | { uri: string } | number;

/**
 * Eventos web da `Image` (RFC-0011): `SyntheticEvent` do React. A implementação native
 * tem assinaturas próprias (`NativeSyntheticEvent`) — não tipadas aqui para evitar
 * acoplamento ao runtime nativo na build web.
 */
export type ImageLoadEvent = SyntheticEvent<HTMLImageElement>;
export type ImageErrorEvent = SyntheticEvent<HTMLImageElement>;

/**
 * UI exibida durante o carregamento (RFC-0012).
 *
 * - `'skeleton'` (default) — placeholder com shimmer, dimensionado pela imagem.
 * - `'none'` — não exibe nada (comportamento legado, sem fallback).
 * - `ReactNode` — UI customizada.
 */
export type ImageFallback = ReactNode | 'skeleton' | 'none';

/**
 * UI exibida quando a imagem falha em carregar (RFC-0012).
 *
 * - `'icon'` (default) — `Icon` `ImageOff` com `aria-label="Imagem indisponível"`.
 * - `'none'` — não exibe nada (comportamento legado, sem fallback).
 * - `ReactNode` — UI customizada.
 */
export type ImageErrorFallback = ReactNode | 'icon' | 'none';

type ImageBaseProps = {
  /** Source da imagem. */
  source: ImageSource;
  /** Largura da imagem (px ou string CSS / dimensão RN). */
  width?: number | string;
  /** Altura da imagem (px ou string CSS / dimensão RN). */
  height?: number | string;
  /** Estratégia de redimensionamento. Default: `'cover'`. */
  resizeMode?: ImageResizeMode;
  /** Estilos adicionais. Use props declarativas sempre que possível. */
  style?: CSSProperties;
  /** ID para teste — espelhado em `data-testid` (web) e `testID` (RN). */
  testID?: string;
  /** Disparado após o carregamento concluir com sucesso. */
  onLoad?: (event: ImageLoadEvent) => void;
  /** Disparado quando o carregamento falha. */
  onError?: (event: ImageErrorEvent) => void;
  /**
   * UI durante o carregamento (RFC-0012). Default: `'skeleton'`.
   * Use `'none'` para desativar.
   */
  fallback?: ImageFallback;
  /**
   * UI quando a imagem falha em carregar (RFC-0012). Default: `'icon'`.
   * Use `'none'` para desativar.
   */
  errorFallback?: ImageErrorFallback;
};

/**
 * Modo `'img'` (default): renderiza `<img>` no web e `<Image>` no RN. `alt` é obrigatório
 * por acessibilidade. `children` não é permitido — para overlay use `mode="background"`.
 */
export type ImageImgProps = ImageBaseProps & {
  mode?: 'img';
  /** Texto alternativo. Use `''` para imagens decorativas. */
  alt: string;
  children?: never;
};

/**
 * Modo `'background'`: renderiza um container com `background-image` (web) ou
 * `<ImageBackground>` (RN), com `children` sobreposto. `alt`, quando presente, é
 * aplicado como `aria-label` no container — preserva anúncio para leitores de tela.
 */
export type ImageBackgroundProps = ImageBaseProps & {
  mode: 'background';
  /** Conteúdo sobreposto à imagem. */
  children: ReactNode;
  /** Texto descritivo (vira `aria-label` no container). */
  alt?: string;
};

/**
 * @platform shared
 *
 * Componente de imagem cross-platform com modos explícitos e estados padrão.
 *
 * RFC-0011 — Modo de renderização explícito:
 *
 * ```tsx
 * <Image source="..." alt="Foto" />                          // <img>
 * <Image mode="background" source="..."><Caption/></Image>   // background
 * ```
 *
 * RFC-0012 — Estados de loading e error com UI padrão:
 *
 * ```tsx
 * <Image source="..." alt="..." />                                  // skeleton + icon defaults
 * <Image source="..." alt="..." fallback={<Spinner/>} />            // loading custom
 * <Image source="..." alt="..." errorFallback="none" />             // sem fallback de erro
 * ```
 */
export type ImageProps = ImageImgProps | ImageBackgroundProps;
