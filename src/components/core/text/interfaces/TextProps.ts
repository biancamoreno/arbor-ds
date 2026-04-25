import { type ArborTransformProps, type Tags } from '../../../../ecosystem';

/**
 * @platform native-ready
 * Componente de texto com implementação dedicada para web (`text.tsx`) e React Native (`text.native.tsx`).
 * Suporta web, iOS e Android.
 */
export interface TextProps<T> extends ArborTransformProps {
  variant?: T | ({} & string);
  /**
   * Trunca o texto após N linhas adicionando ellipsis. Use `1` para single-line truncate.
   * Mapeia direto para a prop nativa `numberOfLines` em React Native.
   */
  numberOfLines?: number;
  onLinkPress?: (link: string) => void;
  as?: Extract<
      Tags,
      | 'abbr'
      | 'b'
      | 'del'
      | 'em'
      | 'h1'
      | 'h2'
      | 'h3'
      | 'h4'
      | 'h5'
      | 'h6'
      | 'i'
      | 'ins'
      | 'label'
      | 'legend'
      | 'mark'
      | 'p'
      | 'span'
      | 'strong'
      | 'sub'
      | 'sup'
      | 'u'
      | 's'
      | 'a'
    >;
  role?: React.AriaRole;
  onPress?: () => void | Promise<void>;
}
