import React from 'react'
import ReactDOM from 'react-dom/client'
import { ArborProvider, Playground } from './ecosystem'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ArborProvider defaultTheme="light">
      <Playground />
    </ArborProvider>
  </React.StrictMode>,
)
