const he = require('he')
const uuidv4 = require('uuid/v4')
const moment = require('moment')
const rp = require('request-promise-native')
const wordCount = require('word-count')
const zlib = require('zlib')

module.exports = {
  base64Encode: s => new Buffer(s).toString('base64'),
  base64Decode: s => new Buffer(s, 'base64').toString('utf8'),
  urlEncode: s => encodeURIComponent(s),
  urlDecode: s => decodeURIComponent(s),
  htmlEncode: s => he.encode(s),
  htmlDecode: s => he.decode(s),

  toUpper: s => s.toUpperCase(),
  toLower: s => s.toLowerCase(),
  replace: (s, a, b) => s.replace(new RegExp(a, 'g'), b),
  countOccurrences: (s, a) => (s.match(new RegExp(a, 'g')) || []).length,
  countOccurrencesI: (s, a) => (s.match(new RegExp(a, 'gi')) || []).length,
  trim: s => s.trim(),
  reverse: s => s.split('').reverse().join(''),
  removeNewlines: s => s.replace(/\n/g, ''),
  wordCount: s => `${wordCount(s)} words\n${s.length} characters`,

  convertFromMs: s => moment(Number(s)).format(),
  convertFromUnix: s => moment.unix(Number(s)).format(),
  curTimeFormatted: () => moment().format(),
  curTimeUnixMilli: () => +moment(),
  curTimeUnix: () => moment().unix(),

  samlReqEncode: s => Buffer.from(zlib.deflateRawSync(Buffer.from(s))).toString('base64'),
  samlReqDecode: s => zlib.inflateRawSync(Buffer.from(s, 'base64')).toString(),

  uuid: () => uuidv4(),
  ip: () => rp.get('https://api.ipify.org').catch(e => e.message),
  coinToss: () => Math.random() * 2 > 1 ? 'HEADS' : 'TAILS',
  diceRoll: () => Math.ceil(Math.random() * 6),
}
