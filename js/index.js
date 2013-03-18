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
