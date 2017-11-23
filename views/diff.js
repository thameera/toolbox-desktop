;(function($) {

  const jsondiffpatch = require('jsondiffpatch').create({
    textDiff: {
      minLength: 60
    }
  })
  const formatters = require('jsondiffpatch/src/formatters')
  const JSON5 = require('json5')
  const examples = require(__dirname + '/../lib/examples/diff-examples')
  const u = require(__dirname + '/../lib/utils')

  const ID = 'DIFF-PLUGIN'

  class DiffViewer {
    constructor(element) {
      this.$el = $(element)
      this.$topDiv = null

      this.setupUI()
      this.setupCallbacks()
    }

    setupUI() {
      this.setupExamples()

      this.$topDiv = $(`
        <div class="diffviewer-top">
          <table class="inputs">
            <tr>
              <td class="input-left">
                <textarea class="left tab-focus" placeholder="Paste text or JSON"></textarea>
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

    setupExamples() {
      const $div = $('<div class="examples">')
      $div.append('<span class="minilabel">Examples</span>')

      const $select = $('<select>')
      $select.append($(`<option value="-1">-- select one --</option>`))
      examples.forEach((ex, i) => {
        $select.append($(`<option value="${i}">${ex.name}</option>`))
      })
      $div.append($select)

      const $btn = $('<button>Try</button>')
      $btn.click(() => {
        const val = $select.find('option:selected').val()
        if (val === '-1') return
        const diff = examples[Number(val)]
        this.$el.find('textarea.left').val(diff.left)
        this.$el.find('textarea.right').val(diff.right).trigger('input')
      })
      $div.append($btn)

      this.$el.append($div)
    }


    setupCallbacks() {
      const $inputs = this.$topDiv.find('.inputs textarea')

      $inputs.bind('input propertychange', () => {
        const left = $inputs.first().val()
        const right = $inputs.last().val()
        try {
          const jleft = JSON5.parse(u.sanitizeJSONString(left))
          const jright = JSON5.parse(u.sanitizeJSONString(right))
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
