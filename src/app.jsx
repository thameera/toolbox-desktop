import * as React from 'react'
import { createRoot } from 'react-dom/client'

function render() {
  const container = document.getElementById('app')
  const root = createRoot(container)
  root.render(<h2>Hello from React!</h2>)
}

render()