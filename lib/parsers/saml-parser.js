const c = require('../convert-utils')
const saml = require('saml20')
const xmlFormat = require('xml-formatter')

const responseParser = text => {
  return new Promise((resolve, reject) => {
    const xml = c.base64Decode(c.urlDecode(text))
    if (!xml.includes('<samlp:Response') && !xml.includes('<saml2p:Response')) {
      return reject()
    }
    const formattedXML = xmlFormat(xml, { indentation: '  ' })
    saml.parse(xml, (err, profile) => {
      if  (err) {
        console.log(err)
        return reject(err)
      }
      resolve({ xml: formattedXML, profile })
    })
  })
}

const requestParser = text => {
  const decoded = c.urlDecode(text)
  let res = ''
  try {
    res = c.samlReqDecode(decoded)
  } catch (e) {
    // If the above fails, it maybe that the request is only
    // base64 decoded and not gzipped
    res = c.base64Decode(decoded)
  }
  if (!res.includes(':AuthnRequest')) {
    throw new Error()
  }

  return {
    xml: xmlFormat(res, { indentation: '  ' })
  }
}

module.exports = {
  responseParser,
  requestParser,
}
