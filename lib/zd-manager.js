const rp = require('request-promise-native')
const { shell } = require('electron')

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
    ticketURL: `${localStorage.zdURL}/agent/tickets`,
    opts: {
      json: true,
      headers: {
        Authorization: `Basic ${localStorage.zdToken}`
      }
    }
  }
}

const test = async () => {
  const res = await fetchBookmarks(1)
  if (res.result === 'ok') {
    return { success: true }
  } else {
    return { success: false, error: res.error }
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

const fetchBookmarks = async count => {
  console.log(`Fetching ${count} bookmarks`);
  const config = _getConfig()
  const opts = config.opts
  opts.url = `${config.baseURL}.json?per_page=${count}`
  opts.method = 'GET'
  try {
    const data = await rp(opts)
    console.log(data)
    return { result: 'ok', count: data.count, bookmarks: data.bookmarks }
  } catch (e) {
    return { result: 'error', error: e.message }
  }
}

const openBookmarkOnBrowser = id => {
  const config = _getConfig()
  shell.openExternal(`${config.ticketURL}/${id}`)
}

const deleteBookmark = async id => {
  console.log(`Deleting bookmark ${id}...`);
  const config = _getConfig()
  const opts = config.opts
  opts.url = `${config.baseURL}/${id}.json`
  opts.method = 'DELETE'
  try {
    await rp(opts)
    console.log('Deleted')
    return { result: 'ok', id: id }
  } catch (e) {
    console.log('Failed to delete')
    console.log(e)
    return { result: 'error', error: e.message }
  }
}

module.exports = {
  saveSettings,
  test,
  addBookmark,
  fetchBookmarks,
  openBookmarkOnBrowser,
  deleteBookmark
}
