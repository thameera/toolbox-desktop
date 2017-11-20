;(function() {
  require('./views/parser.js')
  require('./views/zendesk.js')
  require('./views/converter.js')
  require('./views/diff.js')
  require('./views/reference.js')

  $('#tab-container').easytabs({
    animationSpeed: 'fast'
  })
    .bind('easytabs:after', (e, $clicked, $targetPanel) => {
      $targetPanel.find('.tab-focus').first().select()
    })

  try {
    $('#parser-left').parser()
    $('#parser-right').parser()

    $('#zendesk-content').zendesk()

    $('#converter-content').converter()

    $('#diff-content').diffviewer()

    $('#reference-content').reference()
  } catch(e) {
    // Packaging errors will cause this line to be reached
    alert(e)
  }

})();
