/*jshint asi:true laxcomma:true browser:true */
/*global chrome:true */
;(function() {
"use strict";

inject()

function inject() {
  if(!document.head) {
    return setTimeout(inject, 16)
  }
  if(document.head.classList.contains('fingerboomed')) {
    return
  }

  var scripts = [ 'angular.min.js'
                , 'fingerboom.js'
                ]
    , styles =  [ 'fingerboom.css'
                ]

  styles.forEach(function(styleName) {
    var styleUrl = chrome.extension.getURL(styleName)
      , styleElem = document.createElement('link')

    styleElem.rel = 'stylesheet'
    styleElem.type = 'text/css'
    styleElem.href = styleUrl
    document.head.appendChild(styleElem)
  })

  scripts.forEach(function(scriptName) {
    var scriptUrl = chrome.extension.getURL(scriptName)
      , scriptElem = document.createElement('script')

    scriptElem.type = 'text/javascript'
    scriptElem.src = scriptUrl
    document.head.appendChild(scriptElem)
  })
}

})();
