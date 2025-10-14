import { useTheme, useArborTheme } from '../theme'
import { Button } from '../components'

export function Playground() {
  const theme = useTheme()
  const { current, toggleTheme } = useArborTheme()

  return (
    <div
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        minHeight: '100vh',
        padding: theme.spacing.lg,
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: theme.spacing.lg,
        }}
      >
        <h1 style={{ margin: 0 }}>🌿 Arbor Design System</h1>
        <button
          onClick={toggleTheme}
          style={{
            background: theme.colors.primary,
            color: '#fff',
            border: 'none',
            borderRadius: theme.radii.sm,
            padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
            cursor: 'pointer',
          }}
        >
          {current === 'light' ? '🌙 Modo Escuro' : '☀️ Modo Claro'}
        </button>
      </header>

      <Button>Botão Arbor</Button>
    </div>
  )
}
