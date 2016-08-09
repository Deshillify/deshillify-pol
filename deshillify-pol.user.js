// ==UserScript==
// @name        /pol/ Deshillifier
// @namespace   4chan
// @include     http*://boards.4chan.org/pol/*
// @version     1
// @grant       none
// ==/UserScript==
// Include jQuery for easier DOM manipulation. Callback will be the main function.
var addJQuery = function (callback) {
  var script = document.createElement('script');
  script.setAttribute('src', '//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js');
  script.addEventListener('load', function () {
    var script = document.createElement('script');
    script.textContent = 'window.jQ=jQuery.noConflict(true);(' + callback.toString() + ')();';
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
};
// Where everything happens
var main = function () {
  // The guid. This guid is used to identify shill threads at the front page. DO NOT CHANGE THIS VALUE!
  var guid = '9B3E595A37AE4682BA443FDB6595B110';
  
  // Text inside reply textarea. THE GUID HAS TO BE IN THE FIRST LINE! This is done so we can identify shill threads at the front page.
  var shillReplyText = '>' + guid + '\n'
  + 'SHILL THREAD! DO NOT REPLY AT ALL!\n'
  + '>SHILL THREAD! DO NOT REPLY AT ALL!\n'
  + 'SHILL THREAD! DO NOT REPLY AT ALL!\n\n'
  + 'Do not engage with OP in any form! This is a paid shill post, its only purpose is to flood this board with pro-hillary shit.\n'
  + 'Leave this thread immediately, DO NOT REPLY AT ALL, even if OP tries hard to bait you. They are being PAID to waste your attention.\n\n'
  + 'ADD THIS USERSCRIPT TO GREASEMONKEY (FIREFOX) OR TAMPERMONKEY (CHROME): raw codepile net/pile/zDLkPQNw\n'
  + '(replace spaces with dots)';
  var path = window.location.pathname;
  
  // Returns all classes as array
  jQ.fn.classList = function () {
    if (this.length) {
      return this[0].className.split(/\s+/);
    }
    return [];
  };
  
  // Adds a deshillify button to a single thread
  // param thread: jQuery object of entire thread
  // param front: If true, we are at the front page. Deshillify button's click handler will link to the thread page with autofilled reply dialog opened.
  //              If false, we are at the thread page. Deshillify button's click handler will open autofilled reply dialog.
  var deshillifySingleThread = function (thread, front) {
    var span = jQ('<span />').addClass('shillInfo').insertAfter(thread.find('.opContainer .nameBlock:visible'));
    var button = jQ('<button type=\'button\' />').addClass('deshillifyButton').css({
      'color': 'white',
      'font-weight': 'bold',
      'background-color': 'red'
    }).text('SHILL THREAD?').click(function () {
      var parent = jQ(this).closest('.postInfo');
      if (front) {
        var link = parent.find('a.replylink');
        window.location = link.attr('href') + '#deshillify';
      } 
      else {
        var sel = parent.find('.postNum');
        sel.children('a') [1].click();
        var textArea = jQ('textarea[name=\'com\']').width(800).val(shillReplyText);
        jQ('#qrEmail').val('sage');
        setTimeout(function () {
          textArea.scrollTop(0);
        }, 250);
      }
    }).appendTo(span);
  };
  // Adds deshillify buttons for the front page and replies that already contain the magic guid identify a shill thread. Shill threads will be removed.
  var deshillifyFront = function () {
    jQ('.thread').each(function (i, t) {
      deshillifySingleThread(jQ(t), true);
    });
    jQ('.reply .postMessage').each(function (i, e) {
      var elem = jQ(e);
      var text = elem.text();
      if (text.indexOf(guid) >= 0) {
        elem.closest('.thread').html('THIS SHILL THREAD HAS BEEN REMOVED! NOTHING TO SEE HERE!');
      }
    });
  };
  // Adds deshillify button for the thread of this thread page and, if deshillify has is present in url, opens the autofilled reply dialog
  var deshillifyThread = function () {
    deshillifySingleThread(jQ('.thread'), false);
    if ('#deshillify' === window.location.hash) {
      jQ('.deshillifyButton').trigger('click');
      history.pushState('', document.title, window.location.pathname);
    }
  };
  jQ(document).ready(function () {
    if (/\/pol\/thread/.test(path)) {
      deshillifyThread();
    } 
    else if (/\/pol\/catalog/.test(path)) {
      // Todo: Deshillify catalog page
    } 
    else if (/\/pol\/archive/.test(path)) {
      // Todo: Deshillify archive page
    } 
    else {
      deshillifyFront();
    }
  });
};
addJQuery(main);