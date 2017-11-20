;(function($) {

  const jsondiffpatch = require('jsondiffpatch').create({
    textDiff: {
      minLength: 60
    }
  })
  const formatters = require('jsondiffpatch/src/formatters')
  const JSON5 = require('json5')

  const ID = 'DIFF-PLUGIN'

  class DiffViewer {
    constructor(element) {
      this.$el = $(element)
      this.$topDiv = null

      this.setupUI()
      this.setupCallbacks()
    }

    setupUI() {
      this.$topDiv = $(`
        <div class="diffviewer-top">
          <table class="inputs">
            <tr>
              <td class="input-left">
                <textarea class="left" placeholder="Paste text or JSON"></textarea>
              </td>
              <td class="input-right">
                <textarea class="right" placeholder="Paste text or JSON"></textarea>
              </td>
            </tr>
          </table>

          <div class="output">
          </div>
        </div>
      `)

      this.$el.append(this.$topDiv)
    }

    setupCallbacks() {
      const $inputs = this.$topDiv.find('.inputs textarea')

      $inputs.bind('input propertychange', () => {
        const left = $inputs.first().val()
        const right = $inputs.last().val()
        try {
          const jleft = JSON5.parse(left)
          const jright = JSON5.parse(right)
          this.showDiff(jleft, jright)
        } catch (e) {
          this.showDiff(left, right)
        }
      })

      $inputs.click(function() {
        $(this).select()
      })
    }

    showDiff(left, right) {
      const delta = jsondiffpatch.diff(left, right)
      const html = formatters.html.format(delta, left)
      this.$topDiv.find('.output').empty().append($(html))
    }
  }

  $.fn.diffviewer = function() {

    return this.each(function() {
      const diffviewer = $(this).data(ID)
      if (!diffviewer) {
        $(this).data(ID, new DiffViewer(this))
      }
    })

  }

}(jQuery));
