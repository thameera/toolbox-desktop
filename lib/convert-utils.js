module.exports = {
  base64Encode: s => new Buffer(s).toString('base64'),
  base64Decode: s => new Buffer(s, 'base64').toString('ascii')
}
