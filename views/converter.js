;(function($) {

  const c = require(__dirname + '/../lib/convert-utils')
  const u = require(__dirname + '/../lib/utils')

  const ID = 'CONVERTER-PLUGIN'

  class Converter {
    constructor(element) {
      this.el = element
      this.$el = $(element)
      this.$topDiv = null

      this.results = new u.RingBuffer(4)

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
              <table>
                <tr class="result">
                  <td class="td-left"><textarea rows="4" class="output" disabled></textarea></td>
                  <td class="td-right"><button class="copy-btn">📝 Copy</button></td>
                </tr>
                <tr>
                  <td><div class="label">Previous results</div></td>
                </tr>
                <tr class="result">
                  <td class="td-left"><textarea rows="2" class="output" disabled></textarea></td>
                  <td class="td-right"><button class="copy-btn">📝 Copy</button></td>
                </tr>
                <tr class="result">
                  <td class="td-left"><textarea rows="2" class="output" disabled></textarea></td>
                  <td class="td-right"><button class="copy-btn">📝 Copy</button></td>
                </tr>
                <tr class="result">
                  <td class="td-left"><textarea rows="2" class="output" disabled></textarea></td>
                  <td class="td-right"><button class="copy-btn">📝 Copy</button></td>
                </tr>
              </table>
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

      $input.click(() => $input.select())

      const bind = (id, fn) => {
        $d.find(`#${id}`).click(() => {
          const res = fn($input.val())
          this.results.push(res)
          this.updateResultUI()
        })
      }

      bind('base64-encode', c.base64Encode)
      bind('base64-decode', c.base64Decode)
    }

    updateResultUI() {
      const $d = this.$topDiv
      const $results = $d.find('.converter-results textarea.output')
      const $copyBtn = $d.find('.copy-btn')

      $d.find('.converter-results table tr.result').each((i, row) => {
        const result = this.results.peek(i)
        $(row).find('textarea').val(result)
        $(row).find('button').attr('data-clipboard-text', result)
      })
      new Clipboard('.copy-btn')
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
