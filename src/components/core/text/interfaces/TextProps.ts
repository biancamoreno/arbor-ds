import { type ArborTransformProps, type Tags } from '../../../../ecosystem';

export interface TextProps<T> extends ArborTransformProps {
  // eslint-disable-next-line @typescript-eslint/ban-types
  variant?: T | ({} & string);
  isTruncated?: boolean;
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
  role?: string;
  onPress?: () => void | Promise<void>;
}
