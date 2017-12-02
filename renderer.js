;(function() {
  require('./views/parser.js')
  require('./views/zendesk.js')
  require('./views/converter.js')
  require('./views/diff.js')
  require('./views/reference.js')
  require('./views/about.js')

  $('#tab-container').easytabs({
    animationSpeed: 'fast'
  })
    .bind('easytabs:after', (e, $clicked, $targetPanel) => {
      $targetPanel.find('.tab-focus').first().select()
    })

  try {
    $('#parser-left').parser()
    $('#parser-right-inner').parser()

    $('#zendesk-content').zendesk()

    $('#converter-content').converter()

    $('#diff-content').diffviewer()

    $('#reference-content').reference()

    $('#about-content').about()
  } catch(e) {
    // Packaging errors will cause this line to be reached
    alert(e)
  }

  // Collapse/expand right parser
  const $collapse = $('button.collapse-parser')
  let collapsed = false
  $collapse.click(() => {
    if (collapsed) {
      $('#parser-left').css({width: '50%'})
      $('#parser-right').css({width: '50%'})
      $('#parser-right-inner').show()
      $collapse.text('>>')
      collapsed = false
    } else {
      $('#parser-left').css({width: '100%'})
      $('#parser-right').css({width: '0%'})
      $('#parser-right-inner').hide()
      $collapse.text('<<')
      collapsed = true
    }
  })

})();
