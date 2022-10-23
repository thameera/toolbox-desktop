import * as React from 'react'
import { Box, IconButton, Tooltip } from '@mui/material'
import SplitscreenIcon from '@mui/icons-material/Splitscreen';
import ParserPane from './parser_pane.jsx';

/*
 * This is the top-level container for parser panes
 */
const Parser = () => {
  const [isDualPane, setIsDualPane] = React.useState(false)

  /*
   * In dual pane mode, set up columns using CSS grid.
   */
  const getPaneContainerStyles = () => {
    return isDualPane ? {
      display: 'grid',
      gridTemplateColumns: '50% 50%',
      columnGap: '1%'
    } : {}
  }

  /*
   * Show right pane only during dual pane mode.
   */
  const getPaneStyles = (pane) => {
    return {
      display: isDualPane ?
       'inline-block' :
        pane === 1 ? 'inline-block' : 'none',
      width: isDualPane ? '98%' : '100%'
    }
  }

  return (
    <Box>
      <Box sx={{ marginBottom: '5px' }}>
        <Box sx={{ display: 'inline', fontStyle: 'italic' }}>Paste URLs, JWTs, and more</Box>
        <Box sx={{ display: 'inline', float: 'right' }}>
          <Tooltip title="Toggle dual pane">
            <IconButton
              sx={{ padding: 0 }}
              size="small"
              onClick={() => setIsDualPane(!isDualPane)}
              >
                <SplitscreenIcon sx={{ transform: "rotate(90deg)"}} size="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Box sx={getPaneContainerStyles()}>
        <Box sx={getPaneStyles(1)}>
          <ParserPane />
        </Box>
        <Box sx={getPaneStyles(2)}>
          <ParserPane />
        </Box>
      </Box>
    </Box>
  )
}

export default Parser