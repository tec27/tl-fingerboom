/*jshint asi:true laxcomma:true browser:true evil:true */
var $ = require('./jquery.js')
  , angular = require('./angular.js')

module.exports = function fingerboom() {
  $(function() {
    var oldBodyElems = $('body').children().not('script').detach()

    // rewrite the document to get an html5 doctype
    // no need to rewrite scripts in the body, they've already executed anyway
    var newHtml = '<!DOCTYPE html><html><head class="fingerboomed">'
    $('head').children().not('script').each(function() {
      newHtml += this.outerHTML
    })
    newHtml += '</head><body></body></html>'
    document.write(newHtml) // one of the only times you'll ever see me use this!

    var fb = new FingerBoom(oldBodyElems)
  })
}

function FingerBoom(oldBodyElems) {
  this.oldBodyElems = oldBodyElems
}

