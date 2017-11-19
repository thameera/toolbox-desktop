const URL = require('url-parse')

module.exports = url => {
  const rawUrl = url.trim()
  if (!rawUrl) {
    return null
  }

  const parsed = new URL(rawUrl)
  if (!parsed || !parsed.hostname) {
    return null
  }

  const res = []

  res.push({ name: 'Hostname', val: parsed.hostname })
  res.push({ name: 'Path', val: parsed.pathname })

  if (parsed.port) {
    res.push({ name: 'Port', val: parsed.port })
  }
  if (parsed.auth) {
    res.push({ name: 'Auth', val: parsed.auth })
  }

  const addItem = p => {
    const obj = { name: p[0], val: p[1] }
    if (p[0] === 'expires_in') {
      if (p[0] < 3600) {
        obj.tooltip = `${p[1]/60} minute(s)`
      } else {
        obj.tooltip = `${p[1]/3600} hour(s)`
      }
    }
    res.push(obj)
  }

  if (parsed.query && parsed.query.length > 1) {
    res.push({ heading: 'Query params' })
    Object.entries(URL.qs.parse(parsed.query)).forEach(addItem)
  }

  if (parsed.hash && parsed.hash.length > 1) {
    res.push({ heading: 'Hash fragment' })
    Object.entries(URL.qs.parse(parsed.hash.substr(1))).forEach(addItem)
  }

  return res
}
