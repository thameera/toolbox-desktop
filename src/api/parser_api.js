const { default: jwtDecode } = require("jwt-decode")
const { DateTime } = require("luxon")

const parse = async (str) => {
  if (!str || !str.trim()) {
    return { error: 'Empty string' }
  }

  const trimmedStr = str.trim()

  /* 
   * Try JWT parse if it starts with 'eyJ'
   */
  if (trimmedStr.startsWith('eyJ')) {
    try {
      // Remove newlines, as some HAR parsers split the params to lines
      const res = parseJWT(trimmedStr.replace(/\n/g, ''))
      return res
    } catch(e) {}
  }

  return { error: 'Unknown format' }
}

/*
 * Parse JWT
 */
const parseJWT = (str) => {
  const header = jwtDecode(str, { header: true })
  const payload = jwtDecode(str)
  const fieldArray = []

  const addItem = kvpair => {
    const key = kvpair[0]
    const val = typeof kvpair[1] === 'object' ? JSON.stringify(kvpair[1]) : kvpair[1]
    // Create human-readable tooltips for unix timestamps
    const obj = { name: key, val: val }
    if (['iat', 'exp', 'nbf', 'auth_time'].includes(key)) {
      obj.tooltip = DateTime.fromSeconds(val).toISO()
    }
    fieldArray.push(obj)
  }

  fieldArray.push({ heading: 'Header' })
  Object.entries(header).forEach(addItem)

  fieldArray.push({ heading: 'Payload' })
  Object.entries(payload).forEach(addItem)

  return { type: 'jwt', value: fieldArray }
}

module.exports = {
  parse
}