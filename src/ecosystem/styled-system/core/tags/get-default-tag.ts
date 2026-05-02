import { type Tags } from './tags';

/**
 * Tag default usada pelo `ArborTransform` no caminho web quando `as` não é
 * informado. Em React Native a transformação tem caminho próprio (componentes
 * `.native.tsx` mapeiam diretamente para `View`/`Text`/`Pressable`), então este
 * helper só é consumido no bundle web.
 */
export function getDefaultTag(): Tags {
  return 'div';
}
