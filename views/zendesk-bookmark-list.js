;(function($) {

  const zdManager = require(__dirname + '/../lib/zd-manager')
  const u = require(__dirname + '/../lib/utils')

  const ID = 'ZENDESK-BOOKMARK-LIST-PLUGIN'

  class BookmarkList {
    constructor(element) {
      this.el = element
      this.$el = $(element)

      this.$topDiv = null

      this.setupUI()
      this.setupCallbacks()
    }

    setupUI() {
      this.$topDiv = $(`
        <div class="zd-bk-list">
          <span class="zd-bk-header">Bookmarks </span>
          <button class="zd-refresh-btn">Refresh</button>
          <ul></ul>
        </div>
      `)

      this.$el.append(this.$topDiv)
    }

    setupCallbacks() {
      const $btn = this.$topDiv.find('.zd-refresh-btn')
      $btn.click(async () => {
        $btn.text('Refreshing...').prop('disabled', true)
        const res = await zdManager.fetchBookmarks(10)
        $btn.text('Refresh').prop('disabled', false)
        if (res.result === 'ok') {
          this.drawBookmarks(res.bookmarks)
        } else {
          u.showError($btn, `Failed to fetch bookmarks:\n${res.error}`)
        }
      })
    }

    drawBookmarks(bookmarks) {
      const $ul = this.$topDiv.find('ul')
      $ul.empty()
      bookmarks.forEach(b => {
        const id = b.ticket.id
        const $li = $('<li>')
        const $href = $(`<a href='#'>${id} - ${u.truncate(b.ticket.subject, 60)}</a>`)
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
            u.showError($delete, `Failed to delete bookmark:\n${res.error}`)
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

