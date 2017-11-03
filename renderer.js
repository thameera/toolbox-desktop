;(function() {

  $('#tab-container').easytabs({
    animationSpeed: 'fast'
  })

  $('#parser-left').parser()
  $('#parser-right').parser()

  $('#zendesk-content').zendesk()

})();
