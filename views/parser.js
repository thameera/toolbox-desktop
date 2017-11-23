;(function($) {

  const urlParser = require(__dirname + '/../lib/parsers/url-parser')
  const jwtParser = require(__dirname + '/../lib/parsers/jwt-parser')
  const samlParser = require(__dirname + '/../lib/parsers/saml-parser')
  const jsonParser = require(__dirname + '/../lib/parsers/json-parser')
  const xmlParser = require(__dirname + '/../lib/parsers/xml-parser')
  const uaParser = require(__dirname + '/../lib/parsers/ua-parser')
  const examples = require(__dirname + '/../lib/examples/parser-examples')

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
      this.setupExamples()

      this.$text = $('<textarea rows="6" class="tab-focus input" placeholder="Paste a URL, JWT, SAML token, JSON, XML, or UserAgent string"></textarea>')
      this.$text.bind('input propertychange', this.start.bind(this))
      this.$text.click(() => this.$text.select())

      this.$results = $('<div class="parser-results"></div>')

      this.$el.append(this.$text)
      this.$el.append(this.$results)
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
        const str = examples[Number(val)].value
        this.$el.find('textarea.input').val(str).trigger('input')
      })
      $div.append($btn)

      this.$el.append($div)
    }

    async start() {
      const text = this.$text.val().trim()

      if (!text) return this.$results.empty()

      const urlFields = urlParser(text)
      if (urlFields) {
        return this.showUrl(urlFields)
      }

      // In JWTs, support parsing if there are newlines in-between as well
      // Some HAR parsers split the params into lines
      const jwtFields = jwtParser(text) || jwtParser(text.replace(/\n/g, ''))
      if (jwtFields) {
        return this.showJWT(jwtFields)
      }

      try {
        const res = await samlParser(text)
        return this.showSAML(res)
      } catch (e) {}

      const json = jsonParser(text)
      if (json) {
        return this.showJSON(json)
      }

      try {
        const res = await xmlParser(text)
        return this.showXML(res, true)
      } catch (e) {}

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

    generateCodemirror($container, code, height) {
      const $textarea = $(`<textarea>${code}</textarea>`)
      // Invoke codemirror after drawing to UI
      setTimeout(() => {
        const cm = CodeMirror.fromTextArea($textarea[0], {
          mode: 'xml',
          lineNumbers: true,
          foldGutter: true,
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
        })
        if (height) {
          cm.setSize(null, height)
        }
      }, 0)
      $container.append($textarea)
    }

    generateJSONViewer($container, json, opts) {
      const $pre = $('<pre id="json-renderer"></pre>')
      const btnLabel = opts.isCollapsed ? 'Expand All' : 'Collapse All'
      const $btn = $(`<button>${btnLabel}</button>`)
      $btn.click(() => {
        opts.isCollapsed = !opts.isCollapsed
        this.generateJSONViewer($container, json, opts)
      })

      $pre.jsonViewer(json, { collapsed: opts.isCollapsed, withQuotes: opts.withQuotes })
      $container.empty()
      $container.append($btn)
      $container.append($pre)
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

    showJSON(json) {
      const $topDiv = $('<div>')
      this.generateJSONViewer($topDiv, json, { isCollapsed: false })
      this.replaceResult($topDiv)
    }

    showXML(xmlRes, isXML) {
      const $topDiv = $('<div>')

      const content = isXML ? xmlRes.xml : JSON.stringify(xmlRes.json)
      const title = isXML ? 'Prettified XML' : 'JSON Representation'
      const btnLabel = isXML ? 'Show JSON' : 'Show XML'

      const $heading1 = $(`<div class="heading">${title}</div>`)
      $heading1.append(createCopyBtn(content))
      const $btn = $(`<button class="xml-btn">${btnLabel}</button>`).click(() => {
        this.showXML(xmlRes, !isXML)
      })
      $heading1.append($btn)
      $topDiv.append($heading1)

      const $container = $('<div>')
      if (isXML) {
        this.generateCodemirror($container, xmlRes.xml)
      } else {
        this.generateJSONViewer($container, xmlRes.json, { isCollapsed: false })
      }
      $topDiv.append($container)

      this.replaceResult($topDiv)
    }

    showSAML(samlFields) {
      const $topDiv = $('<div>')

      const $heading1 = $('<div class="heading">XML:</div>')
      $heading1.append(createCopyBtn(samlFields.xml))
      $topDiv.append($heading1)

      const $cm = $('<div>')
      this.generateCodemirror($cm, samlFields.xml, 200)
      $topDiv.append($cm)

      const $heading2 = $('<div class="heading">Decoded Profile:</div>')
      $heading2.append(createCopyBtn(JSON.stringify(samlFields.profile)))
      $topDiv.append($heading2)

      const $json = $('<div>')
      this.generateJSONViewer($json, samlFields.profile, { withQuotes: true })
      $topDiv.append($json)

      this.replaceResult($topDiv)
    }

    showCharCount(text) {
      const charCount = text.length
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
