const rp = require('request-promise-native')

const saveSettings = (url, token) => {
  if (url) {
    localStorage.zdURL = url
  }
  if (token) {
    localStorage.zdToken = token
  }
  return (url || token)
}

const _getConfig = () => {
  return {
    baseURL: `${localStorage.zdURL}/api/v2/bookmarks`,
    opts: {
      json: true,
      headers: {
        Authorization: `Basic ${localStorage.zdToken}`
      }
    }
  }
}

const test = async () => {
  const config = _getConfig()
  const opts = config.opts
  opts.url = `${config.baseURL}.json?per_page=1`
  opts.method = 'GET'
  try {
    const data = await rp(opts)
    return { success: true }
  } catch (e) {
    return { success: false, error: e.message }
  }
}

const addBookmark = async id => {
  const nId = Number(id)
  console.log(`Adding bookmark ${id}`)
  const config = _getConfig()
  const opts = config.opts
  opts.url = `${config.baseURL}.json`
  opts.method = 'POST'
  opts.body = {
    bookmark: {
      ticket_id: nId
    }
  }

  try {
    const data = await rp(opts)
    if (!data || !data.bookmark) {
      console.log('Duplicate')
      return { result: 'duplicate' }
    } else {
      console.log(`Added bookmark: ${data.bookmark.ticket.subject}`)
      return { result: 'added', id: data.bookmark.ticket.id, title: data.bookmark.ticket.subject }
    }
  } catch (e) {
    console.log(`Failed to add bookmark: ${e.message}`)
    return { result: 'error', error: e.message }
  }
}

module.exports = {
  saveSettings,
  test,
  addBookmark
}
