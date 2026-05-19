/**
 * @platform native
 *
 * No-op em React Native — não existe scroll de body global; o `<Modal>` já
 * absorve toques fora do conteúdo. Existe por paridade de assinatura para o
 * caller cross-platform.
 */
export function useBodyScrollLock(_active: boolean): void {
  // intencionalmente vazio
}
