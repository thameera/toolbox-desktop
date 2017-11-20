;(function($) {

  const r = require(__dirname + '/../lib/reference')
  const u = require(__dirname + '/../lib/utils')

  const ID = 'REFERENCE-PLUGIN'

  class Reference {
    constructor(element) {
      this.el = element
      this.$el = $(element)
      this.$topDiv = null
      this.refs = null

      this.setupUI()
      this.setupCallbacks()
      this.updateUI('ascii')
    }

    setupUI() {
      this.$topDiv = $(`
        <div class="reference-top">
          <div class="list">
            <select size="10" id="select">
              <option value="ascii" selected>ASCII Chart</option>
              <option value="httpstatuses">HTTP Statuses</option>
            </select>
          </div>
          <div class="results">
          </div>
        </div>
      `)

      this.$el.append(this.$topDiv)

      const $res = this.$topDiv.find('.results')
      $res.append(this.generateAsciiTable())
      $res.append(this.generateHttpStatuses())
    }

    setupCallbacks() {
      const $select = this.$topDiv.find('#select')
      $select.change(() => {
        const val = $select.find('option:selected').val()
        this.updateUI(val)
      })
    }

    generateAsciiTable() {
      const $table = $(`
        <table class="ascii nodisplay" border="1">
          <tr>
            <th>Dec</th>
            <th>Hex</th>
            <th>Bin</th>
            <th>Character</th>
            <th>Description</th>
          </tr>
        </table>
      `)
      r.asciitable.forEach(row => {
        $table.append($(`
          <tr>
            <td>${row.dec}</td>
            <td>${row.hex}</td>
            <td>${row.bin}</td>
            <td>${row.character}</td>
            <td>${row.desc}</td>
          </tr>
        `))
      })
      return $table
    }

    generateHttpStatuses() {
      const $table = $(`
        <table class="httpstatuses nodisplay" border="1">
          <tr>
            <th>Code</th>
            <th>Description</th>
          </tr>
        </table>
      `)
      r.httpstatuses.forEach(row => {
        const code = row.link ? `<a xhref="${row.link}">${row.code}</a>` : `${row.code}`
        $table.append($(`
          <tr ${row.heading ? 'class="heading"' : ''}>
            <td>${code}</td>
            <td>${row.msg}</td>
          </tr>
        `))
      })
      $table.find('a').click(function(e) {
        u.openBrowser($(this).attr('xhref'))
      })
      return $table
    }

    updateUI(val) {
      this.$topDiv.find('.nodisplay').hide()
      this.$topDiv.find(`.${val}`).show()
    }
  }

  $.fn.reference = function() {

    return this.each(function() {
      const reference = $(this).data(ID)
      if (!reference) {
        $(this).data(ID, new Reference(this))
      }
    })

  }

}(jQuery));
