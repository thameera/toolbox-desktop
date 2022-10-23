import { ContentCopy } from '@mui/icons-material'
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@mui/material'
import * as React from 'react'

const ParserPane = () => {
  const [input, setInput] = React.useState('')
  const [output, setOutput] = React.useState({})
  const [parsedType, setParsedType] = React.useState('')

  const onChange = async (e) => {
    setInput(e.target.value)
    const data = await window.api.parse(e.target.value)
    console.log(data)
    if (!data.error) {
      setParsedType(data.type)
      setOutput(data.value)
    } else {
      setParsedType('')
      setOutput({})
    }
  }

  const renderCopyButton = (str) => {
    return (
      <Tooltip title="Copy">
        <IconButton
          sx={{ marginRight: '5px', minWidth: 'inherit', minHeight: 'inherit'}}
          variant="outlined"
          size="small"
          onClick={() => window.api.copyToClipboard(str)}
          >
            <ContentCopy fontSize="inherit" />
          </IconButton>
      </Tooltip>
    )
  }

  const renderJWT = () => {
    return (
      <TableContainer component={Paper}>
        <Table size="small">
          {output.map((row) => {
            if (row.heading) {
              return (
                <TableHead key={row.heading + 'head'}>
                  <TableRow>
                    <TableCell colSpan={2}>{row.heading}</TableCell>
                  </TableRow>
                </TableHead>
              )
            } else {
              return (
                <TableBody key={row.name + 'body'}>
                  <TableRow>
                    <TableCell>{row.name}</TableCell>
                    <TableCell sx={{
                      padding: '1px'
                    }}>
                      <>
                        {renderCopyButton(row.val)}
                        {row.val}
                      </>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )
            }
          })}
        </Table>
      </TableContainer>
    )
  }

  return (
    <>
      <TextField
        sx={{ marginBottom: '10px' }}
        multiline
        fullWidth
        rows={6}
        value={input}
        onChange={onChange}
        />

      {parsedType === 'jwt' && renderJWT()}
    </>
  )
}

export default ParserPane