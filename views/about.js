;(function($) {

  const u = require(__dirname + '/../lib/utils')
  const electron = require('electron')

  const ID = 'ABOUT-PLUGIN'

  class About {
    constructor(element) {
      this.$el = $(element)

      this.setupUI()
    }

    setupUI() {
      const $topDiv = $(`
        <div class="about-top">
          <h2>DSE Toolbox</h2>
          <h3>v${electron.remote.app.getVersion()}</h3>
          <div><a xhref="https://github.com/thameera/toolbox/issues">&gt; Submit an issue or feature request</a></div>
          <div><a xhref="https://github.com/thameera/toolbox/releases">&gt; Check for new releases</a></div>
        </div>
      `)

      $topDiv.find('a').click(function() {
        u.openBrowser($(this).attr('xhref'))
      })

      this.$el.append($topDiv)
    }
  }

  $.fn.about = function() {

    return this.each(function() {
      const about = $(this).data(ID)
      if (!about) {
        $(this).data(ID, new About(this))
      }
    })

  }

}(jQuery));
