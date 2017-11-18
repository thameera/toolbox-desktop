const he = require('he')
const uuidv4 = require('uuid/v4')

module.exports = {
  base64Encode: s => new Buffer(s).toString('base64'),
  base64Decode: s => new Buffer(s, 'base64').toString('ascii'),
  urlEncode: s => encodeURIComponent(s),
  urlDecode: s => decodeURIComponent(s),
  htmlEncode: s => he.encode(s),
  htmlDecode: s => he.decode(s),

  toUpper: s => s.toUpperCase(),
  toLower: s => s.toLowerCase(),

  uuid: s => uuidv4(),
}
