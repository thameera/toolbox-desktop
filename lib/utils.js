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

module.exports = {
  showSuccess,
  showWarning,
  showError,
  truncate
}
