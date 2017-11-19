const useragent = require('useragent')

module.exports = uastring => {
  const ua = useragent.parse(uastring)
  if (ua.family === 'Other' && ua.os.family === 'Other') {
    return null
  }

  return [
    { heading: 'User-Agent String' },
    { name: 'Browser', val: `${ua.family} ${ua.toVersion()}` },
    { name: 'OS', val: ua.os.toString() },
    { name: 'Device', val: ua.device.toString() },
  ]
}
