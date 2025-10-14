import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from './theme'
import { Playground } from './playground'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light">
      <Playground />
    </ThemeProvider>
  </React.StrictMode>,
)
