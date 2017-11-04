;(function() {
  require('./views/parser.js')
  require('./views/zendesk.js')

  $('#tab-container').easytabs({
    animationSpeed: 'fast'
  })

  try {
    $('#parser-left').parser()
    $('#parser-right').parser()

    $('#zendesk-content').zendesk()
  } catch(e) {
    // Packaging errors will cause this line to be reached
    alert(e)
  }

})();
