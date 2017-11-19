const useragent = require('useragent')

module.exports = uastring => {
  const ua = useragent.parse(uastring)
  if (ua.family === 'Other' && !ua.os) {
    return null
  }

  return [
    { name: 'Browser', val: `${ua.family} ${ua.toVersion()}` },
    { name: 'OS', val: ua.os.toString() },
    { name: 'Device', val: ua.device.toString() },
  ]
}
