;(function($) {

  const r = require(__dirname + '/../lib/reference')

  const ID = 'REFERENCE-PLUGIN'

  class Reference {
    constructor(element) {
      this.el = element
      this.$el = $(element)
      this.$topDiv = null
      this.refs = null

      this.setupUI()
      this.setupCallbacks()
      this.setupReferences()
      this.updateUI('ascii')
    }

    setupUI() {
      this.$topDiv = $(`
        <div class="reference-top">
          <div class="list">
            <select size="10" id="select">
              <option value="ascii" selected>ASCII Chart</option>
            </select>
          </div>
          <div class="results">
          </div>
        </div>
      `)

      this.$el.append(this.$topDiv)
    }

    setupCallbacks() {
      const $select = this.$topDiv.find('#select')
      $select.change(() => {
        const val = $select.find('option:selected').val()
        this.updateUI(val)
      })
    }

    setupReferences() {
      this.refs = {
        ascii: this.generateAsciiTable()
      }
    }

    generateAsciiTable() {
      const $table = $(`
        <table class="ascii" border="1">
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

    updateUI(val) {
      const $results = this.$topDiv.find('.results')
      $results.empty()
      $results.append(this.refs[val])
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
