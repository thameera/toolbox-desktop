;(function($) {

  const ID = 'PARSER-PLUGIN'

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
      this.$results = $('<div class="parser-results">res</div>')

      this.$el.append(this.$text)
      this.$el.append(this.$results)
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
