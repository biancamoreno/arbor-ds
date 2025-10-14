import { useTheme } from '../../../theme'
import type { ButtonProps } from '../interfaces'

export function Button({ children }: ButtonProps) {
  const { colors, spacing } = useTheme()
  return (
    <button
      style={{
        backgroundColor: colors.primary,
        color: '#fff',
        padding: `${spacing.sm}px ${spacing.md}px`,
        border: 'none',
        borderRadius: 8,
      }}
    >
      {children}
    </button>
  )
}
