import { useArborTheme } from './provider'

export function useTheme() {
  const { theme } = useArborTheme()
  return theme
}
