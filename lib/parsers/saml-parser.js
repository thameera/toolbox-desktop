const { base64Decode } = require('../convert-utils')
const saml = require('saml20')
const xmlFormat = require('xml-formatter')

module.exports = text => {
  const xml = base64Decode(text)
  if (!xml.startsWith('<samlp')) {
    return null
  }
  const formattedXML = xmlFormat(xml, { indentation: '  ' })
  return new Promise((resolve, reject) => {
    saml.parse(xml, (err, profile) => {
      if  (err) {
        console.log(err)
        return reject(err)
      }
      resolve({ xml: formattedXML, profile })
    })
  })
}
