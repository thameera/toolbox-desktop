;(function($) {

  const zdManager = require(__dirname + '/../lib/zd-manager')

  const ID = 'ZENDESK-PLUGIN'

  const showSuccess = ($el, msg) => {
    $el.notify(msg, { className: 'success', autoHide: true, autoHideDelay: 2000 })
  }

  const showWarning = ($el, msg) => {
    $el.notify(msg, { className: 'warning', autoHide: true, autoHideDelay: 2000 })
  }

  const showError = ($el, msg) => {
    $el.notify(msg, { className: 'error', autoHide: true, autoHideDelay: 2000 })
  }

  class Zendesk {
    constructor(element) {
      this.el = element
      this.$el = $(element)

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
      $topDiv.append($settingsDiv)
      this.$settingsDiv = $settingsDiv

      const $bkDiv = $('<div>Add new bookmark: </div>')
      this.$bookmarkInput = $('<input type="number">')
      this.$bookmarkAddBtn = $('<button class="zd-add-btn">Add</button>')
      this.$bookmarkList = $('<div>')

      $bkDiv.append(this.$bookmarkInput)
      $bkDiv.append(this.$bookmarkAddBtn)
      $topDiv.append($bkDiv)
      $topDiv.append(this.$bookmarkList)

      this.$el.append($topDiv)
    }

    setupCallbacks() {
      this.$settingsSaveBtn.click(() => {
        const saved = zdManager.saveSettings(this.$urlInput.val().trim(), this.$tokenInput.val().trim())
        if (saved) {
          showSuccess(this.$settingsSaveBtn, 'Settings saved')
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
          showSuccess($testBtn, 'Test success!')
        } else {
          showError($testBtn, `Test failed\n${res.error}`)
        }
      })

      this.$bookmarkAddBtn.click(this.addBookmark.bind(this))
      this.$bookmarkInput.keypress(e => {
        if (e.keyCode === 13) {
          this.addBookmark()
        }
      })
    }

    async addBookmark() {
      const $btn = this.$bookmarkAddBtn
      const $input = this.$bookmarkInput
      $btn.text('Adding...').prop('disabled', true)
      const res = await zdManager.addBookmark($input.val().trim())
      if (res.result === 'added') {
        showSuccess($btn, `Added new bookmark:\n${res.id}: ${res.title}`)
      } else if (res.result === 'duplicate') {
        showWarning($btn, 'Bookmark already exists')
      } else {
        showError($btn, `Failed to add bookmark:\n${res.error}`)
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
