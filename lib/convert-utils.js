const he = require('he')
const uuidv4 = require('uuid/v4')
const moment = require('moment')
const rp = require('request-promise-native')

module.exports = {
  base64Encode: s => new Buffer(s).toString('base64'),
  base64Decode: s => new Buffer(s, 'base64').toString('ascii'),
  urlEncode: s => encodeURIComponent(s),
  urlDecode: s => decodeURIComponent(s),
  htmlEncode: s => he.encode(s),
  htmlDecode: s => he.decode(s),

  toUpper: s => s.toUpperCase(),
  toLower: s => s.toLowerCase(),
  replace: (s, a, b) => s.replace(new RegExp(a, 'g'), b),

  convertFromMs: s => moment(Number(s)).format(),
  convertFromUnix: s => moment.unix(Number(s)).format(),
  curTimeFormatted: () => moment().format(),
  curTimeUnixMilli: () => +moment(),
  curTimeUnix: () => moment().unix(),

  uuid: () => uuidv4(),
  ip: () => rp.get('https://api.ipify.org').catch(e => e.message),
}
