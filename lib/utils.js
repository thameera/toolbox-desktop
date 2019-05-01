const { shell } = require('electron')

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

const sanitizeJSONString = str => {
  return str
    .replace(/ISODate\((".*")\)/g, "$1")
    .replace(/ObjectId\((".*")\)/g, "$1")
}

module.exports = {
  RingBuffer,
  openBrowser,
  sanitizeJSONString
}
