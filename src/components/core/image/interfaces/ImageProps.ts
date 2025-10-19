export type ImageProps = {
  source: string | { uri: string } | number;
  width?: number | string;
  height?: number | string;
  resizeMode?: ResizeMode;
  style?: object;
  children?: React.ReactNode;
  testID?: string;
  alt?: string;
  onError?: () => void;
  onLoad?: () => void;
};

type ResizeMode = 'center' | 'contain' | 'cover' | 'stretch';
