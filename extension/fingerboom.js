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
/*jshint asi:true, laxcomma:true, browser:true, evil:true */
var $ = require('./jquery.js')
  , angular = require('./angular.js')
  , parsers = { common: require('./parsers/common.js')
              }

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

  this.commonData = parsers.common(this.oldBodyElems)
  console.dir(this.commonData)
}


},{"./jquery.js":3,"./angular.js":4,"./parsers/common.js":5}],3:[function(require,module,exports){
module.exports = window.jQuery

},{}],4:[function(require,module,exports){
module.exports = window.angular

},{}],5:[function(require,module,exports){
/*jshint asi:true, laxcomma:true, browser:true */

// parses the elements that are common to all TL pages
module.exports = function parse(elements) {
  var results = {}
  
  ;[ parseTopMenuBar(elements)
  , parseBannerArea(elements)
  ].forEach(function(obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key)) {
        results[key] = obj[key]
      }
    }
  })

  return results
}

function getLinkObj(i, elem) {
  var $elem = $(elem)
  return  { innerHtml: $elem.html()
          , href: $elem.attr('href')
          }
}

function parseTopMenuBar(elements) {
  var topMenuBar = elements.find('.topmenubar')
    , links = topMenuBar.find('.top_menu > div > a').map(getLinkObj).get()
    , times = topMenuBar.find('#timebar').html()
    , results = { siteLinks: links, times: times }
    , loginContainer = topMenuBar.find('#loginbox')

  if(loginContainer.length) {
    results.loginUrl = loginContainer.find('form').attr('action')
    results.registerUrl = loginContainer.find('table a').attr('href')
  }

  return results
}

function parseBannerArea(elements) {
  var areaTable = elements.find('.topmenubar').next('table')
    , areaRows = areaTable.find('> tbody > tr')
    , topContent = areaRows.eq(0).children('td')
    , menuContent = areaRows.eq(1).children('td').children()
    , results = {}

  results.backgroundImageCss = topContent.css('background-image')
  var loggedInDiv = topContent.find('.loggedin')
  if(loggedInDiv.length) {
    results.loggedIn = true

    var linksContainer = loggedInDiv.find('.li_links')
      , links = linksContainer.children('a')
    results.userLinks = links.map(getLinkObj).get()
    // the current user's name is not inside a span or anything, so we have to "creative" :(
    var namePattern = /^Logout\W+:\W+([^\W].*?)PM/
    results.currentUser = (namePattern.exec(linksContainer.text()) || ['', ''])[1]

    // there's also a link for taking the stream online, but it uses a JS function I'll be rewriting
    results.userStreamStatus = linksContainer.find('#streamstatus').text()
  }

  var topRight = topContent.find('.topright')
    , streamTexts = topRight.children('span')
    , liveStreamSpan = streamTexts.eq(0)
    , viewersSpan = streamTexts.eq(1)

  results.numLiveStreams = +(/:\W+(\d+)\W+live$/.exec(liveStreamSpan.text()) || ['', '0'])[1]
  results.numStreamViewers = +(/^\d+/.exec(viewersSpan.text()) || ['0'])[0]
  // yet another piece of useful text that is not within a span, more creativity! :(((
  results.numActiveUsers = +(/Active:\W+(\d+)/.exec(topRight.text()) || ['', '0'])[1]
  results.searchUrl = menuContent.filter('#searchbox').attr('action')

  var menuContainer = menuContent.filter('ul')
    , topLevelEntries = menuContainer.find('> li > a')

  results.menu = topLevelEntries.map(function(i, elem) {
    var $elem = $(elem)
    if(!$elem.is('.sf-with-ul')) {
      // basic menu entry, no dropdown
      return { innerHtml: $elem.html(), href: $elem.attr('href') }
    } else {
      // nested menu item
      var menuText = $elem.text().split($elem.children('.sf-sub-indicator').text())[0].trim()
        , subMenu = $elem.next('ul').find('a').map(function(j, subElem) {
            var $subElem = $(subElem)
            return { innerHtml: $subElem.html(), href: $subElem.attr('href') }
          }).get()
      return { nestedMenuName: menuText, nestedMenuItems: subMenu, href: $elem.attr('href') }
    }
  }).get()

  return results
}

},{}]},{},[1])
;