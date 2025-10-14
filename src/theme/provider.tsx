import React, { createContext, useContext, useState } from 'react'
import { lightTheme } from './light'
import { darkTheme } from './dark'
import type { ArborTheme, ThemeId } from './types'

type ThemeContextValue = {
  theme: ArborTheme
  current: ThemeId
  setTheme: (id: ThemeId) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({
  children,
  defaultTheme = 'light',
}: {
  children: React.ReactNode
  defaultTheme?: ThemeId
}) {
  const [current, setCurrent] = useState<ThemeId>(defaultTheme)

  const theme = current === 'light' ? lightTheme : darkTheme

  const setTheme = (id: ThemeId) => setCurrent(id)
  const toggleTheme = () => setCurrent(prev => (prev === 'light' ? 'dark' : 'light'))

  return (
    <ThemeContext.Provider value={{ theme, current, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useArborTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useArborTheme must be used within a ThemeProvider')
  return ctx
}
