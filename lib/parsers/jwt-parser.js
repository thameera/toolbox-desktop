const jwtDecode = require('jwt-decode')
const moment = require('moment')

module.exports = jwt => {
  try {
    const header = jwtDecode(jwt, {header: true})
    const payload = jwtDecode(jwt)
    const res = []

    const addItem = kvpair => {
      const key = kvpair[0]
      const val = typeof kvpair[1] === 'object' ? JSON.stringify(kvpair[1]) : kvpair[1]
      const obj = { name: key, val: val }
      if (['iat', 'exp', 'nbf', 'auth_time'].includes(key)) {
        obj.tooltip = moment.unix(val).format()
      }
      res.push(obj)
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
