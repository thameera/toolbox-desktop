import { Box, CssBaseline, Tab, Tabs, ThemeProvider } from '@mui/material'
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import Parser from './components/parser.jsx'
import theme from './theme'

const App = () => {
  const [tabValue, setTabValue] = React.useState(0)

  /*
   * Show each tab panel only when it is active.
   */
  const getStyles = (tabId) => {
    return {
      display: tabValue === tabId ? 'block' : 'none',
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab label="Parser" id="tab-parser" />
            <Tab label="Converter" id="tab-converter" />
            <Tab label="Diff" id="tab-diff" />
            <Tab label="Reference" id="tab-ref" />
            <Tab sx={{ position: 'absolute', right: 0 }} label="About" id="tab-about" />
          </Tabs>
        </Box>

        <Box sx={{ m: '5px' }}>
          <Box sx={getStyles(0)}>
            <Parser /> 
          </Box>
          <Box sx={getStyles(1)}>
            TODO: Converter
          </Box>
          <Box sx={getStyles(2)}>
            TODO: Diff
          </Box>
          <Box sx={getStyles(3)}>
            TODO: Reference
          </Box>
          <Box sx={getStyles(4)}>
            TODO: About
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

function render() {
  const container = document.getElementById('app')
  const root = createRoot(container)
  root.render(<App />)
}

render()