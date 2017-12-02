;(function($) {

  require('./zendesk-bookmark-list.js')
  const zdManager = require(__dirname + '/../lib/zd-manager')
  const u = require(__dirname + '/../lib/utils')

  const ID = 'ZENDESK-PLUGIN'

  class Zendesk {
    constructor(element) {
      this.el = element
      this.$el = $(element)

      this.$topDiv = null

      this.setupUI()
      this.setupCallbacks()
    }

    setupUI() {
      const $topDiv = $(`
        <div class="zendesk">
          <button class="zd-settings-btn">⚙️</button>
          <div class="settings">
            <div>Zendesk URL: </div>
            <input type="text" size="50" placeholder="eg: https://mycompany.zendesk.com" class="url-input">
            <div> Token: </div>
            <input type="text" size="50" class="token-input">
            <div class="zd-settings-btns">
              <button class="zd-settings-save-btn">Save</button>
              <button class="zd-settings-test-btn">Test</button>
            </div>
            <hr>
          </div>
          <div>Add new bookmark:
            <input type="number" class="tab-focus bookmark-input">
            <button class="zd-add-btn">Add</button>
            <hr>
          </div>
          <div class="zd-bk-list"></div>
        </div>
      `)

      $topDiv.find('.zd-bk-list').zendeskBookmarkList()

      this.$el.append($topDiv)
      this.$topDiv = $topDiv
    }

    setupCallbacks() {
      const $top = this.$topDiv
      $top.find('.zd-settings-btn').click(this.toggleSettings.bind(this))

      const $saveBtn = $top.find('.zd-settings-save-btn')
      const $urlInput = $top.find('.url-input')
      const $tokenInput = $top.find('.token-input')
      $saveBtn.click(() => {
        const saved = zdManager.saveSettings($urlInput.val().trim(), $tokenInput.val().trim())
        if (saved) {
          u.showSuccess($saveBtn, 'Settings saved')
          $urlInput.val('')
          $tokenInput.val('')
        }
      })

      const $testBtn = $top.find('.zd-settings-test-btn')
      $testBtn.click(async () => {
        $testBtn.text('Testing...').prop('disabled', true)
        const res = await zdManager.test()
        $testBtn.text('Test').prop('disabled', false)
        if (res.success) {
          u.showSuccess($testBtn, 'Test success!')
        } else {
          u.showError($testBtn, `Test failed\n${res.error}`)
        }
      })

      const $bookmarkInput = $top.find('.bookmark-input')
      $top.find('.zd-add-btn').click(this.addBookmark.bind(this))
      $bookmarkInput.keypress(e => {
        if (e.keyCode === 13) {
          this.addBookmark()
        }
      })
      $bookmarkInput.click(() => $bookmarkInput.select())
    }

    toggleSettings() {
      const $div = this.$topDiv.find('.settings')
      const display = $div.css('display')
      if (display === 'none') {
        $div.css('display', 'block')
      } else {
        $div.css('display', 'none')
      }
    }

    async addBookmark() {
      const $btn = this.$topDiv.find('.zd-add-btn')
      const $input = this.$topDiv.find('.bookmark-input')
      $btn.text('Adding...').prop('disabled', true)
      const res = await zdManager.addBookmark($input.val().trim())
      if (res.result === 'added') {
        u.showSuccess($btn, `Added new bookmark:\n${res.id}: ${res.title}`)
      } else if (res.result === 'duplicate') {
        u.showWarning($btn, 'Bookmark already exists')
      } else {
        u.showError($btn, `Failed to add bookmark:\n${res.error}`)
      }
      $input.select()
      $btn.text('Add').prop('disabled', false)
    }
  }

  $.fn.zendesk = function() {

    return this.each( function() {
      const zendesk = $(this).data(ID)
      if (!zendesk) {
        $(this).data(ID, new Zendesk(this))
      }
    });

  }

}(jQuery));
