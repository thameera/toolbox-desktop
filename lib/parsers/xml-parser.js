const parseString = require('xml2js').parseString
const xmlFormat = require('xml-formatter')

module.exports = text => {
  return new Promise((resolve, reject) => {
    parseString(text, (err, res) => {
      if (err) {
        return reject(err)
      }
      resolve({
        xml: xmlFormat(text, {}).replace(/\n\s*\n/g, '\n'),
        json: res
      })
    })
  })
}
