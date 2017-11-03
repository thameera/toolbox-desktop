const jwtDecode = require('jwt-decode')

module.exports = jwt => {
  try {
    const header = jwtDecode(jwt, {header: true})
    const payload = jwtDecode(jwt)
    const res = []

    const addItem = kvpair => {
      const val = typeof kvpair[1] === 'object' ? JSON.stringify(kvpair[1]) : kvpair[1]
      res.push({ name: kvpair[0], val: val })
    }

    res.push({ heading: 'Header' })
    Object.entries(header).forEach(addItem)

    res.push({ heading: 'Payload' })
    Object.entries(payload).forEach(addItem)

    return res
  } catch (e) {
    return null
  }
}
