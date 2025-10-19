import { useTheme } from '../../../ecosystem'
import type { ButtonProps } from '../interfaces'

export function Button({ children }: ButtonProps) {
  const { colors, space } = useTheme()
  return (
    <button
      style={{
        backgroundColor: colors.brand.c,
        color: '#fff',
        padding: `${space.medium}px ${space.medium}px`,
        border: 'none',
        borderRadius: 8,
      }}
    >
      {children}
    </button>
  )
}
