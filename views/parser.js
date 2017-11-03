;(function($) {

  const urlParser = require('./lib/url-parser')

  const ID = 'PARSER-PLUGIN'

  const createCopyBtn = text => {
    return $(`<button class="copy-btn" data-clipboard-text="${text}">📝</button>`)
  }

  class Parser {
    constructor(element) {
      this.el = element
      this.$el = $(element)
      this.$text = null
      this.$results = null

      this.setup()
    }

    setup() {
      this.$text = $('<textarea rows="6" class="tab-focus"></textarea>')
      this.$text.bind('input propertychange', this.start.bind(this))

      this.$results = $('<div class="parser-results"></div>')

      this.$el.append(this.$text)
      this.$el.append(this.$results)
    }

    start() {
      const text = this.$text.val().trim()
      const urlFields = urlParser(text)
      if (urlFields) {
        return this.showUrl(urlFields)
      }
    }

    replaceResult($result) {
      this.$results.empty()
      this.$results.append($result)
      new Clipboard('.copy-btn')
    }

    showUrl(urlFields) {
      const $table = $('<table class="url"></table>')
      urlFields.forEach(f => {
        const $tr = $('<tr>')
        if (f.heading) {
          const $td = (`<td class="heading">${f.heading}</td>`)
          $tr.append($td)
        } else {
          const $td1 = $(`<td class="key">${f.name}</td>`)
          const $td2 = $(`<td class="copy"></td>`)
          $td2.append(createCopyBtn(f.val))
          const $td3 = $(`<td class="val">${f.val}</td>`)
          $tr.append($td1)
          $tr.append($td2)
          $tr.append($td3)
        }
        $table.append($tr)
      })
      this.replaceResult($table)
    }
  }

  $.fn.parser = function() {

    return this.each(function() {
      const parser = $(this).data(ID)
      if (!parser) {
        $(this).data(ID, new Parser(this))
      }
    })

  }

}(jQuery));
