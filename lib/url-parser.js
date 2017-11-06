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

  if (parsed.query && parsed.query.length > 1) {
    res.push({ heading: 'Query params' })
    Object.entries(URL.qs.parse(parsed.query)).forEach(p => {
      res.push({ name: p[0], val: p[1] })
    })
  }

  if (parsed.hash && parsed.hash.length > 1) {
    res.push({ heading: 'Hash fragment' })
    Object.entries(URL.qs.parse(parsed.hash.substr(1))).forEach(p => {
      res.push({ name: p[0], val: p[1] })
    })
  }

  return res
}
