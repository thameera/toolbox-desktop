;(function($) {

  require('./zendesk-bookmark-list.js')
  const zdManager = require(__dirname + '/../lib/zd-manager')
  const u = require(__dirname + '/../lib/utils')

  const ID = 'ZENDESK-PLUGIN'

  class Zendesk {
    constructor(element) {
      this.el = element
      this.$el = $(element)

      this.$settingsToggleBtn = null
      this.$settingsDiv = null
      this.$urlInput = null
      this.$tokenInput = null
      this.$settingsSaveBtn = null
      this.$settingsTestBtn = null

      this.$bookmarkInput = null
      this.$bookmarkAddBtn = null
      this.$bookmarkList = null

      this.setupUI()
      this.setupCallbacks()
    }

    setupUI() {
      const $topDiv = $('<div class="zendesk">')

      this.$settingsToggleBtn = $('<button class="zd-settings-btn">⚙️</button>')
      $topDiv.append(this.$settingsToggleBtn)

      const $settingsDiv = $('<div class="settings">')
      $settingsDiv.append($('<div>Zendesk URL: </div>'))
      this.$urlInput = $('<input type="text" size="50">')
      $settingsDiv.append(this.$urlInput)
      $settingsDiv.append($('<div> Token: </div>'))
      this.$tokenInput = $('<input type="text" size="50">')
      const $settingsBtns = $('<div class="zd-settings-btns">')
      $settingsDiv.append(this.$tokenInput)
      this.$settingsSaveBtn = $('<button class="zd-settings-save-btn">Save</button>')
      $settingsBtns.append(this.$settingsSaveBtn)
      this.$settingsTestBtn = $('<button class="zd-settings-test-btn">Test</button>')
      $settingsBtns.append(this.$settingsTestBtn)
      $settingsDiv.append($settingsBtns)
      $settingsDiv.append($('<hr>'))
      $topDiv.append($settingsDiv)
      this.$settingsDiv = $settingsDiv

      const $bkDiv = $('<div>Add new bookmark: </div>')
      this.$bookmarkInput = $('<input type="number" class="tab-focus">')
      this.$bookmarkAddBtn = $('<button class="zd-add-btn">Add</button>')
      this.$bookmarkList = $('<div>')
      this.$bookmarkList.zendeskBookmarkList()

      $bkDiv.append(this.$bookmarkInput)
      $bkDiv.append(this.$bookmarkAddBtn)
      $bkDiv.append($('<hr>'))
      $topDiv.append($bkDiv)
      $topDiv.append(this.$bookmarkList)

      this.$el.append($topDiv)
    }

    setupCallbacks() {
      this.$settingsToggleBtn.click(this.toggleSettings.bind(this))

      this.$settingsSaveBtn.click(() => {
        const saved = zdManager.saveSettings(this.$urlInput.val().trim(), this.$tokenInput.val().trim())
        if (saved) {
          u.showSuccess(this.$settingsSaveBtn, 'Settings saved')
          this.$urlInput.val('')
          this.$tokenInput.val('')
        }
      })

      const $testBtn = this.$settingsTestBtn
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

      this.$bookmarkAddBtn.click(this.addBookmark.bind(this))
      this.$bookmarkInput.keypress(e => {
        if (e.keyCode === 13) {
          this.addBookmark()
        }
      })
    }

    toggleSettings() {
      const $div = this.$settingsDiv
      const display = $div.css('display')
      if (display === 'none') {
        $div.css('display', 'block')
      } else {
        $div.css('display', 'none')
      }
    }

    async addBookmark() {
      const $btn = this.$bookmarkAddBtn
      const $input = this.$bookmarkInput
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
