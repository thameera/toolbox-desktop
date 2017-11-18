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
              <div class="label">Output <button class="moveup-btn">↖️</button></div>
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
            <div class="label">Web Encodings</div>
            <div>
              <button id="base64-encode">Base64 Encode</button>
              <button id="base64-decode">Base64 Decode</button>
            </div>
            <div>
              <button id="url-encode">URL Encode</button>
              <button id="url-decode">URL Decode</button>
            </div>
            <div>
              <button id="html-encode">HTML Encode</button>
              <button id="html-decode">HTML Decode</button>
            </div>
            <div class="label">Text Processing</div>
            <div>
              <button id="to-upper">To Uppercase</button>
              <button id="to-lower">To Lowercase</button>
            </div>
            <div>
              <button id="trim">Trim</button>
              <button id="reverse">Reverse</button>
            </div>
            <div>
              <input type="text" id="replace-src" placeholder="replace" size="10"/>
              <input type="text" id="replace-dest" placeholder="with" size="10"/>
              <button id="replace">Replace</button>
            </div>
            <div class="label">Time</div>
            <div>
              <span class="mini-label">Convert from</span>
              <button id="convert-unix-ms">Unix ms</button>
              <button id="convert-unix">Unix sec</button>
            </div>
            <div>
              <span class="mini-label">Current time</span>
              <button id="cur-time-formatted">Formatted</button>
              <button id="cur-time-unix-ms">Unix ms</button>
              <button id="cur-time-unix">Unix sec</button>
            </div>
            <div class="label">Misc</div>
            <div>
              <button id="generate-uuid">Generate UUID</button>
            </div>
            <div>
              <button id="ip">Get my IP</button>
            </div>
          </div>
        </div>
      `)

      this.$el.append(this.$topDiv)
    }

    setupCallbacks() {
      const $d = this.$topDiv
      const $input = $d.find('textarea.input')

      $d.find('input,textarea').click(function() {
        $(this).select()
      })

      $d.find('.moveup-btn').click(() => {
        $input.val(this.results.top())
      })

      const bind = (id, fn, ...args) => {
        $d.find(`#${id}`).click(() => {
          // If there are any 'args', add them as well
          const argArray = args.reduce((curr, arg) => {
            return curr.concat([$(`#${arg}`).val()])
          }, [$input.val()])

          const res = fn.apply(null, argArray)

          if (res instanceof Promise) {
            $d.find('textarea.output').first().val('please wait...')
            return res.then(resp => {
              this.results.push(resp)
              this.updateResultUI()
            })
          }

          this.results.push(res)
          this.updateResultUI()
        })
      }

      bind('base64-encode', c.base64Encode)
      bind('base64-decode', c.base64Decode)
      bind('url-encode', c.urlEncode)
      bind('url-decode', c.urlDecode)
      bind('html-encode', c.htmlEncode)
      bind('html-decode', c.htmlDecode)

      bind('to-upper', c.toUpper)
      bind('to-lower', c.toLower)
      bind('trim', c.trim)
      bind('reverse', c.reverse)
      bind('replace', c.replace, 'replace-src', 'replace-dest')

      bind('convert-unix-ms', c.convertFromMs)
      bind('convert-unix', c.convertFromUnix)
      bind('cur-time-formatted', c.curTimeFormatted)
      bind('cur-time-unix-ms', c.curTimeUnixMilli)
      bind('cur-time-unix', c.curTimeUnix)

      bind('generate-uuid', c.uuid)
      bind('ip', c.ip)
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
