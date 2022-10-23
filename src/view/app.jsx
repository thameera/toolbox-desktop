import { CssBaseline, ThemeProvider } from '@mui/material'
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import theme from './theme'

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <h2>Hello!</h2>
    </ThemeProvider>
  )
}

function render() {
  const container = document.getElementById('app')
  const root = createRoot(container)
  root.render(<App />)
}

render()