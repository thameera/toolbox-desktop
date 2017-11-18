;(function($) {

  const c = require(__dirname + '/../lib/convert-utils')

  const ID = 'CONVERTER-PLUGIN'

  class Converter {
    constructor(element) {
      this.el = element
      this.$el = $(element)
      this.$topDiv = null

      this.setupUI()
      this.setupCallbacks()
    }

    setupUI() {
      this.$topDiv = $(`
        <div class="converter-top">
          <div class="converter-left">
            <div class="label">Input</div>
            <textarea rows="6" class="tab-focus input" placeholder="Paste anything"></textarea>
            <div class="converter-results">
              <div class="label">Output</div>
              <div>
                <textarea rows="6" class="output" disabled></textarea>
                <button class="copy-btn">Copy</button>
              </div>
            </div>
          </div>
          <div class="converter-right">
            <div>
              <button id="base64-encode">Base64 Encode</button>
              <button id="base64-decode">Base64 Decode</button>
            </div>
          </div>
        </div>
      `)

      this.$el.append(this.$topDiv)
    }

    setupCallbacks() {
      const $d = this.$topDiv
      const $input = $d.find('textarea')
      const $results = $d.find('.converter-results textarea.output')
      const $copyBtn = $d.find('.copy-btn')

      $input.click(() => $input.select())

      const bind = (id, fn) => {
        $d.find(`#${id}`).click(() => {
          const res = fn($input.val())
          $results.val(res)
          $copyBtn.attr('data-clipboard-text', res)
          new Clipboard('.copy-btn')
        })
      }

      bind('base64-encode', c.base64Encode)
      bind('base64-decode', c.base64Decode)
    }
  }

  $.fn.converter = function() {

    return this.each(function() {
      const converter = $(this).data(ID)
      if (!converter) {
        $(this).data(ID, new Converter(this))
      }
    })

  }

}(jQuery));
