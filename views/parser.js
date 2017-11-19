;(function($) {

  const urlParser = require(__dirname + '/../lib/parsers/url-parser')
  const jwtParser = require(__dirname + '/../lib/parsers/jwt-parser')
  const samlParser = require(__dirname + '/../lib/parsers/saml-parser')
  const jsonParser = require(__dirname + '/../lib/parsers/json-parser')
  const uaParser = require(__dirname + '/../lib/parsers/ua-parser')

  const ID = 'PARSER-PLUGIN'

  const createCopyBtn = text => {
    const $btn = $(`<button class="copy-btn">📝</button>`)
    $btn.attr('data-clipboard-text', text)
    return $btn
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
      this.$text = $('<textarea rows="6" class="tab-focus input" placeholder="Paste a URL, JWT, SAML token, JSON or UserAgent string"></textarea>')
      this.$text.bind('input propertychange', this.start.bind(this))
      this.$text.click(() => this.$text.select())

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

      const jwtFields = jwtParser(text)
      if (jwtFields) {
        return this.showJWT(jwtFields)
      }

      const promise = samlParser(text)
      if (promise) {
        return promise
          .then(samlFields => this.showSAML(samlFields))
          .catch(() => this.showCharCount(text))
      }

      const json = jsonParser(text)
      if (json) {
        return this.showJSON(json, false)
      }

      // UA parsing should be done at the end
      // since it recognizes any text with a UA string inside as a UA
      const ua = uaParser(text)
      if (ua) {
        return this.showUA(ua)
      }

      // If all parsers fail, show charactr count
      this.showCharCount(text)
    }

    replaceResult($result) {
      this.$results.empty()
      this.$results.append($result)
      new Clipboard('.copy-btn')
    }

    generateTable(fields) {
      const $table = $('<table></table>')
      fields.forEach(f => {
        const $tr = $('<tr>')
        if (f.heading) {
          const $td = (`<td class="heading">${f.heading}</td>`)
          $tr.append($td)
        } else {
          const $td1 = $(`<td class="key">${f.name}</td>`)
          const $td2 = $(`<td class="copy"></td>`)
          $td2.append(createCopyBtn(f.val))
          const tooltip = f.tooltip ? `class="dotted" data-balloon="${f.tooltip}" data-balloon-pos="right"` : ''
          const $td3 = $(`<td class="val"><span ${tooltip}>${f.val}</span></td>`)
          $tr.append($td1)
          $tr.append($td2)
          $tr.append($td3)
        }
        $table.append($tr)
      })
      this.replaceResult($table)
    }

    showUrl(urlFields) {
      this.generateTable(urlFields)
    }

    showJWT(jwtFields) {
      this.generateTable(jwtFields)
    }

    showUA(uaFields) {
      this.generateTable(uaFields)
    }

    showJSON(json, isCollapsed) {
      const $pre = $('<pre id="json-renderer"></pre>')
      const btnLabel = isCollapsed ? 'Expand All' : 'Collapse All'
      const $btn = $(`<button>${btnLabel}</button>`)
      $btn.click(() => {
        this.showJSON(json, !isCollapsed)
      })

      this.$results.empty()
      this.$results.append($btn)
      this.$results.append($pre)

      $pre.jsonViewer(json, { collapsed: isCollapsed })
    }

    showSAML(samlFields) {
      const $topDiv = $('<div>')

      const $heading1 = $('<div class="heading">XML:</div>')
      $heading1.append(createCopyBtn(samlFields.xml))
      $topDiv.append($heading1)

      const $textarea = $(`<textarea rows="10">${samlFields.xml}</textarea>`)
      $topDiv.append($textarea)
      // Invoke codemirror after drawing to UI
      setTimeout(() => {
        const cm = CodeMirror.fromTextArea($textarea[0], {
          mode: 'xml',
          lineNumbers: true,
          foldGutter: true,
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
        })
        cm.setSize(null, 200)
      }, 0)

      const $heading2 = $('<div class="heading">Decoded Profile:</div>')
      $heading2.append(createCopyBtn(JSON.stringify(samlFields.profile)))
      $topDiv.append($heading2)

      const $pre = $('<pre id="json-renderer"></pre>')
      $pre.jsonViewer(samlFields.profile, { withQuotes: true })
      $topDiv.append($pre)

      this.replaceResult($topDiv)
    }

    showCharCount(text) {
      const charCount = text.length
      if (charCount === 0) {
        return this.$results.empty()
      }
      const wordCount = text.split(/\s/).filter(w => !!w).length
      const $pre = $(`<pre>${wordCount} words\n${charCount} characters</pre>`)
      this.$results.empty()
      this.$results.append($pre)
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
