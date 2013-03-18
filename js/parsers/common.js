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
