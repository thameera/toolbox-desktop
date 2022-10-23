import { TextField } from '@mui/material'
import * as React from 'react'

const ParserPane = () => {
  const [input, setInput] = React.useState('')

  const onChange = async (e) => {
    setInput(e.target.value)
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
    </>
  )
}

export default ParserPane