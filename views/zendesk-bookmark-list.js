;(function($) {

  const zdManager = require(__dirname + '/../lib/zd-manager')

  const ID = 'ZENDESK-BOOKMARK-LIST-PLUGIN'

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

  class BookmarkList {
    constructor(element) {
      this.el = element
      this.$el = $(element)

      this.$refreshBtn = null
      this.$ul = null

      this.setupUI()
      this.setupCallbacks()
    }

    setupUI() {
      const $topDiv = $('<div class="zd-bk-list">')

      const $header = $('<span class="zd-bk-header">Bookmarks </span>')
      $topDiv.append($header)
      this.$refreshBtn = $('<button class="zd-refresh-btn">Refresh</button>')
      $topDiv.append(this.$refreshBtn)

      this.$ul = $('<ul>')
      $topDiv.append(this.$ul)

      this.$el.append($topDiv)
    }

    setupCallbacks() {
      const $btn = this.$refreshBtn
      $btn.click(async () => {
        $btn.text('Refreshing...').prop('disabled', true)
        const res = await zdManager.fetchBookmarks(10)
        $btn.text('Refresh').prop('disabled', false)
        if (res.result === 'ok') {
          this.drawBookmarks(res.bookmarks)
        } else {
          showError($btn, `Failed to fetch bookmarks:\n${res.error}`)
        }
      })
    }

    drawBookmarks(bookmarks) {
      const $ul = this.$ul
      $ul.empty()
      bookmarks.forEach(b => {
        const id = b.ticket.id
        const $li = $('<li>')
        const $href = $(`<a href='#'>${id} - ${truncate(b.ticket.subject, 60)}</a>`)
        const $delete = $('<button class="delete">❌</button>')
        $href.click(e => {
          e.preventDefault()
          zdManager.openBookmarkOnBrowser(id)
        })
        $delete.click(async () => {
          $delete.prop('disabled', true)
          const res = await zdManager.deleteBookmark(b.id)
          if (res.result === 'ok' && res.id === b.id) {
            $href.css('text-decoration', 'line-through')
          } else {
            showError($delete, `Failed to delete bookmark:\n${res.error}`)
            $delete.prop('disabled', false)
          }
        })
        $li.append($href)
        $li.append($delete)
        $ul.append($li)
      })
    }
  }

  $.fn.zendeskBookmarkList = function() {

    return this.each( function() {
      const list = $(this).data(ID)
      if (!list) {
        $(this).data(ID, new BookmarkList(this))
      }
    });

  }

}(jQuery));

