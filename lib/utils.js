const { shell } = require('electron')

const showSuccess = ($el, msg) => {
  $el.notify(msg, { className: 'success', autoHide: true, autoHideDelay: 2000 })
}

const showWarning = ($el, msg) => {
  $el.notify(msg, { className: 'warning', autoHide: true, autoHideDelay: 2000 })
}

const showError = ($el, msg) => {
  $el.notify(msg, { className: 'error', autoHide: true, autoHideDelay: 2000 })
}

const truncate = (msg, len) => {
  if (msg.length <= len-3) return msg
  return `${msg.substr(0, len-3)}...`
}

class RingBuffer {
  constructor(n) {
    this.buffer = []
    this.maxBufSize = n
  }

  push(val) {
    if (this.buffer.unshift(val) > this.maxBufSize) {
      this.buffer.pop()
    }
  }

  top() {
    return this.buffer[0]
  }

  peek(i) {
    return this.buffer[i]
  }
}

const openBrowser = link => shell.openExternal(link)

module.exports = {
  showSuccess,
  showWarning,
  showError,
  truncate,
  RingBuffer,
  openBrowser
}
