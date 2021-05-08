const forge = require('node-forge')
const pki = forge.pki

const createCNStr = obj => obj.attributes.map(attr => [attr.shortName, attr.value].join('=')).join(', ')

const getThumbprint = cert => {
  const md = forge.md.sha1.create()
  md.update(forge.asn1.toDer(pki.certificateToAsn1(cert)).getBytes())
  return md.digest().toHex().toUpperCase()
}

module.exports = certStr => {
  try {
    const res = { fields: [] }
    let pem = certStr
    if (certStr.startsWith('MI')) {
      pem = `-----BEGIN CERTIFICATE-----\n${certStr.match(/.{1,64}/g).join('\n')}\n-----END CERTIFICATE-----\n`
      res.formatted = pem
    }

    const cert = pki.certificateFromPem(pem)

    res.fields.push({ name: 'Version', val: `${cert.version+1} (0x${cert.version.toString(16)})` })
    res.fields.push({ name: 'Serial Number', val: cert.serialNumber })
    res.fields.push({ name: 'Signature Algorithm', val: pki.oids[cert.signatureOid] })
    res.fields.push({ name: 'Issuer', val: createCNStr(cert.issuer) })
    res.fields.push({ name: 'Subject', val: createCNStr(cert.subject) })
    res.fields.push({ name: 'Not Before', val: cert.validity.notBefore })
    res.fields.push({ name: 'Not After', val: cert.validity.notAfter })
    res.fields.push({ name: 'Thumbprint', val: getThumbprint(cert) })

    res.pubkey = pki.publicKeyToPem(cert.publicKey)

    return res
  } catch (e) {
    return null
  }
}
