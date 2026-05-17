/**
 * No-op no React Native — RN não tem o conceito de `document.activeElement`
 * acessível como no DOM. Foco em RN é gerenciado por TextInput.focus()/blur()
 * explícitos quando necessário. Existe para manter paridade de API.
 */
export function useRestoreFocus(_active: boolean = true): void {
  // intencionalmente vazio
}
