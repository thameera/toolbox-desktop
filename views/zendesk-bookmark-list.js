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

  class BookmarkList {
    constructor(element) {
      this.el = element
      this.$el = $(element)

      this.$refreshBtn = null

      this.setupUI()
      this.setupCallbacks()
    }

    setupUI() {
      const $topDiv = $('<div class="zd-bk-list">')

      this.$refreshBtn = $('<button class="zd-refresh-btn">Refresh</button>')
      $topDiv.append(this.$refreshBtn)

      this.$el.append($topDiv)
    }

    setupCallbacks() {
      this.$refreshBtn.click(async () => {
        const res = await zdManager.fetchBookmarks(5)
        if (res.result === 'ok') {
          this.drawBookmarks(res.bookmarks)
        } else {
          showError(this.$refreshBtn, `Failed to fetch bookmarks:\n${res.error}`)
        }
      })
    }

    drawBookmarks(bookmarks) {
      console.log( bookmarks)
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

