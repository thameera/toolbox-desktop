const JSON5 = require('json5')

module.exports = text => {
  try {
    const json = JSON5.parse(text)
    return json
  } catch (e) {
    return null
  }
}
