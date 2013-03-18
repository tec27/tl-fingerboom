;(function(e,t,n,r){function i(r){if(!n[r]){if(!t[r]){if(e)return e(r);throw new Error("Cannot find module '"+r+"'")}var s=n[r]={exports:{}};t[r][0](function(e){var n=t[r][1][e];return i(n?n:e)},s,s.exports)}return n[r].exports}for(var s=0;s<r.length;s++)i(r[s]);return i})(typeof require!=="undefined"&&require,{1:[function(require,module,exports){
/*jshint asi:true laxcomma:true browser:true */
(function init() {
  if(window.__fingerboomed) {
    return
  }
  if(!window.jQuery || !window.angular || !window.document.body) {
    return setTimeout(init, 16)
  }

  window.__fingerboomed = true

  var fingerboom = require('./fingerboom.js')
  fingerboom() // BOOM
})()

},{"./fingerboom.js":2}],2:[function(require,module,exports){
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


},{"./jquery.js":3,"./angular.js":4}],3:[function(require,module,exports){
module.exports = window.jQuery

},{}],4:[function(require,module,exports){
module.exports = window.angular

},{}]},{},[1])
;